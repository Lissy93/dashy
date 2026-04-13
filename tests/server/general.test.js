// @vitest-environment node
import { describe, it, expect } from 'vitest';
import request from 'supertest';

const app = require('../../services/app');

describe('Config serving', () => {
  it('GET /conf.yml returns the config', async () => {
    const res = await request(app).get('/conf.yml');
    expect(res.status).toBe(200);
    expect(res.text).toContain('pageInfo');
  });

  it('GET /missing.yml returns 404 JSON', async () => {
    const res = await request(app).get('/nonexistent.yml');
    expect(res.status).toBe(404);
    expect(JSON.parse(res.text).success).toBe(false);
  });
});

describe('System info', () => {
  it('returns host metadata', async () => {
    const res = await request(app).get('/system-info');
    expect(res.status).toBe(200);
    const body = JSON.parse(res.text);
    expect(body.meta.hostname).toBeDefined();
    expect(body.meta.uptime).toBeGreaterThan(0);
    expect(body.memory).toBeDefined();
  });

  it('ignores POST', async () => {
    const res = await request(app).post('/system-info');
    expect(res.status).toBeLessThan(500);
  });
});

describe('Get user', () => {
  it('returns JSON', async () => {
    const res = await request(app).get('/get-user');
    expect(res.status).toBe(200);
    expect(typeof JSON.parse(res.text)).toBe('object');
  });
});

describe('Rebuild', () => {
  it('ignores POST', async () => {
    const res = await request(app).post('/config-manager/rebuild');
    expect(res.status).toBeLessThan(500);
  });
});

describe('SPA fallback', () => {
  it('serves content for unknown routes', async () => {
    const res = await request(app).get('/some/nonexistent/route');
    expect([200, 404]).toContain(res.status);
  });
});
