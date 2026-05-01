// @vitest-environment node
import {
  describe, it, expect, afterEach, beforeAll, afterAll, vi,
} from 'vitest';
import request from 'supertest';

const app = require('../../services/app');
const { substituteEnv } = require('../../services/cors-proxy');

describe('CORS proxy', () => {
  it('rejects missing Target-URL', async () => {
    const res = await request(app).get('/cors-proxy');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Target-URL');
  });

  it('rejects invalid URL', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'not-a-url');
    expect(res.status).toBe(400);
  });

  it('rejects file:// scheme', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'file:///etc/passwd');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('http');
  });

  it('rejects ftp:// scheme', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'ftp://x.com');
    expect(res.status).toBe(400);
  });

  it('blocks cloud metadata IPv4', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://169.254.169.254/');
    expect(res.status).toBe(403);
    expect(res.body.error).toContain('blocked');
  });

  it('blocks cloud metadata decimal bypass', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://2852039166/');
    expect(res.status).toBe(403);
  });

  it('blocks GCP metadata DNS', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://metadata.google.internal/');
    expect(res.status).toBe(403);
  });

  it('blocks Alibaba metadata', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://100.100.100.200/');
    expect(res.status).toBe(403);
  });

  it('blocks gopher:// scheme', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'gopher://evil:70/');
    expect(res.status).toBe(400);
  });

  it('blocks IPv4-mapped IPv6 metadata', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://[::ffff:169.254.169.254]/');
    expect(res.status).toBe(403);
  });

  it('blocks AWS IPv6 metadata', async () => {
    const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://[fd00:ec2::254]/');
    expect(res.status).toBe(403);
  });

  it('accepts POST method (needed for proxying APIs)', async () => {
    const res = await request(app).post('/cors-proxy').set('Target-URL', 'http://169.254.169.254/');
    expect(res.status).toBe(403); // blocked by SSRF, but NOT by a method filter
  });

  it('rejects malformed CustomHeaders', async () => {
    const res = await request(app)
      .get('/cors-proxy')
      .set('Target-URL', 'http://example.com')
      .set('CustomHeaders', '{bad');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('malformed JSON');
  });

  it('handles OPTIONS preflight', async () => {
    const res = await request(app)
      .options('/cors-proxy')
      .set('Origin', 'http://localhost')
      .set('Access-Control-Request-Method', 'GET');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('resolves env-var placeholder in Target-URL before validating', async () => {
    process.env.DASHY_TEST_BLOCKED_HOST = '169.254.169.254';
    try {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://DASHY_TEST_BLOCKED_HOST/');
      expect(res.status).toBe(403);
      expect(res.body.error).toContain('169.254.169.254');
    } finally {
      delete process.env.DASHY_TEST_BLOCKED_HOST;
    }
  });
});

describe('CORS proxy env-var substitution', () => {
  const SET_KEYS = [];
  const setEnv = (k, v) => { SET_KEYS.push(k); process.env[k] = v; };
  afterEach(() => { while (SET_KEYS.length) delete process.env[SET_KEYS.pop()]; });

  let warnSpy;
  beforeAll(() => { warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {}); });
  afterAll(() => { warnSpy.mockRestore(); });

  it('replaces a DASHY_ token with its env value', () => {
    setEnv('DASHY_FOO', 'secret');
    expect(substituteEnv('Bearer DASHY_FOO')).toBe('Bearer secret');
  });

  it('replaces VITE_APP_ and VUE_APP_ tokens (back-compat)', () => {
    setEnv('VITE_APP_KEY', 'abc');
    setEnv('VUE_APP_KEY', 'xyz');
    expect(substituteEnv('VITE_APP_KEY')).toBe('abc');
    expect(substituteEnv('VUE_APP_KEY')).toBe('xyz');
  });

  it('leaves unset placeholders verbatim', () => {
    expect(substituteEnv('Bearer DASHY_NOT_SET')).toBe('Bearer DASHY_NOT_SET');
  });

  it('does not substitute non-prefixed env vars', () => {
    setEnv('AWS_SECRET_KEY', 'should-not-leak');
    expect(substituteEnv('AWS_SECRET_KEY')).toBe('AWS_SECRET_KEY');
  });

  it('replaces multiple placeholders in one string', () => {
    setEnv('DASHY_HOST', 'pi.local');
    setEnv('DASHY_KEY', 'k1');
    expect(substituteEnv('http://DASHY_HOST/api?key=DASHY_KEY')).toBe('http://pi.local/api?key=k1');
  });

  it('walks into objects and arrays', () => {
    setEnv('DASHY_PASS', 'p4ss');
    setEnv('DASHY_USER', 'admin');
    const input = { auth: { user: 'DASHY_USER', pass: 'DASHY_PASS' }, tags: ['DASHY_PASS'] };
    expect(substituteEnv(input)).toEqual({
      auth: { user: 'admin', pass: 'p4ss' },
      tags: ['p4ss'],
    });
  });

  it('passes through non-string, non-object values unchanged', () => {
    expect(substituteEnv(undefined)).toBe(undefined);
    expect(substituteEnv(null)).toBe(null);
    expect(substituteEnv(42)).toBe(42);
    expect(substituteEnv(true)).toBe(true);
  });

  it('substitutes mixed-case suffix (matches process.env case-sensitively)', () => {
    setEnv('VITE_APP_pihole_ip', '10.0.0.1');
    expect(substituteEnv('http://VITE_APP_pihole_ip/api')).toBe('http://10.0.0.1/api');
  });

  it('warns once per unique unset placeholder, then stays quiet', () => {
    warnSpy.mockClear();
    // Use names unlikely to collide with any earlier warnings in this run
    substituteEnv('DASHY_WARN_TEST_ONE');
    substituteEnv('DASHY_WARN_TEST_ONE'); // repeat - should not re-log
    substituteEnv('DASHY_WARN_TEST_TWO');
    expect(warnSpy).toHaveBeenCalledTimes(2);
    expect(warnSpy.mock.calls[0][0]).toContain('DASHY_WARN_TEST_ONE');
    expect(warnSpy.mock.calls[1][0]).toContain('DASHY_WARN_TEST_TWO');
  });
});
