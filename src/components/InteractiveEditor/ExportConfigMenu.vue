<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="75%"
    height="75%"
    classes="dashy-modal export-modal"
    @before-open="buildRows"
    @closed="modalClosed"
  >
    <div class="export-config-inner" v-if="allowViewConfig">
      <section class="current-config">
        <h3>{{ $t('interactive-editor.export.current-config-title') }}</h3>
        <p class="config-path">
          <a :href="currentConfigHref" target="_blank" rel="noopener noreferrer">
            {{ currentConfigPath }}
          </a>
        </p>
        <div class="download-button-container">
          <Button :click="copyToClipboard"
            v-tooltip="tooltip($t('interactive-editor.export.copy-clipboard-tooltip'))">
            {{ $t('interactive-editor.export.copy-clipboard-btn') }}
            <CopyConfigIcon />
          </Button>
          <Button :click="downloadCurrent"
            v-tooltip="tooltip($t('interactive-editor.export.download-file-tooltip'))">
            {{ $t('interactive-editor.export.download-file-btn') }}
            <DownloadConfigIcon />
          </Button>
          <Button :click="editCurrent"
            v-tooltip="tooltip($t('interactive-editor.export.edit-current-tooltip'))">
            {{ $t('interactive-editor.export.edit-current-btn') }}
            <EditIcon />
          </Button>
        </div>
        <div class="collapsible">
          <button type="button" class="collapsible-header" @click="previewOpen = !previewOpen">
            <span>{{ $t('interactive-editor.export.preview-toggle') }}</span>
            <span class="chev">{{ previewOpen ? '▾' : '▸' }}</span>
          </button>
          <pre v-if="previewOpen" class="yaml-preview">{{ currentConfigYaml }}</pre>
        </div>
        <div v-if="currentIssues.length" class="issue-list">
          <h4>{{ $t('interactive-editor.export.issues-title', { n: currentIssues.length }) }}</h4>
          <ul>
            <li v-for="(issue, i) in currentIssues" :key="i">{{ issue }}</li>
          </ul>
        </div>
      </section>

      <section class="config-list">
        <h3>{{ $t('interactive-editor.export.config-list-title') }}</h3>
        <table>
          <colgroup>
            <col class="col-title" />
            <col class="col-path" />
            <col class="col-content" />
            <col class="col-status" />
            <col class="col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>{{ $t('interactive-editor.export.col-title') }}</th>
              <th>{{ $t('interactive-editor.export.col-path') }}</th>
              <th>{{ $t('interactive-editor.export.col-content') }}</th>
              <th>{{ $t('interactive-editor.export.col-status') }}</th>
              <th>{{ $t('interactive-editor.export.col-actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="row in rows" :key="row.id">
              <tr>
                <td class="cell-truncate">
                  <button type="button" class="link-cell" :title="row.title"
                    @click="openConfig(row)">{{ row.title }}</button>
                </td>
                <td class="cell-truncate mono">
                  <a :href="rawPathHref(row)" :title="row.path"
                    target="_blank" rel="noopener noreferrer">{{ row.path }}</a>
                </td>
                <td>{{ row.summary }}</td>
                <td>
                  <span :class="['status-pill', `status-${row.status}`]">
                    {{ statusLabel(row) }}
                  </span>
                </td>
                <td class="actions">
                  <button type="button" @click="downloadRow(row)" :disabled="!row.yamlText"
                    v-tooltip="tooltip($t('interactive-editor.export.download-row-tooltip'))">
                    <DownloadConfigIcon />
                  </button>
                  <button type="button" @click="openConfig(row)" :disabled="!row.yamlText"
                    v-tooltip="tooltip($t('interactive-editor.export.apply-row-tooltip'))">
                    <PreviewIcon />
                  </button>
                  <button type="button" @click="toggleRow(row)" :disabled="!row.yamlText" class="arr"
                    v-tooltip="tooltip($t('interactive-editor.export.preview-row-tooltip'))">
                    {{ expandedRow === row.id ? '▾' : '▸' }}
                  </button>
                </td>
              </tr>
              <tr v-if="expandedRow === row.id" class="row-preview">
                <td colspan="5"><pre class="yaml-preview">{{ row.yamlText }}</pre></td>
              </tr>
            </template>
          </tbody>
        </table>
      </section>
    </div>
    <AccessError v-else />
  </modal>
</template>

<script>
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import Button from '@/components/FormElements/Button';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/config/defaults';
import AccessError from '@/components/Configuration/AccessError';
import DownloadConfigIcon from '@/assets/interface-icons/config-download-file.svg';
import CopyConfigIcon from '@/assets/interface-icons/interactive-editor-copy-clipboard.svg';
import EditIcon from '@/assets/interface-icons/config-edit-json.svg';
import PreviewIcon from '@/assets/interface-icons/config-preview.svg';
import request from '@/utils/request';
import { formatConfigPath, makePageName, makeRoutePath } from '@/utils/config/ConfigHelpers';
import { validateConfig, formatIssue } from '@/utils/config/validateConfig';
import { ErrorHandler, InfoHandler, InfoKeys } from '@/utils/logging/ErrorHandler';

/* Counts num of sections, items and widgets for a given config */
const sumBy = (arr, key) => {
  return (arr || [])
    .reduce(
      (n, item) => n + (Array.isArray(item?.[key]) ? item[key].length : 0), 0,
    );
}

const basename = (path) => {
  if (!path) return null;
  const last = path.split('/').filter(Boolean).pop();
  return last && /\.ya?ml$/i.test(last) ? last : null;
};

export default {
  name: 'ExportConfigMenu',
  components: {
    Button,
    AccessError,
    CopyConfigIcon,
    DownloadConfigIcon,
    PreviewIcon,
    EditIcon,
  },
  data() {
    return {
      modalName: modalNames.EXPORT_CONFIG_MENU,
      previewOpen: false,
      expandedRow: null,
      rows: [],
    };
  },
  computed: {
    config() {
      return this.$store.state.configSource;
    },
    rootConfig() {
      return this.$store.state.rootConfig;
    },
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
    currentConfigYaml() {
      return yamlDump(this.config);
    },
    currentConfigPath() {
      return this.$store.state.currentConfigInfo?.confPath
        || import.meta.env.VITE_APP_CONFIG_PATH
        || '/conf.yml';
    },
    currentConfigHref() {
      return formatConfigPath(this.currentConfigPath);
    },
    currentIssues() {
      return validateConfig(this.config).errors.map((e) => formatIssue(e));
    },
  },
  methods: {
    buildRows() {
      this.expandedRow = null;
      const root = this.rootConfig || {};
      const rootRow = this.makeRow({
        id: 'root',
        title: root.pageInfo?.title || this.currentConfigPath,
        path: this.currentConfigPath,
        isRoot: true,
      });
      rootRow.yamlText = yamlDump(root);
      this.applyValidation(rootRow, root);
      const pageRows = (root.pages || []).map((page) => this.makeRow({
        id: makePageName(page.name),
        title: page.name,
        path: page.path,
        isRoot: false,
      }));
      this.rows = [rootRow, ...pageRows];
      // Iterate this.rows (not pageRows) so loadRow mutates the reactive proxies
      this.rows.forEach((row) => { if (!row.isRoot) this.loadRow(row); });
    },
    makeRow(base) {
      return {
        status: 'loading', summary: '', yamlText: '', errorCount: 0, ...base,
      };
    },
    async loadRow(row) {
      try {
        const res = await request.get(formatConfigPath(row.path));
        let parsed;
        try {
          parsed = yamlLoad(res.data) || {};
        } catch (parseErr) {
          row.status = 'error';
          ErrorHandler(`Sub-config parse failed: ${row.path}`, parseErr);
          return;
        }
        row.yamlText = typeof res.data === 'string' ? res.data : yamlDump(parsed);
        row.title = parsed.pageInfo?.title || row.title || row.path;
        this.applyValidation(row, parsed);
      } catch (fetchErr) {
        row.status = 'unknown';
        ErrorHandler(`Sub-config fetch failed: ${row.path}`, fetchErr);
      }
    },
    applyValidation(row, cfg) {
      const { errors } = validateConfig(cfg);
      row.summary = this.summarize(cfg);
      row.errorCount = errors.length;
      row.status = errors.length ? 'warnings' : 'valid';
    },
    summarize(cfg) {
      const sections = Array.isArray(cfg?.sections) ? cfg.sections.length : 0;
      const items = sumBy(cfg?.sections, 'items');
      const widgets = sumBy(cfg?.sections, 'widgets');
      return this.$t('interactive-editor.export.content-summary', { sections, items, widgets });
    },
    statusLabel(row) {
      if (row.status === 'warnings') {
        return this.$t('interactive-editor.export.status-warnings', { n: row.errorCount });
      }
      return this.$t(`interactive-editor.export.status-${row.status}`);
    },
    downloadYaml(text, filename) {
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    downloadCurrent() {
      this.downloadYaml(this.currentConfigYaml, 'dashy_conf.yml');
      InfoHandler('Config downloaded as YAML file', InfoKeys.EDITOR);
    },
    downloadRow(row) {
      const filename = basename(row.path) || `${row.id}.yml`;
      this.downloadYaml(row.yamlText, filename);
      InfoHandler(`Config '${row.id}' downloaded as YAML file`, InfoKeys.EDITOR);
    },
    async copyToClipboard() {
      if (!navigator.clipboard) {
        ErrorHandler('Clipboard access requires HTTPS. See: https://bit.ly/3N5WuAA');
        this.$toast.error(this.$t('interactive-editor.export.copy-fail-msg'));
        return;
      }
      try {
        await navigator.clipboard.writeText(this.currentConfigYaml);
        this.$toast(this.$t('config.data-copied-msg'));
        InfoHandler('Config copied to clipboard', InfoKeys.EDITOR);
      } catch (e) {
        ErrorHandler('Clipboard write failed', e);
        this.$toast.error(this.$t('interactive-editor.export.copy-fail-msg'));
      }
    },
    toggleRow(row) {
      this.expandedRow = this.expandedRow === row.id ? null : row.id;
    },
    openConfig(row) {
      const target = makeRoutePath('home', row.isRoot ? null : row.id);
      // this.$modal.hide(this.modalName);
      if (this.$route.path !== target) this.$router.push(target);
    },
    editCurrent() {
      this.$modal.hide(this.modalName);
      this.$store.commit(StoreKeys.CONF_MENU_INDEX, 2);
      this.$modal.show(modalNames.CONF_EDITOR);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    rawPathHref(row) {
      return formatConfigPath(row.path);
    },
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
    tooltip(content) {
      return { content, popperClass: 'in-modal-tt' };
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

.tooltip { z-index: 99; }

.export-config-inner {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  background: var(--interactive-editor-background);
  color: var(--interactive-editor-color);

  h3 {
      margin: 0.5rem 0 1rem 0;
  }
  section + section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px dashed var(--interactive-editor-color);
  }

  .current-config {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    h3 { margin: 0; }
  }

  .config-path {
    font-family: var(--font-monospace);
    margin: 0;
    a {
      color: var(--primary);
      opacity: 0.85;
      text-decoration: none;
      &:hover, &:focus-visible { text-decoration: underline; opacity: 1; }
    }
  }

  .download-button-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-width: 50rem;
    margin: 0 auto;
    width: 100%;
    button { flex: 1 1 10rem; margin: 0; }
    @include tablet-down { flex-direction: column; }
  }

  .collapsible-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    color: inherit;
    background: var(--interactive-editor-background-darker);
    border: none;
    border-radius: var(--curve-factor);
  }

  .issue-list {
    padding: 0.5rem 0.75rem;
    background: var(--interactive-editor-background-darker);
    border-left: 3px solid var(--warning);
    border-radius: var(--curve-factor);
    h4 { margin: 0 0 0.25rem; font-size: 0.95rem; }
    ul { margin: 0; padding-left: 1.25rem; font-size: 0.85rem; }
    li { font-family: var(--font-monospace); }
  }

  .yaml-preview {
    max-width: 100%;
    max-height: 280px;
    margin: 0.25rem 0 0;
    padding: 0.75rem;
    box-sizing: border-box;
    overflow: auto;
    font-family: var(--font-monospace);
    background: var(--interactive-editor-background-darker);
    border-radius: var(--curve-factor);
    white-space: pre;
    font-size: 0.85rem;
  }

  .config-list {
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
    .col-title    { width: 20%; }
    .col-path     { width: 20%; }
    .col-content  { width: 30%; }
    .col-status   { width: 15%; }
    .col-actions  { width: 15%; }
    th, td {
      padding: 0.4rem 0.6rem;
      text-align: left;
      border-bottom: 1px solid var(--interactive-editor-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cell-truncate .link-cell, .cell-truncate a {
      display: block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      color: var(--primary);
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;
      text-decoration: none;
      &:hover, &:focus-visible { text-decoration: underline; }
    }
    .mono, .mono * {
        font-family: var(--font-monospace);
        font-size: 0.85rem;
    }

    .status-pill {
      display: inline-block;
      padding: 0.1rem 0.5rem;
      color: var(--black);
      border-radius: var(--curve-factor);
      text-transform: uppercase;
      font-family: var(--font-monospace);
      font-weight: bold;
      font-size: 0.8rem;
      &.status-loading  { background: var(--info); }
      &.status-valid    { background: var(--success); }
      &.status-warnings { background: var(--warning); }
      &.status-error    { background: var(--danger); color: var(--white); }
      &.status-unknown  { background: var(--neutral); color: var(--white); }
    }

    .actions {
      white-space: nowrap;
      button {
        padding: 0.2rem 0.4rem;
        cursor: pointer;
        color: var(--primary);
        background: transparent;
        border: none;
        &:disabled {
          cursor: not-allowed;
          opacity: var(--dimming-factor);
        }
        svg { width: 1rem; height: 1rem; }
        &.arr {
            font-size: 1rem;
        }
      }
    }
    .row-preview td { padding: 0; }
  }
}

.export-modal {
  background: var(--interactive-editor-background);
}
</style>
