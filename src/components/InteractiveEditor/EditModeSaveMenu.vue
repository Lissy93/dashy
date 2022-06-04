<template>
  <!-- Intro Info -->
  <div class="edit-mode-bottom-banner">
    <div class="edit-banner-section intro-container"  v-if="showEditMsg">
      <p class="section-sub-title edit-mode-intro l-1">
        {{ $t('interactive-editor.menu.edit-mode-subtitle') }}
      </p>
      <p class="edit-mode-intro l-2">
        {{ $t('interactive-editor.menu.edit-mode-description') }}
      </p>
    </div>
    <div class="edit-banner-section intro-container" v-else>
      <AccessError class="no-permission" />
    </div>
    <div class="edit-banner-section empty-space"></div>
    <!-- Save Buttons -->
    <div class="edit-banner-section save-buttons-container">
      <p class="section-sub-title">
        {{ $t('interactive-editor.menu.config-save-methods-subheading') }}
      </p>
      <Button
        :click="saveLocally"
        :disallow="!permissions.allowSaveLocally"
        v-tooltip="tooltip($t('interactive-editor.menu.save-locally-tooltip'))"
      >
        {{ $t('interactive-editor.menu.save-locally-btn') }}
        <SaveLocallyIcon />
      </Button>
      <Button
        :click="writeToDisk"
        :disallow="!permissions.allowWriteToDisk"
        v-tooltip="tooltip($t('interactive-editor.menu.save-disk-tooltip'))"
      >
        {{ $t('interactive-editor.menu.save-disk-btn') }}
        <SaveToDiskIcon />
      </Button>
      <Button
        :click="openExportConfigMenu"
        :disallow="!permissions.allowViewConfig"
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
    </div>
    <!-- Open Modal Buttons -->
    <div class="edit-banner-section edit-config-buttons-container">
      <p class="section-sub-title">
        {{ $t('interactive-editor.menu.edit-site-data-subheading') }}
      </p>
      <!-- Button to open pageInfo editor -->
      <Button
        :click="openEditPageInfo"
        :disallow="!permissions.allowViewConfig"
        v-tooltip="tooltip($t('interactive-editor.menu.edit-page-info-tooltip'))"
      >
        {{ $t('interactive-editor.menu.edit-page-info-btn') }}
        <PageInfoIcon />
      </Button>
      <!-- Button to open appConfig editor -->
      <Button
        :click="openEditAppConfig"
        :disallow="!permissions.allowViewConfig"
        v-tooltip="tooltip($t('interactive-editor.menu.edit-app-config-tooltip'))"
      >
        {{ $t('interactive-editor.menu.edit-app-config-btn') }}
        <AppConfigIcon />
      </Button>
      <!-- Button to open pages editor -->
      <Button
        :click="openEditMultiPages"
        :disallow="!permissions.allowViewConfig"
        v-tooltip="tooltip($t('interactive-editor.menu.edit-pages-tooltip'))"
      >
        {{ $t('interactive-editor.menu.edit-pages-btn') }}
        <MultiPagesIcon />
      </Button>
    </div>
    <!-- Modals for editing appConfig, pageInfo and pages -->
    <EditPageInfo />
    <EditAppConfig />
    <EditMultiPages />
  </div>
</template>

<script>
import ConfigSavingMixin from '@/mixins/ConfigSaving';
import Button from '@/components/FormElements/Button';
import StoreKeys from '@/utils/StoreMutations';
import EditPageInfo from '@/components/InteractiveEditor/EditPageInfo';
import EditAppConfig from '@/components/InteractiveEditor/EditAppConfig';
import EditMultiPages from '@/components/InteractiveEditor/EditMultiPages';
import { modalNames } from '@/utils/defaults';
import AccessError from '@/components/Configuration/AccessError';

import SaveLocallyIcon from '@/assets/interface-icons/interactive-editor-save-locally.svg';
import SaveToDiskIcon from '@/assets/interface-icons/interactive-editor-save-disk.svg';
import ExportIcon from '@/assets/interface-icons/interactive-editor-export-changes.svg';
import CancelIcon from '@/assets/interface-icons/interactive-editor-cancel-changes.svg';
import AppConfigIcon from '@/assets/interface-icons/interactive-editor-app-config.svg';
import PageInfoIcon from '@/assets/interface-icons/interactive-editor-page-info.svg';
import MultiPagesIcon from '@/assets/interface-icons/config-pages.svg';

export default {
  name: 'EditModeSaveMenu',
  mixins: [ConfigSavingMixin],
  components: {
    Button,
    EditPageInfo,
    EditAppConfig,
    EditMultiPages,
    SaveLocallyIcon,
    SaveToDiskIcon,
    ExportIcon,
    CancelIcon,
    AppConfigIcon,
    PageInfoIcon,
    MultiPagesIcon,
    AccessError,
  },
  computed: {
    config() {
      return this.$store.state.config;
    },
    permissions() {
      // Returns: { allowWriteToDisk, allowSaveLocally, allowViewConfig }
      return this.$store.getters.permissions;
    },
    showEditMsg() {
      return this.permissions.allowWriteToDisk || this.permissions.allowSaveLocally;
    },
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
    openEditMultiPages() {
      this.$modal.show(modalNames.EDIT_MULTI_PAGES);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
    },
    showToast(message, success) {
      this.$toasted.show(message, { className: `toast-${success ? 'success' : 'error'}` });
    },
    saveLocally() {
      const msg = this.$t('interactive-editor.menu.save-locally-warning');
      const youSure = confirm(msg); // eslint-disable-line no-alert, no-restricted-globals
      if (youSure) {
        this.saveConfigLocally(this.config);
      }
    },
    writeToDisk() {
      this.writeConfigToDisk(this.config);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

div.edit-mode-bottom-banner {
  position: fixed;
  display: grid;
  z-index: 5;
  bottom: 0;
  width: 100%;
  padding: 0.25rem 0;
  border-top: 2px solid var(--interactive-editor-color);
  background: var(--interactive-editor-background-darker);
  box-shadow: 0 -5px 7px var(--transparent-50);
  grid-template-columns: 45% 10% 45%;
  @include laptop-up { grid-template-columns: 50% 10% 40%; }
  @include monitor-up { grid-template-columns: 40% 30% 30%; }
  @include big-screen-up { grid-template-columns: 25% 50% 25%; }

  /* Main sections */
  .edit-banner-section {
    padding: 0.5rem;
    height: 90%;
    display: grid;
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
      .no-permission {
        margin: 0;
        width: auto;
        padding: 0 0.5rem;
      }
    }
    button {
      margin: 0.25rem;
      height: stretch;
      max-height: 3rem;
    }
    /* Button containers */
    &.edit-config-buttons-container {
      grid-template-columns: repeat(3, 1fr);
      p.section-sub-title {
        grid-column-start: span 3;
      }
    }
    &.save-buttons-container {
      grid-row-start: span 2;
      grid-template-columns: repeat(2, 1fr);
      p.section-sub-title {
        grid-column-start: span 2;
      }
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
    &:hover:not(.disallowed) {
      color: var(--interactive-editor-background);
      border-color: var(--interactive-editor-color);
      background: var(--interactive-editor-color);
    }
  }
}
</style>
