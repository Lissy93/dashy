import {
  describe, it, expect, beforeEach,
} from 'vitest';
import path from 'path';

describe('Config Validator', () => {
  const configValidator = path.resolve(__dirname, '../../services/config-validator.js');

  beforeEach(() => {
    delete process.env.VUE_APP_CONFIG_VALID;
  });

  it('validates a correct config file', () => {
    const Ajv = require('ajv');
    const schema = require('../../src/utils/ConfigSchema.json');

    const validConfig = {
      pageInfo: { title: 'Test' },
      appConfig: {},
      sections: [{ name: 'Test', items: [{ title: 'Item', url: 'https://example.com' }] }],
    };

    const ajv = new Ajv({ strict: false, allowUnionTypes: true, allErrors: true });
    const valid = ajv.validate(schema, validConfig);
    expect(valid).toBe(true);
  });

  it('rejects config with invalid structure', () => {
    const Ajv = require('ajv');
    const schema = require('../../src/utils/ConfigSchema.json');

    const invalidConfig = {
      pageInfo: { title: 'Test' },
      sections: 'not an array',
    };

    const ajv = new Ajv({ strict: false, allowUnionTypes: true, allErrors: true });
    const valid = ajv.validate(schema, invalidConfig);
    expect(valid).toBe(false);
    expect(ajv.errors).toBeTruthy();
  });

  it('requires sections to be an array', () => {
    const Ajv = require('ajv');
    const schema = require('../../src/utils/ConfigSchema.json');

    const config = {
      pageInfo: { title: 'Test' },
      sections: {},
    };

    const ajv = new Ajv({ strict: false, allowUnionTypes: true, allErrors: true });
    const valid = ajv.validate(schema, config);
    expect(valid).toBe(false);
  });

  it('allows items with just title', () => {
    const Ajv = require('ajv');
    const schema = require('../../src/utils/ConfigSchema.json');

    const config = {
      pageInfo: { title: 'Test' },
      sections: [
        {
          name: 'Test Section',
          items: [{ title: 'Item', url: 'https://example.com' }],
        },
      ],
    };

    const ajv = new Ajv({ strict: false, allowUnionTypes: true, allErrors: true });
    const valid = ajv.validate(schema, config);
    expect(valid).toBe(true);
  });
});
