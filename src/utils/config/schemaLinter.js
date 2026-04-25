/**
 * This is a custom linter plugin for CodeMirror (6),
 * used when user editing config as code via the config modal
 * Does:
 * 1. YAML syntax checker, vie js-yaml
 * 2. Ajv schema validator using our ConfigSchema.json
 */
import jsYaml from 'js-yaml';
import { parseDocument } from 'yaml';

import { compiledValidator as validate, formatIssue } from './validateConfig';
import { pointerToPath, yamlNodeAt, pairRange } from './schemaPath';

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

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
      message: formatIssue(err),
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
