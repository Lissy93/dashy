import jsYaml from 'js-yaml';

export const ValidationErrorTypes = {
  YAML_PARSE_ERROR: 'yaml_parse_error',
  SECTIONS_EMPTY: 'sections_empty',
  SECTIONS_NOT_ARRAY: 'sections_not_array',
  ITEMS_NOT_ARRAY: 'items_not_array',
  ITEM_MISSING_TITLE: 'item_missing_title',
  ITEM_MISSING_URL: 'item_missing_url',
};

export class ConfigValidator {
  constructor() {
    this.errors = [];
  }

  validateYaml(yamlString) {
    this.errors = [];
    
    try {
      const config = jsYaml.load(yamlString);
      return { valid: true, config };
    } catch (e) {
      const error = {
        type: ValidationErrorTypes.YAML_PARSE_ERROR,
        message: e.reason || 'YAML parsing error',
        line: e.mark?.line !== undefined ? e.mark.line + 1 : null,
        column: e.mark?.column !== undefined ? e.mark.column + 1 : null,
        snippet: e.mark?.snippet || null,
      };
      this.errors.push(error);
      return { valid: false, errors: this.errors };
    }
  }

  validateConfig(config) {
    this.errors = [];

    if (!config) {
      this.errors.push({
        type: ValidationErrorTypes.SECTIONS_EMPTY,
        message: 'Config is empty',
        path: '',
      });
      return { valid: false, errors: this.errors };
    }

    if (config.sections === undefined) {
      this.errors.push({
        type: ValidationErrorTypes.SECTIONS_EMPTY,
        message: 'sections is required',
        path: 'sections',
      });
    } else if (!Array.isArray(config.sections)) {
      this.errors.push({
        type: ValidationErrorTypes.SECTIONS_NOT_ARRAY,
        message: 'sections must be an array',
        path: 'sections',
      });
    } else if (config.sections.length === 0) {
      this.errors.push({
        type: ValidationErrorTypes.SECTIONS_EMPTY,
        message: 'sections cannot be empty',
        path: 'sections',
      });
    } else {
      config.sections.forEach((section, sectionIndex) => {
        if (section.items !== undefined && !Array.isArray(section.items)) {
          this.errors.push({
            type: ValidationErrorTypes.ITEMS_NOT_ARRAY,
            message: `items in section[${sectionIndex}] must be an array`,
            path: `sections[${sectionIndex}].items`,
            sectionIndex,
          });
        } else if (Array.isArray(section.items)) {
          section.items.forEach((item, itemIndex) => {
            if (!item || typeof item !== 'object') {
              return;
            }
            
            if (!item.title) {
              this.errors.push({
                type: ValidationErrorTypes.ITEM_MISSING_TITLE,
                message: `item[${itemIndex}] in section[${sectionIndex}] is missing required field: title`,
                path: `sections[${sectionIndex}].items[${itemIndex}].title`,
                sectionIndex,
                itemIndex,
                field: 'title',
              });
            }
            
            if (!item.url) {
              this.errors.push({
                type: ValidationErrorTypes.ITEM_MISSING_URL,
                message: `item[${itemIndex}] in section[${sectionIndex}] is missing required field: url`,
                path: `sections[${sectionIndex}].items[${itemIndex}].url`,
                sectionIndex,
                itemIndex,
                field: 'url',
              });
            }
          });
        }
      });
    }

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
    };
  }

  validate(yamlString) {
    const yamlResult = this.validateYaml(yamlString);
    if (!yamlResult.valid) {
      return yamlResult;
    }
    
    return this.validateConfig(yamlResult.config);
  }
}

export default ConfigValidator;
