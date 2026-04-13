// @vitest-environment node
import { describe, it, expect } from 'vitest';
import request from 'supertest';

const app = require('../../services/app');

describe('Status check', () => {
  it('returns error for missing URL param', async () => {
    const res = await request(app).get('/status-check/');
    const body = JSON.parse(res.text);
    expect(body.successStatus).toBe(false);
  });

  it('returns error for empty URL param', async () => {
    const res = await request(app).get('/status-check/?&url=');
    const body = JSON.parse(res.text);
    expect(body.successStatus).toBe(false);
  });

  it('ignores POST requests', async () => {
    const res = await request(app).post('/status-check/?&url=x');
    expect(res.status).toBeLessThan(500);
  });
});
