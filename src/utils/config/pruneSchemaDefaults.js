/* Strip leaves that match the schema's `default` (or are empty) so saved YAML
 * stays minimal. AJV's `useDefaults: true` in SchemaForm fills untouched
 * fields with their schema defaults; without pruning they'd persist verbatim.
 * Empty objects/arrays/strings are also dropped. */

const DROP = Symbol('prune.drop');

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function deepEqualJson(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (typeof a !== 'object') return false;
  try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
}

function pruneNode(value, schema) {
  if (schema && Object.prototype.hasOwnProperty.call(schema, 'default')
      && deepEqualJson(value, schema.default)) {
    return DROP;
  }
  if (Array.isArray(value)) {
    const itemSchema = schema && schema.items;
    const out = [];
    for (const item of value) {
      const pruned = pruneNode(item, itemSchema);
      if (pruned !== DROP) out.push(pruned);
    }
    return out.length === 0 ? DROP : out;
  }
  if (isPlainObject(value)) {
    const props = schema && schema.properties;
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const childSchema = props && props[k];
      const pruned = pruneNode(v, childSchema);
      if (pruned !== DROP) out[k] = pruned;
    }
    return Object.keys(out).length === 0 ? DROP : out;
  }
  if (value === undefined || value === null || value === '') return DROP;
  return value;
}

export default function pruneSchemaDefaults(data, schema) {
  const result = pruneNode(data, schema);
  if (result === DROP) return Array.isArray(data) ? [] : {};
  return result;
}
