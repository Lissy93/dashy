// @vitest-environment node
import { describe, it, expect } from 'vitest';
import request from 'supertest';

const app = require('../../services/app');

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
});
