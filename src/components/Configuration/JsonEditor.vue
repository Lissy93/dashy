<template>
  <div class="json-editor-outer" v-if="allowViewConfig">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <div class="editor-options">
        <label>
          <input type="checkbox" v-model="wordWrap" />
          {{ $t('config-editor.wrap-label') }}
        </label>
        <button type="button" class="format-btn" @click="formatDocument">
          {{ $t('config-editor.format-label') }}
        </button>
        <span class="toolbar-divider" aria-hidden="true" />
        <button
          type="button"
          class="icon-btn"
          @click="onDownload"
          v-tooltip="$t('config-editor.download-tooltip')"
          :aria-label="$t('config-editor.download-label')"
        >
          <DownloadIcon />
        </button>
        <button
          type="button"
          class="icon-btn"
          @click="onCopy"
          v-tooltip="$t('config-editor.copy-tooltip')"
          :aria-label="$t('config-editor.copy-label')"
        >
          <CopyIcon />
        </button>
      </div>
      <div class="editor-status" :class="`chip-${status.kind}`">
        {{ status.text }}
      </div>
    </div>

    <!-- Editor mount point, for actual YAML code editor part -->
    <div ref="editorEl" class="cm-container min-box"></div>

    <!-- Action bar, for save actions -->
    <div class="action-bar">
      <div class="secondary-actions">
        <Button
          :click="onReset"
          v-tooltip="$t('config-editor.reset-tooltip')"
        >
          {{ $t('config-editor.reset-label') }}
          <ResetIcon />
        </Button>
        <Button
          :click="onPreview"
          :disallow="!isValid"
          v-tooltip="$t('config-editor.preview-button')"
        >
          {{ $t('config-editor.preview-button') }}
          <PreviewIcon />
        </Button>
        <Button
          v-if="allowSaveLocally"
          :click="onSaveLocally"
          :disallow="!isValid"
          v-tooltip="$t('interactive-editor.menu.save-locally-tooltip')"
        >
          {{ $t('interactive-editor.menu.save-locally-btn') }}
          <SaveLocallyIcon />
        </Button>
      </div>
      <Button
        class="primary-action"
        :click="onSaveToDisk"
        :disallow="!isValid || !allowWriteToDisk"
        v-tooltip="$t('interactive-editor.menu.save-disk-tooltip')"
      >
        {{ $t('interactive-editor.menu.save-disk-btn') }}
        <SaveToDiskIcon />
      </Button>
    </div>

    <!-- Diagnostics -->
    <div class="errors">
      <ul>
        <li
          v-for="(error, i) in errorMessages"
          :key="i"
          :class="`type-${error.type}`"
          @click="jumpTo(error)"
        >
          <span class="err-loc">L{{ error.line }}</span>
          {{ error.message }}
        </li>
        <li v-if="!errorMessages.length" class="type-valid">
          {{ $t('config-editor.valid-label') }}
        </li>
      </ul>
    </div>

    <p v-if="!allowWriteToDisk" class="no-permission-note">
      {{ $t('config-editor.not-admin-note') }}
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
import ErrorHandler, { InfoHandler, InfoKeys } from '@/utils/logging/ErrorHandler';
import StoreKeys from '@/utils/StoreMutations';
import Button from '@/components/FormElements/Button';
import AccessError from '@/components/Configuration/AccessError';

import DownloadIcon from '@/assets/interface-icons/config-download-file.svg';
import CopyIcon from '@/assets/interface-icons/interactive-editor-copy-clipboard.svg';
import SaveToDiskIcon from '@/assets/interface-icons/interactive-editor-save-disk.svg';
import SaveLocallyIcon from '@/assets/interface-icons/interactive-editor-save-locally.svg';
import ResetIcon from '@/assets/interface-icons/interactive-editor-cancel-changes.svg';
import PreviewIcon from '@/assets/interface-icons/config-preview.svg';

const DUMP_OPTS = { noRefs: true, lineWidth: 120 };

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
  components: {
    Button,
    AccessError,
    DownloadIcon,
    CopyIcon,
    SaveToDiskIcon,
    SaveLocallyIcon,
    ResetIcon,
    PreviewIcon,
  },
  data() {
    return {
      wordWrap: true,
      errorMessages: [],
      initialDoc: '',
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
    // Used to prevent preview/save on invalid YAML
    isValid() { return !this.errorMessages.some((e) => e.type === 'error'); },
    // For chip to show "valid", "warnings", "error"
    status() {
      if (!this.isValid) return { kind: 'err', text: this.$t('config-editor.status-invalid') };
      const errorCount = this.errorMessages.length;
      if (errorCount) {
        const key = errorCount === 1 ? 'config-editor.status-warning' : 'config-editor.status-warnings';
        return { kind: 'warn', text: this.$t(key, { errorCount }) };
      }
      return { kind: 'ok', text: this.$t('config-editor.status-valid') };
    },
    permissions() { return this.$store.getters.permissions; },
    allowWriteToDisk() { return this.permissions.allowWriteToDisk; },
    allowSaveLocally() { return this.permissions.allowSaveLocally; },
    allowViewConfig() { return this.permissions.allowViewConfig; },
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
      data.sections = (data.sections || []).map(({ filteredItems: _filteredItems, ...s }) => s);
      if (!data.pageInfo) data.pageInfo = { title: 'Dashy' };
      return jsYaml.dump(data, DUMP_OPTS);
    },
    createEditor() {
      try {
        this.initialDoc = this.initialText();
        const updateListener = EditorView.updateListener.of((u) => {
          if (u.docChanged || u.transactions.some((tr) => tr.effects.length)) {
            this.syncDiagnostics();
          }
        });
        const state = EditorState.create({
          doc: this.initialDoc,
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
            EditorView.darkTheme.of(true),
            updateListener,
          ],
        });
        this.view = markRaw(new EditorView({ state, parent: this.$refs.editorEl }));
        this.syncDiagnostics();
      } catch (e) {
        ErrorHandler(`Editor failed to initialize: ${e.message}`);
        this.$toast.error(this.$t('config-editor.editor-init-fail-msg', { message: e.message }));
      }
    },
    syncDiagnostics() {
      if (!this.view) return;
      const { doc } = this.view.state;
      const next = [];
      forEachDiagnostic(this.view.state, (d, from) => {
        next.push({
          type: d.severity === 'error' ? 'error' : 'warning',
          message: d.message,
          line: doc.lineAt(from).number,
          from,
        });
      });
      // Skip reassignment when nothing changed, to avoid pointless re-renders.
      const prev = this.errorMessages;
      const same = next.length === prev.length
        && next.every((e, i) => e.from === prev[i].from && e.message === prev[i].message);
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
        this.$toast.error(this.$t('config-editor.format-fail-msg', { message: e.message }));
      }
    },
    jumpTo(err) {
      if (!this.view) return;
      const pos = Math.min(err.from, this.view.state.doc.length);
      this.view.focus();
      this.view.dispatch({
        selection: { anchor: pos, head: pos },
        effects: EditorView.scrollIntoView(pos, { y: 'center' }),
      });
    },
    currentText() {
      return this.view?.state.doc.toString() ?? '';
    },
    parseCurrent() {
      try {
        return jsYaml.load(this.currentText());
      } catch (e) {
        this.$toast.error(this.$t('config-editor.parse-fail-msg', { message: e.message }));
        return null;
      }
    },
    // Only sync local store with edits when the disk write actually succeeded,
    // so a failed save leaves dashboard state matching the saved config.
    async onSaveToDisk() {
      const data = this.parseCurrent();
      if (data == null) return;
      const ok = await this.writeConfigToDisk(data);
      if (!ok) return;
      this.$store.commit(StoreKeys.SET_PAGE_INFO, data.pageInfo);
      this.$store.commit(StoreKeys.SET_SECTIONS, data.sections);
      this.$store.commit(StoreKeys.SET_PAGES, data.pages || []);
    },
    onSaveLocally() {
      const data = this.parseCurrent();
      if (data == null) return;
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm(this.$t('interactive-editor.menu.save-locally-warning'))) {
        this.saveConfigLocally(data);
      }
    },
    // Commits a full parsed config object to the Vuex store (preview / reset).
    // Each top-level section is only committed when present, so a user saving
    // a YAML that omits e.g. `appConfig:` can't nuke existing store state.
    applyConfigToStore(data) {
      if (data.appConfig !== undefined) this.$store.commit(StoreKeys.SET_APP_CONFIG, data.appConfig);
      if (data.pageInfo !== undefined) this.$store.commit(StoreKeys.SET_PAGE_INFO, data.pageInfo);
      if (data.sections !== undefined) this.$store.commit(StoreKeys.SET_SECTIONS, data.sections);
      this.$store.commit(StoreKeys.SET_PAGES, data.pages || []);
    },
    onPreview() {
      const data = this.parseCurrent();
      if (data == null) return;
      InfoHandler('Applying changes to local state...', InfoKeys.RAW_EDITOR);
      this.applyConfigToStore(data);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
      this.$toast(this.$t('config-editor.preview-applied-msg'));
    },
    onReset() {
      if (!this.view) return;
      const dirty = this.view.state.doc.toString() !== this.initialDoc;
      const inPreview = this.$store.state.editMode;
      if (!dirty && !inPreview) return;
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (!confirm(this.$t('config-editor.reset-confirm-msg'))) return;
      if (dirty) {
        this.view.dispatch({
          changes: { from: 0, to: this.view.state.doc.length, insert: this.initialDoc },
        });
      }
      if (inPreview) {
        const original = jsYaml.load(this.initialDoc);
        if (original) this.applyConfigToStore(original);
        this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
      }
    },
    onDownload() {
      const blob = new Blob([this.currentText()], { type: 'text/yaml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'conf.yml';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    async onCopy() {
      try {
        await navigator.clipboard.writeText(this.currentText());
        this.$toast.success(this.$t('config-editor.copy-success-msg'));
      } catch (e) {
        this.$toast.error(this.$t('config-editor.copy-fail-msg', { message: e.message }));
      }
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
  flex-wrap: wrap;
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
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &.chip-ok {
      background: var(--success);
      color: var(--black);
    }

    &.chip-warn {
      background: var(--warning);
      color: var(--black);
    }

    &.chip-err {
      background: var(--danger);
      color: var(--white);
    }
  }
}

// Structural styles for CodeMirror, the colors and font live in theme sec below
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
    background: var(--background);
    color: var(--config-settings-color);

    &, div, span {
      font-family: var(--font-monospace);
    }
    .cm-content {
      caret-color: var(--primary);
    }
    .cm-cursor,
    .cm-dropCursor {
      border-left-color: var(--primary);
    }
    &.cm-focused .cm-selectionBackground,
    .cm-selectionBackground,
    .cm-content ::selection {
      background: var(--primary-transparent-60);
    }
    .cm-gutters {
      background: var(--background-darker);
      color: var(--medium-grey);
      border-right: 1px solid var(--transparent-white-10);
    }
    .cm-activeLine,
    .cm-activeLineGutter {
      background: var(--transparent-white-10);
    }
    .cm-foldPlaceholder {
      background: var(--primary-transparent-60);
      border: none;
      padding: 0 0.25rem;
    }
    .cm-searchMatch {
      background: var(--primary-transparent-60);
    }
    .cm-searchMatch-selected {
      background: var(--primary);
    }
    .cm-lint-marker-warning {
      color: var(--warning);
    }
    .cm-lint-marker-error {
      color: var(--danger);
    }
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
      &::before { content: "⚠️ "; }
    }

    &.type-error {
      color: var(--danger);
      &::before { content: "❌ "; }
    }

    &.type-valid {
      color: var(--success);
      cursor: default;
      &::before { content: "✅ "; }
    }
  }
}

p.note {
  font-size: 0.85rem;
  color: var(--medium-grey);
  margin: 0.5rem auto;
  text-align: center;
}

p.no-permission-note {
  color: var(--warning);
  font-size: 0.85rem;
  margin: 0.4rem auto;
  text-align: center;
}

// Mini icon-only toolbar buttons (Download, Copy)
.editor-toolbar .icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  padding: 0;
  background: transparent;
  color: var(--config-settings-color);
  border: 1px solid transparent;
  border-radius: var(--curve-factor);
  cursor: pointer;

  svg {
    width: 1.1rem;
    height: 1.1rem;
    fill: currentColor;
    stroke: currentColor;
  }

  &:hover {
    border-color: var(--config-settings-color);
    background: var(--transparent-white-10);
  }
}

.editor-toolbar .toolbar-divider {
  width: 1px;
  height: 1.2rem;
  background: var(--transparent-white-10);
}

.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: var(--background-darker);
  border-top: 1px solid var(--config-settings-background);
  flex-wrap: wrap;

  .secondary-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  button {
    display: inline-flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    margin: 0;
    min-width: unset;
    font-size: 0.9rem;
    background: transparent;
    color: var(--config-settings-color);
    border: 1px solid var(--config-settings-color);
    border-radius: var(--curve-factor);
    cursor: pointer;

    svg {
      fill: currentColor;
      stroke: currentColor;
    }

    &:hover:not(.disallowed):not(:disabled) {
      background: var(--config-settings-color);
      color: var(--background-darker);
    }

    &.disallowed,
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  button.primary-action {
    background: var(--primary);
    color: var(--background);
    border-color: var(--primary);
    font-weight: bold;

    &:hover:not(.disallowed) {
      background: var(--background);
      color: var(--primary);
      border-color: var(--primary);
    }
  }
}
</style>

<!-- Color styles for CodeMirror input -->
<style lang="scss">
.cm-tooltip,
.cm-tooltip-autocomplete,
.cm-panels {
  background: var(--background-darker);
  color: var(--config-settings-color);
  border: 1px solid var(--primary);
}

.cm-diagnostic {
  border-left: 3px solid var(--primary);
  padding: 0.25rem 0.5rem;
  &-warning {
    border-left-color: var(--warning);
  }
  &-error {
    border-left-color: var(--danger);
  }
}

.cm-schema-hover {
  max-width: 22rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  line-height: 1.45;

  .title {
    font-weight: bold;
    color: var(--primary);
    margin-bottom: 0.25rem;
  }

  .desc {
    margin-bottom: 0.5rem;
  }

  .meta {
    color: var(--medium-grey);
    margin-top: 0.25rem;

    .label {
      color: var(--primary);
      font-weight: bold;
      margin-right: 0.25rem;
    }
  }

  code {
    font-family: var(--font-monospace);
    padding: 0.1rem 0.25rem;
    border-radius: var(--curve-factor);
    background: var(--transparent-white-10);
  }
}
</style>
