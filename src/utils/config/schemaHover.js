/**
 * An extension for CodeMirror 6,
 * Shows schema info as tooltips on attribute names
 * Like title, description, type, allowed enum values, etc.
 */
import { hoverTooltip } from '@codemirror/view';
import { parseDocument } from 'yaml';

import schema from './ConfigSchema.json';
import { yamlPathAtOffset, schemaAt } from './schemaPath';

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[c]));

const describeType = (s) => {
  if (Array.isArray(s.type)) return s.type.join(' | ');
  if (s.type) return s.type;
  if (s.properties) return 'object';
  if (s.items) return 'array';
  return null;
};

// Returns HTML for a tooltip bod, or null if the schema has nothing worth saying
const renderBody = (s) => {
  if (!s) return null;
  const rows = [];

  if (s.title) {
    rows.push(`<div class="title">${escapeHtml(s.title)}</div>`);
  }
  if (s.description) {
    rows.push(`<div class="desc">${escapeHtml(s.description)}</div>`);
  }

  const type = describeType(s);
  if (type) {
    rows.push(`<div class="meta"><span class="label">Type</span> <code>${escapeHtml(type)}</code></div>`);
  }
  if (Array.isArray(s.enum)) {
    const opts = s.enum.map((v) => `<code>${escapeHtml(v)}</code>`).join(', ');
    rows.push(`<div class="meta"><span class="label">Allowed</span> ${opts}</div>`);
  }
  if (s.default !== undefined) {
    rows.push(`<div class="meta"><span class="label">Default</span> <code>${escapeHtml(JSON.stringify(s.default))}</code></div>`);
  }

  return rows.length ? rows.join('') : null;
};

export const schemaHover = hoverTooltip((view, pos) => {
  const text = view.state.doc.toString();
  if (!text.trim()) return null;

  let doc;
  try {
    doc = parseDocument(text);
  } catch {
    return null;
  }

  const path = yamlPathAtOffset(doc, pos);
  if (!path.length) return null;

  const body = renderBody(schemaAt(schema, path));
  if (!body) return null;

  return {
    pos,
    above: true,
    create() {
      const dom = document.createElement('div');
      dom.className = 'cm-schema-hover';
      dom.innerHTML = body;
      return { dom };
    },
  };
}, { hideOnChange: true, hoverTime: 300 });
