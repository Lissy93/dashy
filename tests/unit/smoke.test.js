/**
 * Smoke Tests
 * Basic tests to verify that the testing infrastructure is working correctly
 * and that core functionality is operational
 */

import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

describe('Smoke Tests - Testing Infrastructure', () => {
  it('should run a basic test', () => {
    expect(true).toBe(true);
  });

  it('should perform basic math', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle strings correctly', () => {
    expect('dashy').toMatch(/dash/);
  });
});

describe('Smoke Tests - Project Files', () => {
  it('should have a package.json file', () => {
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    expect(fs.existsSync(packageJsonPath)).toBe(true);
  });

  it('should have a valid package.json', () => {
    const packageJsonPath = path.resolve(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    expect(packageJson.name).toBe('dashy');
    expect(packageJson.version).toBeDefined();
    expect(packageJson.license).toBe('MIT');
  });

  it('should have a server.js file', () => {
    const serverPath = path.resolve(__dirname, '../../server.js');
    expect(fs.existsSync(serverPath)).toBe(true);
  });

  it('should have src directory', () => {
    const srcPath = path.resolve(__dirname, '../../src');
    expect(fs.existsSync(srcPath)).toBe(true);
  });
});

describe('Smoke Tests - Config Loading', () => {
  it('should parse a valid YAML config file', () => {
    const configPath = path.resolve(__dirname, '../fixtures/valid-config.yml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configContent);

    expect(config).toBeDefined();
    expect(config.pageInfo).toBeDefined();
    expect(config.pageInfo.title).toBe('Test Dashboard');
  });

  it('should have required config structure', () => {
    const configPath = path.resolve(__dirname, '../fixtures/valid-config.yml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configContent);

    // Check required top-level properties
    expect(config).toHaveProperty('pageInfo');
    expect(config).toHaveProperty('appConfig');
    expect(config).toHaveProperty('sections');

    // Check sections structure
    expect(Array.isArray(config.sections)).toBe(true);
    expect(config.sections.length).toBeGreaterThan(0);

    // Check first section has items
    const firstSection = config.sections[0];
    expect(firstSection).toHaveProperty('name');
    expect(firstSection).toHaveProperty('items');
    expect(Array.isArray(firstSection.items)).toBe(true);
  });

  it('should validate item structure in config', () => {
    const configPath = path.resolve(__dirname, '../fixtures/valid-config.yml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(configContent);

    const firstItem = config.sections[0].items[0];

    // Each item should have required properties
    expect(firstItem).toHaveProperty('title');
    expect(firstItem).toHaveProperty('url');

    // URL should be valid
    expect(firstItem.url).toMatch(/^https?:\/\//);
  });
});

describe('Smoke Tests - Core Dependencies', () => {
  it('should load yaml parser', () => {
    expect(yaml).toBeDefined();
    expect(typeof yaml.load).toBe('function');
  });

  it('should load fs module', () => {
    expect(fs).toBeDefined();
    expect(typeof fs.readFileSync).toBe('function');
  });

  it('should have config schema file', () => {
    const schemaPath = path.resolve(__dirname, '../../src/utils/config/ConfigSchema.json');
    expect(fs.existsSync(schemaPath)).toBe(true);
  });
});
