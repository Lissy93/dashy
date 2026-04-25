/**
 * Single shared AJV validator for Dashy's ConfigSchema.json.
 * Used by:
 *   - schemaLinter.js (CodeMirror diagnostics in the JSON editor)
 *   - ExportConfigMenu (status badges per config in the export dialog)
 * Note: SchemaForm.vue keeps its own AJV instance because JSONForms manages it.
 */
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from './ConfigSchema.json';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/* Raw compiled validator: call as a fn, then read .errors. Prefer validateConfig() unless you need positions. */
export const compiledValidator = ajv.compile(schema);

/* Convenience wrapper returning { valid, errors }. */
export function validateConfig(data) {
  const valid = compiledValidator(data);
  return { valid, errors: valid ? [] : (compiledValidator.errors || []) };
}

/* Turn a raw Ajv error into a user-readable message (no path). */
export function formatError(err) {
  const { keyword, params, message } = err;
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  switch (keyword) {
    case 'enum':                 return `must be one of: ${(params.allowedValues || []).join(', ')}`;
    case 'const':                return `must be: ${JSON.stringify(params.allowedValue)}`;
    case 'required':             return `missing required field: ${params.missingProperty}`;
    case 'additionalProperties': return `unknown property: ${params.additionalProperty}`;
    case 'propertyNames':        return `invalid property name: ${params.propertyName}`;
    case 'dependencies':
    case 'dependentRequired':    return `missing required field: ${params.missingProperty} (needed when ${params.property} is set)`;
    case 'type':                 return `must be ${Array.isArray(params.type) ? params.type.join(' or ') : params.type}`;
    case 'minLength':            return `must be at least ${plural(params.limit, 'character')}`;
    case 'maxLength':            return `must be at most ${plural(params.limit, 'character')}`;
    case 'minimum':
    case 'maximum':              return `must be ${keyword === 'minimum' ? '≥' : '≤'} ${params.limit}`;
    case 'exclusiveMinimum':
    case 'exclusiveMaximum':     return `must be ${keyword === 'exclusiveMinimum' ? '>' : '<'} ${params.limit}`;
    case 'multipleOf':           return `must be a multiple of ${params.multipleOf}`;
    case 'minItems':             return `must have at least ${plural(params.limit, 'item')}`;
    case 'maxItems':             return `must have at most ${plural(params.limit, 'item')}`;
    case 'uniqueItems':          return 'must not contain duplicate items';
    case 'minProperties':        return `must have at least ${plural(params.limit, 'property')}`;
    case 'maxProperties':        return `must have at most ${plural(params.limit, 'property')}`;
    case 'pattern':              return `must match pattern ${params.pattern}`;
    case 'format':               return `must be a valid ${params.format}`;
    case 'anyOf':
    case 'oneOf':                return 'must match one of the allowed shapes for this field';
    case 'not':                  return 'must not match the disallowed shape for this field';
    case 'if':                   return 'does not match the conditional schema for this field';
    default:                     return message;
  }
}

/* Combined "<path> <message>" with optional path prefix. */
export function formatIssue(err) {
  return `${err.instancePath ? `${err.instancePath} ` : ''}${formatError(err)}`;
}
