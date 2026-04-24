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
import { pointerToPath, yamlNodeAt } from './schemaPath';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

// Turn Ajv's raw errors into user readable strings
const formatError = (err) => {
  const { keyword, params, message } = err;
  switch (keyword) {
    case 'enum':
      return `must be one of: ${(params.allowedValues || []).join(', ')}`;
    case 'const':
      return `must be: ${JSON.stringify(params.allowedValue)}`;
    case 'required':
      return `missing required field: ${params.missingProperty}`;
    case 'additionalProperties':
      return `unknown property: ${params.additionalProperty}`;
    case 'type':
      return `must be ${params.type}`;
    case 'minLength':
      return `must be at least ${params.limit} characters`;
    case 'maxLength':
      return `must be at most ${params.limit} characters`;
    case 'minimum':
    case 'maximum':
      return `must be ${keyword === 'minimum' ? '≥' : '≤'} ${params.limit}`;
    case 'pattern':
      return `must match pattern ${params.pattern}`;
    case 'format':
      return `must be a valid ${params.format}`;
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
  return (validate.errors || []).map((err) => {
    const path = pointerToPath(err.instancePath);
    const node = yamlNodeAt(doc.contents, path);
    const [start, end] = node?.range ?? [0, 0];
    const from = clamp(start, 0, docLen);
    const to = clamp(end || start + 1, from + 1, docLen);
    return {
      from,
      to,
      severity: 'warning',
      source: 'schema',
      message: `${prefix(err.instancePath)}${formatError(err)}`,
    };
  });
}
