/**
 * Shared YAML + JSON-Schema walkers for the linter and the config tooltip extension
 */
import { isMap, isSeq } from 'yaml';

const decodeToken = (s) => s.replace(/~1/g, '/').replace(/~0/g, '~');

// JSON Pointer (Ajv's instancePath, e.g. "/sections/0/items/2") -> path parts.
export const pointerToPath = (pointer) => (pointer
  ? pointer.split('/').slice(1).map(decodeToken)
  : []);

// Walk a parsed YAML Document by path parts, returning the target Node or null.
export const yamlNodeAt = (root, parts) => {
  let node = root;
  for (const key of parts) {
    if (!node) return null;
    if (isMap(node)) {
      const pair = node.items.find((p) => {
        const k = p.key && 'value' in p.key ? p.key.value : p.key;
        return String(k) === String(key);
      });
      node = pair ? pair.value : null;
    } else if (isSeq(node)) {
      node = node.items[Number(key)] ?? null;
    } else {
      return null;
    }
  }
  return node;
};

// yaml Nodes expose range as [start, valueEnd, nodeEnd]; fall back if shorter.
const nodeEnd = (r) => (r ? (r[2] ?? r[1] ?? r[0]) : -1);
const inside = (r, offset) => !!r && offset >= r[0] && offset <= nodeEnd(r);

// Given a parsed YAML Document and a cursor offset, return the path from
// document root to the smallest containing node (e.g. ['sections', 0, 'url']).
// Returns [] when the cursor isn't inside any addressable node.
export const yamlPathAtOffset = (doc, offset) => {
  const path = [];
  let node = doc?.contents ?? null;

  while (node) {
    if (isMap(node)) {
      const pair = node.items.find((p) => inside(p.key?.range, offset) || inside(p.value?.range, offset));
      if (!pair) break;
      const keyName = pair.key && 'value' in pair.key ? pair.key.value : pair.key;
      path.push(String(keyName));
      // Cursor on the key but not the value — stop here rather than descending.
      if (inside(pair.key?.range, offset) && !inside(pair.value?.range, offset)) break;
      node = pair.value;
    } else if (isSeq(node)) {
      const idx = node.items.findIndex((it) => inside(it?.range, offset));
      if (idx < 0) break;
      path.push(idx);
      node = node.items[idx];
    } else {
      break;
    }
  }
  return path;
};

// Walk a JSON Schema by path parts, resolving `properties`, `items`,
// `patternProperties` and simple `oneOf`/`anyOf`. Returns the sub-schema at
// the path, or null if the schema doesn't describe that location.
export const schemaAt = (schema, parts) => {
  const pickBranch = (s) => {
    if (!s) return s;
    if (Array.isArray(s.oneOf) && s.oneOf.length) return s.oneOf[0];
    if (Array.isArray(s.anyOf) && s.anyOf.length) return s.anyOf[0];
    return s;
  };

  let cur = pickBranch(schema);
  for (const key of parts) {
    if (!cur) return null;
    if (cur.items) {
      cur = pickBranch(cur.items);
    } else if (cur.properties && Object.prototype.hasOwnProperty.call(cur.properties, key)) {
      cur = pickBranch(cur.properties[key]);
    } else if (cur.patternProperties) {
      const entry = Object.entries(cur.patternProperties)
        .find(([pat]) => new RegExp(pat).test(String(key)));
      cur = entry ? pickBranch(entry[1]) : null;
    } else if (cur.additionalProperties && typeof cur.additionalProperties === 'object') {
      cur = pickBranch(cur.additionalProperties);
    } else {
      return null;
    }
  }
  return cur;
};
