<template>
  <div class="json-editor-outer" v-if="allowViewConfig">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <div class="editor-options">
        <label><input type="checkbox" v-model="wordWrap" /> Wrap</label>
        <button type="button" class="format-btn" @click="formatDocument">Format</button>
      </div>
      <div class="editor-status" :class="isValid ? 'ok' : 'err'">
        {{ isValid ? $t('config-editor.valid-label') : errorMessages.length + ' issue(s)' }}
      </div>
    </div>

    <!-- Editor mount point -->
    <div ref="editorEl" class="cm-container min-box"></div>

    <!-- Save location -->
    <Radio
      class="save-options"
      v-model="saveMode"
      :label="$t('config-editor.save-location-label')"
      :options="saveOptions"
      :initialOption="initialSaveMode"
      :disabled="!allowWriteToDisk || !allowSaveLocally"
    />

    <!-- Save / Preview -->
    <div :class="`btn-container ${!isValid ? 'err' : ''}`">
      <Button :click="save" :disallow="!allowWriteToDisk && !allowSaveLocally">
        {{ $t('config-editor.save-button') }}
      </Button>
      <Button :click="startPreview">
        {{ $t('config-editor.preview-button') }}
      </Button>
    </div>

    <!-- Diagnostics -->
    <div class="errors">
      <ul>
        <li
          v-for="(e, i) in errorMessages"
          :key="i"
          :class="`type-${e.type}`"
          @click="jumpTo(e)"
        >
          <span class="err-loc">L{{ e.line }}</span>
          {{ e.message }}
        </li>
        <li v-if="!errorMessages.length" class="type-valid">
          {{ $t('config-editor.valid-label') }}
        </li>
      </ul>
    </div>

    <!-- Status / notes -->
    <p
      v-if="saveSuccess !== undefined"
      :class="`response-output status-${saveSuccess ? 'success' : 'fail'}`"
    >
      {{ saveSuccess ? $t('config-editor.status-success-msg') : $t('config-editor.status-fail-msg') }}
    </p>
    <p v-if="!allowWriteToDisk" class="no-permission-note">
      {{ $t('config-editor.not-admin-note') }}
    </p>
    <p class="response-output">{{ responseText }}</p>
    <p v-if="saveSuccess" class="response-output">
      {{ $t('config-editor.success-note-l1') }}
      {{ $t('config-editor.success-note-l2') }}
    </p>
    <p class="note">{{ $t('config.backup-note') }}</p>
  </div>
  <AccessError v-else />
</template>

<script>
import { shallowRef, markRaw } from 'vue';
import jsYaml from 'js-yaml';

import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { yaml } from '@codemirror/lang-yaml';
import { linter, lintGutter, forEachDiagnostic } from '@codemirror/lint';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
  bracketMatching, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting, HighlightStyle,
} from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { tags as t } from '@lezer/highlight';

import { schemaLinter } from '@/utils/config/schemaLinter';
import { schemaHover } from '@/utils/config/schemaHover';
import ConfigSavingMixin from '@/mixins/ConfigSaving';
import { InfoHandler, InfoKeys } from '@/utils/logging/ErrorHandler';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/config/defaults';
import Button from '@/components/FormElements/Button';
import Radio from '@/components/FormElements/Radio';
import AccessError from '@/components/Configuration/AccessError';

const DUMP_OPTS = { noRefs: true, lineWidth: 120 };

// CodeMirror theme — uses --background / --background-darker / --primary / --config-settings-color
// so the editor tracks the user's active theme (the dedicated --code-editor-* vars are hardcoded light).
const MONO_FONT = 'ui-monospace, "Cascadia Mono", "Segoe UI Mono", "Liberation Mono", Menlo, Monaco, Consolas, monospace';

const dashyTheme = EditorView.theme({
  '&': {
    color: 'var(--config-settings-color)',
    backgroundColor: 'var(--background)',
    height: '100%',
  },
  '.cm-scroller': {
    fontFamily: MONO_FONT,
  },
  '.cm-content': {
    caretColor: 'var(--primary)',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--primary)',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: 'var(--primary-transparent-60)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--background-darker)',
    color: 'var(--medium-grey)',
    borderRight: '1px solid var(--transparent-white-10)',
  },
  '.cm-activeLine, .cm-activeLineGutter': {
    backgroundColor: 'var(--transparent-white-10)',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'var(--primary-transparent-60)',
    color: 'var(--config-settings-color)',
    border: 'none',
    padding: '0 0.4rem',
  },
  '.cm-tooltip, .cm-tooltip-autocomplete, .cm-panels': {
    backgroundColor: 'var(--background-darker)',
    color: 'var(--config-settings-color)',
    border: '1px solid var(--primary)',
  },
  '.cm-searchMatch': {
    backgroundColor: 'var(--primary-transparent-60)',
  },
  '.cm-searchMatch-selected': {
    backgroundColor: 'var(--primary)',
  },
  '.cm-lint-marker-warning': {
    color: 'var(--warning)',
  },
  '.cm-lint-marker-error': {
    color: 'var(--danger)',
  },
  '.cm-diagnostic': {
    borderLeft: '3px solid var(--primary)',
    backgroundColor: 'var(--background-darker)',
    color: 'var(--config-settings-color)',
    padding: '0.3rem 0.5rem',
  },
  '.cm-diagnostic-warning': {
    borderLeftColor: 'var(--warning)',
  },
  '.cm-diagnostic-error': {
    borderLeftColor: 'var(--danger)',
  },
  '.cm-schema-hover': {
    maxWidth: '22rem',
    padding: '0.5rem 0.7rem',
    fontSize: '0.85rem',
    lineHeight: '1.45',
  },
  '.cm-schema-hover .title': {
    fontWeight: 'bold',
    color: 'var(--primary)',
    marginBottom: '0.25rem',
  },
  '.cm-schema-hover .desc': {
    color: 'var(--config-settings-color)',
    marginBottom: '0.4rem',
  },
  '.cm-schema-hover .meta': {
    fontSize: '0.8rem',
    color: 'var(--medium-grey)',
    marginTop: '0.15rem',
  },
  '.cm-schema-hover .meta .label': {
    color: 'var(--primary)',
    fontWeight: 'bold',
    marginRight: '0.3rem',
  },
  '.cm-schema-hover code': {
    fontFamily: MONO_FONT,
    fontSize: '0.8rem',
    padding: '0.05rem 0.25rem',
    borderRadius: 'var(--curve-factor)',
    background: 'var(--transparent-white-10)',
    color: 'var(--config-settings-color)',
  },
}, { dark: true });

const dashyHighlight = HighlightStyle.define([
  { tag: [t.propertyName, t.attributeName, t.definition(t.propertyName)], color: 'var(--info)' },
  { tag: t.string, color: 'var(--success)' },
  { tag: t.number, color: 'var(--warning)' },
  { tag: t.bool, color: 'var(--info)', fontWeight: 'bold' },
  { tag: t.null, color: 'var(--medium-grey)', fontStyle: 'italic' },
  { tag: t.keyword, color: 'var(--primary)', fontWeight: 'bold' },
  { tag: t.comment, color: 'var(--medium-grey)', fontStyle: 'italic' },
  { tag: t.operator, color: 'var(--primary)' },
  { tag: t.punctuation, color: 'var(--medium-grey)' },
  { tag: t.meta, color: 'var(--info)' },
  { tag: t.invalid, color: 'var(--danger)' },
]);

export default {
  name: 'JsonEditor',
  mixins: [ConfigSavingMixin],
  components: { Button, Radio, AccessError },
  data() {
    return {
      wordWrap: true,
      errorMessages: [],
      saveMode: '',
      saveOptions: [
        { label: this.$t('config-editor.location-disk-label'), value: 'file' },
        { label: this.$t('config-editor.location-local-label'), value: 'local' },
      ],
    };
  },
  setup() {
    return {
      view: shallowRef(null),
      wrapCompartment: markRaw(new Compartment()),
    };
  },
  computed: {
    config() { return this.$store.state.config; },
    isValid() { return !this.errorMessages.some((e) => e.type === 'error'); },
    permissions() { return this.$store.getters.permissions; },
    allowWriteToDisk() { return this.permissions.allowWriteToDisk; },
    allowSaveLocally() { return this.permissions.allowSaveLocally; },
    allowViewConfig() { return this.permissions.allowViewConfig; },
    initialSaveMode() {
      if (this.allowWriteToDisk) return 'file';
      if (this.allowSaveLocally) return 'local';
      return '';
    },
  },
  watch: {
    wordWrap(v) {
      if (!this.view) return;
      this.view.dispatch({
        effects: this.wrapCompartment.reconfigure(v ? EditorView.lineWrapping : []),
      });
    },
  },
  mounted() {
    if (!this.allowWriteToDisk) this.saveMode = 'local';
    this.createEditor();
  },
  beforeUnmount() {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
  },
  methods: {
    initialText() {
      const data = { ...this.config };
      data.sections = (data.sections || []).map(({ filteredItems, ...s }) => s);
      if (!data.pageInfo) data.pageInfo = { title: 'Dashy' };
      return jsYaml.dump(data, DUMP_OPTS);
    },
    createEditor() {
      const updateListener = EditorView.updateListener.of((u) => {
        if (u.docChanged || u.transactions.some((tr) => tr.effects.length)) {
          this.syncDiagnostics();
        }
      });

      const state = EditorState.create({
        doc: this.initialText(),
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          foldGutter(),
          history(),
          bracketMatching(),
          closeBrackets(),
          indentOnInput(),
          syntaxHighlighting(dashyHighlight, { fallback: true }),
          highlightSelectionMatches(),
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            indentWithTab,
          ]),
          yaml(),
          lintGutter(),
          linter(schemaLinter, { delay: 300 }),
          schemaHover,
          this.wrapCompartment.of(this.wordWrap ? EditorView.lineWrapping : []),
          dashyTheme,
          updateListener,
        ],
      });

      this.view = markRaw(new EditorView({ state, parent: this.$refs.editorEl }));
      this.syncDiagnostics();
    },
    syncDiagnostics() {
      if (!this.view) return;
      const next = [];
      forEachDiagnostic(this.view.state, (d, from) => {
        next.push({
          type: d.severity === 'error' ? 'error' : 'warning',
          message: d.message,
          line: this.view.state.doc.lineAt(from).number,
          from,
        });
      });
      // Skip reassignment when nothing changed, to avoid Vue re-renders on
      // every keystroke while the lint result is identical.
      const same = next.length === this.errorMessages.length
        && next.every((e, i) => e.from === this.errorMessages[i].from
          && e.message === this.errorMessages[i].message);
      if (!same) this.errorMessages = next;
    },
    formatDocument() {
      if (!this.view) return;
      try {
        const data = jsYaml.load(this.view.state.doc.toString());
        const formatted = jsYaml.dump(data ?? {}, DUMP_OPTS);
        this.view.dispatch({
          changes: { from: 0, to: this.view.state.doc.length, insert: formatted },
        });
      } catch (e) {
        this.$toast.error(`Cannot format: ${e.message}`);
      }
    },
    jumpTo(err) {
      if (!this.view) return;
      this.view.focus();
      this.view.dispatch({
        selection: { anchor: err.from, head: err.from },
        effects: EditorView.scrollIntoView(err.from, { y: 'center' }),
      });
    },
    parseCurrent() {
      const text = this.view?.state.doc.toString() ?? '';
      try {
        return jsYaml.load(text);
      } catch (e) {
        this.$toast.error(e.message);
        return null;
      }
    },
    save() {
      const data = this.parseCurrent();
      if (data == null) return;
      if (this.saveMode === 'local' || !this.allowWriteToDisk) this.saveLocally(data);
      else if (this.saveMode === 'file') this.writeToDisk(data);
      else this.$toast.error(this.$t('config-editor.error-msg-save-mode'));
    },
    startPreview() {
      const data = this.parseCurrent();
      if (data == null) return;
      InfoHandler('Applying changes to local state...', InfoKeys.RAW_EDITOR);
      this.$store.commit(StoreKeys.SET_APP_CONFIG, data.appConfig);
      this.$store.commit(StoreKeys.SET_PAGE_INFO, data.pageInfo);
      this.$store.commit(StoreKeys.SET_SECTIONS, data.sections);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
      this.$modal.hide(modalNames.CONF_EDITOR);
    },
    writeToDisk(data) {
      this.writeConfigToDisk(data);
      this.$store.commit(StoreKeys.SET_PAGE_INFO, data.pageInfo);
      this.$store.commit(StoreKeys.SET_SECTIONS, data.sections);
    },
    saveLocally(data) {
      const msg = this.$t('interactive-editor.menu.save-locally-warning');
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm(msg)) this.saveConfigLocally(data);
    },
    showToast(message, success) {
      this.$toast[success ? 'success' : 'error'](message);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/media-queries.scss';

.json-editor-outer {
  text-align: center;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.4rem 0.6rem;
  background: var(--background-darker);
  border-bottom: 1px solid var(--config-settings-background);

  .editor-options {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--config-settings-color);
    font-size: 0.85rem;

    label {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      cursor: pointer;
    }

    button.format-btn {
      background: transparent;
      color: var(--config-settings-color);
      border: 1px solid var(--config-settings-color);
      border-radius: var(--curve-factor);
      padding: 0.25rem 0.6rem;
      cursor: pointer;

      &:hover {
        background: var(--config-settings-color);
        color: var(--background-darker);
      }
    }
  }

  .editor-status {
    font-size: 0.85rem;
    padding: 0.15rem 0.5rem;
    border-radius: var(--curve-factor);

    &.ok {
      color: var(--success);
    }

    &.err {
      color: var(--danger);
      font-weight: bold;
    }
  }
}

// Structural only — colors and font live in the CodeMirror theme.
.cm-container.min-box {
  height: 58vh;
  border: 1px solid var(--primary);
  border-radius: var(--curve-factor);
  overflow: hidden;
  text-align: left;
  direction: ltr;

  .cm-editor {
    height: 100%;
    font-size: 0.9rem;
  }

  .cm-focused {
    outline: none;
  }
}

.errors {
  text-align: left;
  margin: 0.5rem auto;
  width: 95%;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    font-size: 0.85rem;
    cursor: pointer;
    padding: 0.1rem 0.25rem;
    border-radius: var(--curve-factor);

    &:hover:not(.type-valid) {
      background: var(--transparent-white-10);
    }

    .err-loc {
      display: inline-block;
      min-width: 2.5rem;
      margin-right: 0.4rem;
      color: var(--medium-grey);
    }

    &.type-warning {
      color: var(--warning);

      &::before {
        content: "⚠️ ";
      }
    }

    &.type-error {
      color: var(--danger);

      &::before {
        content: "❌ ";
      }
    }

    &.type-valid {
      color: var(--success);
      cursor: default;

      &::before {
        content: "✅ ";
      }
    }
  }
}

p.response-output {
  font-size: 0.8rem;
  text-align: left;
  margin: 0.5rem auto;
  width: 95%;
  color: var(--config-settings-color);

  &.status-success {
    font-weight: bold;
    color: var(--success);
  }

  &.status-fail {
    font-weight: bold;
    color: var(--danger);
  }
}

p.note {
  font-size: 0.8rem;
  color: var(--medium-grey);
  margin: 0.2rem;
}

p.no-permission-note {
  color: var(--warning);
}

.btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    font-size: 1.2rem;
    background: var(--config-settings-background);
    color: var(--config-settings-color);
    border: 1px solid var(--config-settings-color);
    border-radius: var(--curve-factor);
    &:hover {
      background: var(--config-settings-color);
      color: var(--config-settings-background);
      border-color: var(--config-settings-background);
    }
  }
  &.err button {
    opacity: 0.8;
    cursor: default;
    &:hover {
      background: var(--config-settings-background);
      color: var(--config-settings-color);
      border-color: var(--danger);
    }
  }
}

div.save-options.radio-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-top: 2px solid var(--config-settings-background);
  background: var(--background-darker);
  label.radio-label {
    font-size: 1rem;
    flex-grow: revert;
    flex-basis: revert;
    color: var(--config-settings-color);
    padding-left: 1rem;
  }
  .radio-wrapper {
    margin: 0;
    font-size: 1rem;
    justify-content: space-around;
    background: var(--background-darker);
    color: var(--config-settings-color);
    .radio-option:hover:not(.wrap-disabled) {
      border: 1px solid var(--config-settings-color);
    }
  }
}
</style>
