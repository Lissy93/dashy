import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import importPlugin from 'eslint-plugin-import-x';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      'docs/**',
      'coverage/**',
      'user-data/**',
    ],
  },

  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  importPlugin.flatConfigs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
    settings: {
      'import-x/resolver-next': [importPlugin.createNodeResolver({ extensions: ['.js', '.mjs', '.vue'] })],
    },
    rules: {
      'arrow-parens': 'off',
      'no-else-return': 'off',
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
      'vue/no-v-html': ['warn', { ignorePattern: '(?:^|\\.)(sanitized|safeHtml)' }],

      // TODO: Enable these rules. Once I have enough sanity to fix all issues.
      'vue/html-indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/attributes-order': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/mustache-interpolation-spacing': 'off',
      'vue/order-in-components': 'off',
      'vue/no-multi-spaces': 'off',
      'vue/v-bind-style': 'off',
      'vue/v-on-style': 'off',
      'vue/v-slot-style': 'off',
      'vue/component-definition-name-casing': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/extensions': 'off',
      'import-x/order': ['warn', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'ignore',
      }],
      'import-x/newline-after-import': 'warn',
      'import-x/no-duplicates': 'error',
    },
  },

  {
    files: ['tests/**', 'vitest.config.mjs', 'vite.config.mjs', 'eslint.config.mjs'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
];
