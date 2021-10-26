<template>
  <!-- Intro Info -->
  <div class="edit-mode-bottom-banner">
    <div class="edit-banner-section intro-container">
      <p class="section-sub-title edit-mode-intro l-1">
        {{ $t('interactive-editor.menu.edit-mode-subtitle') }}
      </p>
      <p class="edit-mode-intro l-2">
        {{ $t('interactive-editor.menu.edit-mode-description') }}
      </p>
    </div>
    <div class="edit-banner-section empty-space"></div>
    <!-- Save Buttons -->
    <div class="edit-banner-section save-buttons-container">
      <p class="section-sub-title">
        {{ $t('interactive-editor.menu.config-save-methods-subheading') }}
      </p>
      <Button
        :click="openExportConfigMenu"
        v-tooltip="tooltip($t('interactive-editor.menu.export-config-tooltip'))"
      >
        {{ $t('interactive-editor.menu.export-config-btn') }}
        <ExportIcon />
      </Button>
      <Button
        :click="reset"
        v-tooltip="tooltip($t('interactive-editor.menu.cancel-changes-tooltip'))"
      >
        {{ $t('interactive-editor.menu.cancel-changes-btn') }}
        <CancelIcon />
      </Button>
      <Button
        :click="saveLocally"
        v-tooltip="tooltip($t('interactive-editor.menu.save-locally-tooltip'))"
      >
        {{ $t('interactive-editor.menu.save-locally-btn') }}
        <SaveLocallyIcon />
      </Button>
      <Button
        :click="writeToDisk"
        v-tooltip="tooltip($t('interactive-editor.menu.save-disk-tooltip'))"
      >
        {{ $t('interactive-editor.menu.save-disk-btn') }}
        <SaveToDiskIcon />
      </Button>
    </div>
    <!-- Open Modal Buttons -->
    <div class="edit-banner-section edit-site-config-buttons">
      <p class="section-sub-title">
        {{ $t('interactive-editor.menu.edit-site-data-subheading') }}
      </p>
      <Button
        :click="openEditPageInfo"
        v-tooltip="tooltip($t('interactive-editor.menu.edit-page-info-tooltip'))"
      >
        {{ $t('interactive-editor.menu.edit-page-info-btn') }}
        <PageInfoIcon />
      </Button>
      <Button
        :click="openEditAppConfig"
        v-tooltip="tooltip($t('interactive-editor.menu.edit-app-config-tooltip'))"
      >
        {{ $t('interactive-editor.menu.edit-app-config-btn') }}
        <AppConfigIcon />
      </Button>
    </div>
    <!-- Modals for editing appConfig + pageInfo -->
    <EditPageInfo />
    <EditAppConfig />
  </div>
</template>

<script>
import axios from 'axios';
import jsYaml from 'js-yaml';
import ProgressBar from 'rsup-progress';

import Button from '@/components/FormElements/Button';
import StoreKeys from '@/utils/StoreMutations';
import EditPageInfo from '@/components/InteractiveEditor/EditPageInfo';
import EditAppConfig from '@/components/InteractiveEditor/EditAppConfig';
import { modalNames, localStorageKeys, serviceEndpoints } from '@/utils/defaults';
import ErrorHandler, { InfoHandler } from '@/utils/ErrorHandler';

import SaveLocallyIcon from '@/assets/interface-icons/interactive-editor-save-locally.svg';
import SaveToDiskIcon from '@/assets/interface-icons/interactive-editor-save-disk.svg';
import ExportIcon from '@/assets/interface-icons/interactive-editor-export-changes.svg';
import CancelIcon from '@/assets/interface-icons/interactive-editor-cancel-changes.svg';
import AppConfigIcon from '@/assets/interface-icons/interactive-editor-app-config.svg';
import PageInfoIcon from '@/assets/interface-icons/interactive-editor-page-info.svg';

export default {
  name: 'EditModeSaveMenu',
  components: {
    Button,
    EditPageInfo,
    SaveLocallyIcon,
    SaveToDiskIcon,
    ExportIcon,
    CancelIcon,
    AppConfigIcon,
    PageInfoIcon,
    EditAppConfig,
  },
  computed: {
    config() {
      return this.$store.state.config;
    },
  },
  data() {
    return {
      saveSuccess: undefined,
      responseText: '',
      progress: new ProgressBar({ color: 'var(--progress-bar)' }),
    };
  },
  methods: {
    reset() {
      this.$store.dispatch(StoreKeys.INITIALIZE_CONFIG);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
    },
    openExportConfigMenu() {
      this.$modal.show(modalNames.EXPORT_CONFIG_MENU);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    openEditPageInfo() {
      this.$modal.show(modalNames.EDIT_PAGE_INFO);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    openEditAppConfig() {
      this.$modal.show(modalNames.EDIT_APP_CONFIG);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
    },
    showToast(message, success) {
      this.$toasted.show(message, { className: `toast-${success ? 'success' : 'error'}` });
    },
    carefullyClearLocalStorage() {
      localStorage.removeItem(localStorageKeys.PAGE_INFO);
      localStorage.removeItem(localStorageKeys.APP_CONFIG);
      localStorage.removeItem(localStorageKeys.CONF_SECTIONS);
    },
    saveLocally() {
      const data = this.config;
      localStorage.setItem(localStorageKeys.CONF_SECTIONS, JSON.stringify(data.sections));
      localStorage.setItem(localStorageKeys.PAGE_INFO, JSON.stringify(data.pageInfo));
      localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(data.appConfig));
      if (data.appConfig.theme) {
        localStorage.setItem(localStorageKeys.THEME, data.appConfig.theme);
      }
      InfoHandler('Config has succesfully been saved in browser storage', 'Config Update');
      this.showToast(this.$t('config-editor.success-msg-local'), true);
    },
    writeToDisk() {
      // 1. Convert JSON into YAML
      const yamlOptions = {};
      const yaml = jsYaml.dump(this.config, yamlOptions);
      // 2. Prepare the request
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      const endpoint = `${baseUrl}${serviceEndpoints.save}`;
      const headers = { 'Content-Type': 'text/plain' };
      const body = { config: yaml, timestamp: new Date() };
      const request = axios.post(endpoint, body, headers);
      // 3. Make the request, and handle response
      this.progress.start();
      request.then((response) => {
        this.saveSuccess = response.data.success || false;
        this.responseText = response.data.message;
        if (this.saveSuccess) {
          this.carefullyClearLocalStorage();
          this.showToast(this.$t('config-editor.success-msg-disk'), true);
        } else {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
        }
        InfoHandler('Config has been written to disk succesfully', 'Config Update');
        this.progress.end();
        this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
      })
        .catch((error) => {
          this.saveSuccess = false;
          this.responseText = error;
          this.showToast(error, false);
          ErrorHandler(`Failed to save config. ${error}`);
          this.progress.end();
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

div.edit-mode-bottom-banner {
  position: absolute;
  display: grid;
  z-index: 5;
  bottom: 0;
  width: 100%;
  padding: 0.25rem 0;
  border-top: 2px solid var(--interactive-editor-color);
  background: var(--interactive-editor-background-darker);
  box-shadow: 0 -5px 7px var(--transparent-50);
  grid-template-columns: 45% 10% 45%;
  @include laptop-up { grid-template-columns: 40% 20% 40%; }
  @include monitor-up { grid-template-columns: 30% 40% 30%; }
  @include big-screen-up { grid-template-columns: 25% 50% 25%; }

  /* Main sections */
  .edit-banner-section {
    padding: 0.5rem;
    height: 100%;
    /* Section sub-titles */
    p.section-sub-title {
      margin: 0;
      color: var(--interactive-editor-color);
      font-weight: bold;
      cursor: default;
    }
    /* Intro-text container */
    &.intro-container  {
        p.edit-mode-intro {
        margin: 0;
        color: var(--interactive-editor-color);
        cursor: default;
      }
    }
    /* Button containers */
    &.edit-site-config-buttons,
    &.save-buttons-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      button {
        margin: 0.25rem;
        height: fit-content;
      }
      p.section-sub-title {
        grid-column-start: span 2;
      }
    }
    &.save-buttons-container {
      grid-row-start: span 2;
    }
  }

  /* Mobile layout */
  @include tablet-down {
    display: flex;
    flex-direction: column;
    .edit-banner-section,
    .edit-banner-section.intro-container {
      max-width: 90%;
      width: 100%;
      margin: 0.2rem auto;
      flex-direction: column;
    }
  }
  /* Set colors for buttons */
  .edit-banner-section button {
    color: var(--interactive-editor-color);
    border-color: var(--interactive-editor-color);
    background: var(--interactive-editor-background);
    &:hover {
      color: var(--interactive-editor-background);
      border-color: var(--interactive-editor-color);
      background: var(--interactive-editor-color);
    }
  }
}
</style>
