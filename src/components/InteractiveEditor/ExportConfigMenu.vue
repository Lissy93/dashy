<template>
<modal
    :name="modalName"
    :resizable="true"
    width="50%"
    height="80%"
    classes="dashy-modal export-modal"
    @closed="modalClosed"
  >
  <div class="export-config-inner" v-if="allowViewConfig">
    <!-- Download and Copy to CLipboard Buttons -->
    <h3>{{ $t('interactive-editor.export.export-title') }}</h3>
    <div class="download-button-container">
      <Button :click="copyConfigToClipboard"
        v-tooltip="tooltip($t('interactive-editor.export.copy-clipboard-tooltip'))">
        {{ $t('interactive-editor.export.copy-clipboard-btn') }}
        <CopyConfigIcon />
      </Button>
      <Button :click="downloadConfig"
        v-tooltip="tooltip($t('interactive-editor.export.download-file-tooltip'))">
        {{ $t('interactive-editor.export.download-file-btn') }}
        <DownloadConfigIcon />
      </Button>
    </div>
    <!-- View Config in Tree Mode Section -->
    <h3>{{ $t('interactive-editor.export.view-title') }}</h3>
    <tree-view :data="config" class="config-tree-view" />
  </div>
  <AccessError v-else />
  </modal>
</template>

<script>
import JsYaml from 'js-yaml';
import Button from '@/components/FormElements/Button';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';
import AccessError from '@/components/Configuration/AccessError';
import DownloadConfigIcon from '@/assets/interface-icons/config-download-file.svg';
import CopyConfigIcon from '@/assets/interface-icons/interactive-editor-copy-clipboard.svg';
import { InfoHandler, InfoKeys } from '@/utils/ErrorHandler';

export default {
  name: 'ExportConfigMenu',
  components: {
    Button,
    AccessError,
    CopyConfigIcon,
    DownloadConfigIcon,
  },
  data() {
    return {
      modalName: modalNames.EXPORT_CONFIG_MENU,
    };
  },
  props: {},
  computed: {
    config() {
      return this.$store.state.config;
    },
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  methods: {
    convertJsonToYaml() {
      return JsYaml.dump(this.config);
    },
    downloadConfig() {
      const filename = 'dashy_conf.yml';
      const config = this.convertJsonToYaml();
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8, ${encodeURIComponent(config)}`);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      InfoHandler('Config downloaded as YAML file', InfoKeys.EDITOR);
    },
    copyConfigToClipboard() {
      const config = this.convertJsonToYaml();
      navigator.clipboard.writeText(config);
      this.$toasted.show(this.$t('config.data-copied-msg'));
      InfoHandler('Config copied to clipboard', InfoKeys.EDITOR);
    },
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
    tooltip(content) {
      return {
        content, trigger: 'hover focus', delay: 250, classes: 'in-modal-tt',
      };
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
  background: var(--interactive-editor-background);
  color: var(--interactive-editor-color);
  height: 100%;
  overflow-y: auto;
  h3 {
    margin: 1rem 0;
  }
  .download-button-container {
    display: flex;
    justify-content: center;
    padding: 0 0.5rem 1rem;
    border-bottom: 1px dashed var(--interactive-editor-color);
    button { margin: 0 1rem; }
  }
  .config-tree-view {
    padding: 0.5rem;
    font-family: var(--font-monospace);
    color: var(--interactive-editor-color);
    background: var(--interactive-editor-background-darker);
    border-radius: var(--curve-factor);
    box-shadow: 0px 0px 3px var(--interactive-editor-color);
    margin-bottom: 1.5rem;
    span {
      font-family: var(--font-monospace);
    }
  }
}
.export-modal {
  background: var(--interactive-editor-background);
}

</style>
