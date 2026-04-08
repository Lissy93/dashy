const { visit } = require('unist-util-visit');

const ALERT_TYPES = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'];
const ALERT_RE = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/;

/**
 * Remark plugin to convert GitHub-flavored markdown alerts
 * (> [!NOTE], > [!WARNING], etc.) into Docusaurus admonitions.
 */
function remarkGithubAlerts() {
  return (tree) => {
    visit(tree, 'blockquote', (node) => {
      const first = node.children[0];
      if (!first || first.type !== 'paragraph') return;

      const textNode = first.children[0];
      if (!textNode || textNode.type !== 'text') return;

      const match = textNode.value.match(ALERT_RE);
      if (!match) return;

      const type = match[1].toLowerCase();

      // Strip the [!TYPE] marker from the text
      textNode.value = textNode.value.slice(match[0].length);
      if (!textNode.value && first.children.length > 1) {
        first.children.shift();
      } else if (!textNode.value) {
        node.children.shift();
      }

      // Convert blockquote → containerDirective (picked up by admonition plugin)
      node.type = 'containerDirective';
      node.name = type;
    });
  };
}

module.exports = remarkGithubAlerts;
