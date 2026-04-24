/**
 * This is a custom linter plugin for CodeMirror (6),
 * used when user editing config as code via the config modal
 * Does:
 * 1. YAML syntax checker, vie js-yaml
 * 2. Ajv schema validator using our ConfigSchema.json
 */
import jsYaml from 'js-yaml';
import { parseDocument } from 'yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import schema from './ConfigSchema.json';
import { pointerToPath, yamlNodeAt, pairRange } from './schemaPath';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// Turn Ajv's raw errors into user readable strings
const formatError = (err) => {
  const { keyword, params, message } = err;
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  switch (keyword) {
    case 'enum':
      return `must be one of: ${(params.allowedValues || []).join(', ')}`;
    case 'const':
      return `must be: ${JSON.stringify(params.allowedValue)}`;
    case 'required':
      return `missing required field: ${params.missingProperty}`;
    case 'additionalProperties':
      return `unknown property: ${params.additionalProperty}`;
    case 'propertyNames':
      return `invalid property name: ${params.propertyName}`;
    case 'dependencies':
    case 'dependentRequired':
      return `missing required field: ${params.missingProperty} (needed when ${params.property} is set)`;
    case 'type':
      return `must be ${Array.isArray(params.type) ? params.type.join(' or ') : params.type}`;
    case 'minLength':
      return `must be at least ${plural(params.limit, 'character')}`;
    case 'maxLength':
      return `must be at most ${plural(params.limit, 'character')}`;
    case 'minimum':
    case 'maximum':
      return `must be ${keyword === 'minimum' ? '≥' : '≤'} ${params.limit}`;
    case 'exclusiveMinimum':
    case 'exclusiveMaximum':
      return `must be ${keyword === 'exclusiveMinimum' ? '>' : '<'} ${params.limit}`;
    case 'multipleOf':
      return `must be a multiple of ${params.multipleOf}`;
    case 'minItems':
      return `must have at least ${plural(params.limit, 'item')}`;
    case 'maxItems':
      return `must have at most ${plural(params.limit, 'item')}`;
    case 'uniqueItems':
      return 'must not contain duplicate items';
    case 'minProperties':
      return `must have at least ${plural(params.limit, 'property')}`;
    case 'maxProperties':
      return `must have at most ${plural(params.limit, 'property')}`;
    case 'pattern':
      return `must match pattern ${params.pattern}`;
    case 'format':
      return `must be a valid ${params.format}`;
    case 'anyOf':
    case 'oneOf':
      return 'must match one of the allowed shapes for this field';
    case 'not':
      return 'must not match the disallowed shape for this field';
    case 'if':
      return 'does not match the conditional schema for this field';
    default:
      return message;
  }
};

const prefix = (instancePath) => (instancePath ? `${instancePath} ` : '');

export function schemaLinter(view) {
  const text = view.state.doc.toString();
  if (!text.trim()) return [];
  const docLen = view.state.doc.length;

  let data;
  try {
    data = jsYaml.load(text);
  } catch (e) {
    const line = e.mark?.line ?? 0;
    const col = e.mark?.column ?? 0;
    const lineObj = view.state.doc.line(clamp(line + 1, 1, view.state.doc.lines));
    const from = clamp(lineObj.from + col, lineObj.from, lineObj.to);
    return [{
      from,
      to: clamp(from + 1, from, docLen),
      severity: 'error',
      source: 'yaml',
      message: e.reason || e.message,
    }];
  }

  if (validate(data)) return [];

  const doc = parseDocument(text);
  const diag = (err, start, end) => {
    const from = clamp(start, 0, docLen);
    const to = clamp(end || start + 1, from + 1, docLen);
    return {
      from,
      to,
      severity: 'warning',
      source: 'schema',
      message: `${prefix(err.instancePath)}${formatError(err)}`,
    };
  };

  return (validate.errors || []).map((err) => {
    const path = pointerToPath(err.instancePath);
    const node = yamlNodeAt(doc.contents, path);

    // Unknown property: Ajv reports the PARENT's path + the bad key name.
    // Narrow the highlight to just the offending key's pair, not the parent.
    if (err.keyword === 'additionalProperties' && err.params.additionalProperty) {
      const range = pairRange(node, err.params.additionalProperty);
      if (range) return diag(err, range[0], range[1]);
    }

    // Missing required: no child exists to point at, so shrink to one char
    // at the parent's opening — the gutter icon lands on its first line only.
    if (err.keyword === 'required') {
      const start = node?.range?.[0] ?? 0;
      return diag(err, start, start + 1);
    }

    const [start, end] = node?.range ?? [0, 0];
    return diag(err, start, end);
  });
}
