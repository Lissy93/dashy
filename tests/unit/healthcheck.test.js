import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Healthcheck Service', () => {
  it('healthcheck script exists', () => {
    const healthcheckPath = path.resolve(__dirname, '../../services/healthcheck.js');
    expect(fs.existsSync(healthcheckPath)).toBe(true);
  });

  it('healthcheck file has correct structure', () => {
    const healthcheckPath = path.resolve(__dirname, '../../services/healthcheck.js');
    const content = fs.readFileSync(healthcheckPath, 'utf8');
    expect(content).toContain('healthCheck');
    expect(content).toContain('http.request');
  });
});
