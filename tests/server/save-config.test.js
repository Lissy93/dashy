// @vitest-environment node
import { describe, it, expect, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Isolate writes to a temp dir so the real user-data/conf.yml is never touched
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dashy-save-config-'));
process.env.USER_DATA_DIR = tmpDir;
afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

const app = require('../../services/app');
const save = (body) => request(app).post('/config-manager/save').send(body);

describe('Save config', () => {
  it('rejects empty body', async () => {
    const res = await save({});
    expect(JSON.parse(res.text).success).toBe(false);
    expect(JSON.parse(res.text).message).toContain('config');
  });

  it('rejects non-string config', async () => {
    const res = await save({ config: 123 });
    expect(JSON.parse(res.text).success).toBe(false);
  });

  it('rejects oversized config', async () => {
    const res = await save({ config: 'x'.repeat(257 * 1024) });
    expect(JSON.parse(res.text).success).toBe(false);
    expect(JSON.parse(res.text).message).toContain('256');
  });

  it('rejects non-.yml filename', async () => {
    const res = await save({ config: 'x: 1', filename: 'evil.txt' });
    expect(JSON.parse(res.text).success).toBe(false);
    expect(JSON.parse(res.text).message).toContain('.yml');
  });

  it('rejects path traversal', async () => {
    const res = await save({ config: 'x: 1', filename: '../../etc/passwd' });
    expect(JSON.parse(res.text).success).toBe(false);
  });

  it('writes valid config to disk', async () => {
    const res = await save({ config: 'pageInfo:\n  title: Test\nsections: []\n' });
    const body = JSON.parse(res.text);
    expect(body.success).toBe(true);
    expect(body.message).toContain('conf.yml');
  });

  it('writes valid sub-page config', async () => {
    const res = await save({ config: 'pageInfo:\n  title: Sub\n', filename: 'test-sub.yml' });
    expect(JSON.parse(res.text).success).toBe(true);
  });

  it('defaults to conf.yml for non-string filename', async () => {
    const res = await save({ config: 'pageInfo:\n  title: Test\nsections: []\n', filename: 123 });
    const body = JSON.parse(res.text);
    expect(body.success).toBe(true);
    expect(body.message).toContain('conf.yml');
  });

  it('handles concurrent saves without crashing', async () => {
    const body = { config: 'pageInfo:\n  title: Concurrent\nsections: []\n' };
    const results = await Promise.all([save(body), save(body), save(body), save(body), save(body)]);
    results.forEach((res) => {
      expect(() => JSON.parse(res.text)).not.toThrow();
    });
  });

  it('ignores GET requests', async () => {
    const res = await request(app).get('/config-manager/save');
    expect(res.status).toBeLessThan(500);
  });
});
