// @vitest-environment node
import { describe, it, expect } from 'vitest';
import request from 'supertest';

const app = require('../../services/app');
const save = (body) => request(app).post('/config-manager/save').send(body);

const validConfigYaml = `pageInfo:
  title: Test
sections:
  - name: Section 1
    items:
      - title: Item 1
        url: https://example.com`;

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
    const res = await save({ config: validConfigYaml, filename: 'evil.txt' });
    expect(JSON.parse(res.text).success).toBe(false);
    expect(JSON.parse(res.text).message).toContain('.yml');
  });

  it('rejects path traversal', async () => {
    const res = await save({ config: validConfigYaml, filename: '../../etc/passwd' });
    expect(JSON.parse(res.text).success).toBe(false);
  });

  it('writes valid config to disk', async () => {
    const res = await save({ config: validConfigYaml });
    const body = JSON.parse(res.text);
    expect(body.success).toBe(true);
    expect(body.message).toContain('conf.yml');
  });

  it('writes valid sub-page config', async () => {
    const res = await save({ config: validConfigYaml, filename: 'test-sub.yml' });
    expect(JSON.parse(res.text).success).toBe(true);
  });

  it('defaults to conf.yml for non-string filename', async () => {
    const res = await save({ config: validConfigYaml, filename: 123 });
    const body = JSON.parse(res.text);
    expect(body.success).toBe(true);
    expect(body.message).toContain('conf.yml');
  });

  it('handles concurrent saves without crashing', async () => {
    const body = { config: validConfigYaml };
    const results = await Promise.all([save(body), save(body), save(body), save(body), save(body)]);
    results.forEach((res) => {
      expect(() => JSON.parse(res.text)).not.toThrow();
    });
  });

  it('ignores GET requests', async () => {
    const res = await request(app).get('/config-manager/save');
    expect(res.status).toBeLessThan(500);
  });

  describe('Config Validation', () => {
    it('rejects invalid YAML syntax', async () => {
      const invalidYaml = `pageInfo:
  title: Test
sections:
  - name: Test
    items
      - title: Item`;
      
      const res = await save({ config: invalidYaml });
      const body = JSON.parse(res.text);
      expect(body.success).toBe(false);
      expect(body.message).toContain('YAML');
      expect(body.errors).toBeDefined();
      expect(Array.isArray(body.errors)).toBe(true);
    });

    it('rejects config with empty sections', async () => {
      const config = `pageInfo:
  title: Test
sections: []`;
      
      const res = await save({ config });
      const body = JSON.parse(res.text);
      expect(body.success).toBe(false);
      expect(body.message).toContain('sections');
      expect(body.errors).toBeDefined();
    });

    it('rejects config with sections not an array', async () => {
      const config = `pageInfo:
  title: Test
sections: not an array`;
      
      const res = await save({ config });
      const body = JSON.parse(res.text);
      expect(body.success).toBe(false);
      expect(body.errors).toBeDefined();
    });

    it('rejects config with item missing title', async () => {
      const config = `pageInfo:
  title: Test
sections:
  - name: Section 1
    items:
      - url: https://example.com`;
      
      const res = await save({ config });
      const body = JSON.parse(res.text);
      expect(body.success).toBe(false);
      expect(body.errors).toBeDefined();
      expect(body.errors.length).toBeGreaterThan(0);
    });

    it('rejects config with item missing url', async () => {
      const config = `pageInfo:
  title: Test
sections:
  - name: Section 1
    items:
      - title: Item 1`;
      
      const res = await save({ config });
      const body = JSON.parse(res.text);
      expect(body.success).toBe(false);
      expect(body.errors).toBeDefined();
      expect(body.errors.length).toBeGreaterThan(0);
    });

    it('rejects config with multiple validation errors', async () => {
      const config = `pageInfo:
  title: Test
sections:
  - name: Section 1
    items:
      - url: https://example.com
      - title: Item 2`;
      
      const res = await save({ config });
      const body = JSON.parse(res.text);
      expect(body.success).toBe(false);
      expect(body.errors).toBeDefined();
      expect(body.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('accepts valid config with proper structure', async () => {
      const validConfig = `pageInfo:
  title: Test
sections:
  - name: Section 1
    items:
      - title: Item 1
        url: https://example.com
      - title: Item 2
        url: https://test.com`;
      
      const res = await save({ config: validConfig });
      const body = JSON.parse(res.text);
      expect(body.success).toBe(true);
    });
  });
});
