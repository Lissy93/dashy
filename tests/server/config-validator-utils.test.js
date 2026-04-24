// @vitest-environment node
import { describe, it, expect } from 'vitest';

const { 
  ConfigValidator, 
  ValidationErrorTypes, 
  formatValidationErrors 
} = require('../../services/config-validator-utils');

describe('ConfigValidator', () => {
  describe('validateYaml', () => {
    it('should validate valid YAML', () => {
      const validator = new ConfigValidator();
      const yaml = 'pageInfo:\n  title: Test\nsections: []\n';
      const result = validator.validateYaml(yaml);
      expect(result.valid).toBe(true);
      expect(result.config).toBeDefined();
      expect(result.config.pageInfo.title).toBe('Test');
    });

    it('should detect YAML syntax error with line number', () => {
      const validator = new ConfigValidator();
      const invalidYaml = `pageInfo:
  title: Test
sections:
  - name: Test
    items
      - title: Item`;
      
      const result = validator.validateYaml(invalidYaml);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe(ValidationErrorTypes.YAML_PARSE_ERROR);
      expect(result.errors[0].line).toBeDefined();
      expect(result.errors[0].message).toBeDefined();
    });

    it('should detect YAML syntax error at specific line', () => {
      const validator = new ConfigValidator();
      const invalidYaml = `pageInfo:
  title: Test
invalid: [missing closing bracket
sections: []`;
      
      const result = validator.validateYaml(invalidYaml);
      expect(result.valid).toBe(false);
      expect(result.errors[0].line).toBeDefined();
      expect(result.errors[0].line).toBeGreaterThanOrEqual(3);
    });
  });

  describe('validateConfig', () => {
    it('should validate empty config', () => {
      const validator = new ConfigValidator();
      const result = validator.validateConfig(null);
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe(ValidationErrorTypes.SECTIONS_EMPTY);
    });

    it('should detect missing sections', () => {
      const validator = new ConfigValidator();
      const config = { pageInfo: { title: 'Test' } };
      const result = validator.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe(ValidationErrorTypes.SECTIONS_EMPTY);
    });

    it('should detect sections is not an array', () => {
      const validator = new ConfigValidator();
      const config = { pageInfo: { title: 'Test' }, sections: 'not an array' };
      const result = validator.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe(ValidationErrorTypes.SECTIONS_NOT_ARRAY);
    });

    it('should detect empty sections array', () => {
      const validator = new ConfigValidator();
      const config = { pageInfo: { title: 'Test' }, sections: [] };
      const result = validator.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe(ValidationErrorTypes.SECTIONS_EMPTY);
    });

    it('should detect items is not an array', () => {
      const validator = new ConfigValidator();
      const config = {
        pageInfo: { title: 'Test' },
        sections: [
          { name: 'Section 1', items: 'not an array' }
        ]
      };
      const result = validator.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe(ValidationErrorTypes.ITEMS_NOT_ARRAY);
      expect(result.errors[0].sectionIndex).toBe(0);
    });

    it('should detect item missing title', () => {
      const validator = new ConfigValidator();
      const config = {
        pageInfo: { title: 'Test' },
        sections: [
          {
            name: 'Section 1',
            items: [
              { url: 'https://example.com' }
            ]
          }
        ]
      };
      const result = validator.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe(ValidationErrorTypes.ITEM_MISSING_TITLE);
      expect(result.errors[0].sectionIndex).toBe(0);
      expect(result.errors[0].itemIndex).toBe(0);
    });

    it('should detect item missing url', () => {
      const validator = new ConfigValidator();
      const config = {
        pageInfo: { title: 'Test' },
        sections: [
          {
            name: 'Section 1',
            items: [
              { title: 'Item 1' }
            ]
          }
        ]
      };
      const result = validator.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe(ValidationErrorTypes.ITEM_MISSING_URL);
    });

    it('should detect multiple validation errors', () => {
      const validator = new ConfigValidator();
      const config = {
        pageInfo: { title: 'Test' },
        sections: [
          {
            name: 'Section 1',
            items: [
              { title: 'Item 1' },
              { url: 'https://example.com' }
            ]
          }
        ]
      };
      const result = validator.validateConfig(config);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
      
      const errorTypes = result.errors.map(e => e.type);
      expect(errorTypes).toContain(ValidationErrorTypes.ITEM_MISSING_URL);
      expect(errorTypes).toContain(ValidationErrorTypes.ITEM_MISSING_TITLE);
    });

    it('should validate a correct config', () => {
      const validator = new ConfigValidator();
      const config = {
        pageInfo: { title: 'Test' },
        sections: [
          {
            name: 'Section 1',
            items: [
              { title: 'Item 1', url: 'https://example.com' },
              { title: 'Item 2', url: 'https://test.com' }
            ]
          }
        ]
      };
      const result = validator.validateConfig(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validate (combined)', () => {
    it('should validate YAML and config structure', () => {
      const validator = new ConfigValidator();
      const validYaml = `pageInfo:
  title: Test
sections:
  - name: Section 1
    items:
      - title: Item 1
        url: https://example.com`;
      
      const result = validator.validate(validYaml);
      expect(result.valid).toBe(true);
    });

    it('should return YAML parse error before config validation', () => {
      const validator = new ConfigValidator();
      const invalidYaml = `pageInfo:
  title: Test
sections:
  - name: Section 1
    items
      - title: Item 1`;
      
      const result = validator.validate(invalidYaml);
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe(ValidationErrorTypes.YAML_PARSE_ERROR);
    });
  });

  describe('formatValidationErrors', () => {
    it('should format YAML parse error with line and column', () => {
      const errors = [
        {
          type: ValidationErrorTypes.YAML_PARSE_ERROR,
          message: 'mapping values are not allowed here',
          line: 5,
          column: 10,
          snippet: '    items\n      - title: Item'
        }
      ];
      
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('line 5');
      expect(formatted).toContain('column 10');
      expect(formatted).toContain('mapping values are not allowed here');
    });

    it('should format YAML parse error with only line', () => {
      const errors = [
        {
          type: ValidationErrorTypes.YAML_PARSE_ERROR,
          message: 'syntax error',
          line: 3,
          column: null,
          snippet: null
        }
      ];
      
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('line 3');
      expect(formatted).not.toContain('column');
    });

    it('should format sections empty error', () => {
      const errors = [
        {
          type: ValidationErrorTypes.SECTIONS_EMPTY,
          message: 'sections cannot be empty',
          path: 'sections'
        }
      ];
      
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('sections cannot be empty');
    });

    it('should format item missing title error', () => {
      const errors = [
        {
          type: ValidationErrorTypes.ITEM_MISSING_TITLE,
          message: 'item[0] in section[0] is missing required field: title',
          path: 'sections[0].items[0].title',
          sectionIndex: 0,
          itemIndex: 0,
          field: 'title'
        }
      ];
      
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('title');
      expect(formatted).toContain('sections[0].items[0].title');
    });

    it('should format multiple errors', () => {
      const errors = [
        {
          type: ValidationErrorTypes.ITEM_MISSING_TITLE,
          message: 'missing title',
          sectionIndex: 0,
          itemIndex: 0
        },
        {
          type: ValidationErrorTypes.ITEM_MISSING_URL,
          message: 'missing url',
          sectionIndex: 0,
          itemIndex: 1
        }
      ];
      
      const formatted = formatValidationErrors(errors);
      const lines = formatted.split('\n');
      expect(lines.length).toBeGreaterThanOrEqual(2);
    });
  });
});
