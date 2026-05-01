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

    <!-- Open Modal Buttons -->
    <div class="edit-banner-section edit-config-buttons-container">
      <p class="section-sub-title">
        {{ $t('interactive-editor.menu.edit-site-data-subheading') }}
      </p>
      <!-- Button to open the config modal strait to YAML editor mode -->
      <Button
        class="edit-config-file-btn"
        :click="openEditConfigAsCode"
        :disallow="!permissions.allowSaveLocally"
        v-tooltip="tooltip($t('interactive-editor.menu.edit-config-as-code-tooltip'))"
      >
        {{ $t('interactive-editor.menu.edit-config-as-code-btn') }}
        <ConfigFileIcon />
      </Button>
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
      <!-- Button to open pages editor (only if not on sub-page rn) -->
      <Button
        :click="openEditMultiPages"
        :disallow="!permissions.allowViewConfig || isSubConfig"
        v-tooltip="tooltip($t(isSubConfig
          ? 'interactive-editor.menu.edit-pages-subconfig-disabled'
          : 'interactive-editor.menu.edit-pages-tooltip'))"
      >
        {{ $t('interactive-editor.menu.edit-pages-btn') }}
        <MultiPagesIcon />
      </Button>
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

    <!-- Modals for editing appConfig, pageInfo and pages -->
    <EditPageInfo />
    <EditAppConfig />
    <EditMultiPages />
    <ConfirmDialog
      v-model:open="showSaveLocallyConfirm"
      :title="$t('interactive-editor.menu.save-locally-btn')"
      :message="$t('interactive-editor.menu.save-locally-warning')"
      @confirm="confirmSaveLocally"
    />
  </div>
</template>

<script>
import ConfigSavingMixin from '@/mixins/ConfigSaving';
import Button from '@/components/FormElements/Button';
import ConfirmDialog from '@/components/FormElements/ConfirmDialog';
import StoreKeys from '@/utils/StoreMutations';
import EditPageInfo from '@/components/InteractiveEditor/EditPageInfo';
import EditAppConfig from '@/components/InteractiveEditor/EditAppConfig';
import EditMultiPages from '@/components/InteractiveEditor/EditMultiPages';
import { modalNames } from '@/utils/config/defaults';
import AccessError from '@/components/Configuration/AccessError';
import SaveLocallyIcon from '@/assets/interface-icons/interactive-editor-save-locally.svg';
import SaveToDiskIcon from '@/assets/interface-icons/interactive-editor-save-disk.svg';
import ExportIcon from '@/assets/interface-icons/interactive-editor-export-changes.svg';
import CancelIcon from '@/assets/interface-icons/interactive-editor-cancel-changes.svg';
import AppConfigIcon from '@/assets/interface-icons/interactive-editor-app-config.svg';
import PageInfoIcon from '@/assets/interface-icons/interactive-editor-page-info.svg';
import MultiPagesIcon from '@/assets/interface-icons/config-pages.svg';
import ConfigFileIcon from '@/assets/interface-icons/config-file.svg';

export default {
  name: 'EditModeSaveMenu',
  mixins: [ConfigSavingMixin],
  components: {
    Button,
    ConfirmDialog,
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
    ConfigFileIcon,
    AccessError,
  },
  data() {
    return {
      showSaveLocallyConfirm: false,
    };
  },
  computed: {
    configToSave() {
      return this.$store.state.configSource;
    },
    permissions() {
      // Returns: { allowWriteToDisk, allowSaveLocally, allowViewConfig }
      return this.$store.getters.permissions;
    },
    showEditMsg() {
      return this.permissions.allowWriteToDisk || this.permissions.allowSaveLocally;
    },
    isSubConfig() {
      return this.$store.getters.isSubConfig;
    },
  },
  methods: {
    reset() {
      this.$store.dispatch(StoreKeys.INITIALIZE_CONFIG, this.$store.state.currentConfigInfo.confId);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
    },
    openExportConfigMenu() {
      this.$store.commit(StoreKeys.CONF_MENU_INDEX, 2);
      this.$modal.show(modalNames.CONF_EDITOR);
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
    openEditConfigAsCode() {
      this.$store.commit(StoreKeys.CONF_MENU_INDEX, 1);
      this.$modal.show(modalNames.CONF_EDITOR);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    tooltip(content) {
      return { content };
    },
    showToast(message, success) {
      this.$toast[success ? 'success' : 'error'](message);
    },
    saveLocally() {
      this.showSaveLocallyConfirm = true;
    },
    confirmSaveLocally() {
      this.saveConfigLocally(this.configToSave);
    },
    writeToDisk() {
      this.writeConfigToDisk(this.configToSave);
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
  grid-template-columns: 50% 0% 50%;

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
      grid-column: 1/-1;
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
      /* Drop the intro copy when vertical space is tight */
      @include short {
        display: none;
      }
    }
    button {
      margin: 0.25rem;
      height: stretch;
      max-height: 3rem;
    }
    /* Button containers */
    &.edit-config-buttons-container {

      grid-template-columns: repeat(2, 1fr);
      @include laptop-up { grid-template-columns: repeat(3, 1fr); }
      p.section-sub-title {
        grid-column: 1/-1;
      }
      .edit-config-file-btn {
        @include laptop-up { grid-column: 1/-1; }
        svg { width: 1.4rem; height: 1.4rem; }
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
    .edit-banner-section {
      max-width: 90%;
      width: 100%;
      margin: 0.2rem auto;

      &.empty-space { display: none; }

      &.save-buttons-container,
      &.edit-config-buttons-container {
        grid-template-columns: repeat(2, 1fr);
        p.section-sub-title { grid-column: 1 / -1; }
        @include very-tiny-phone { grid-template-columns: 1fr; }
      }
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
    svg {
      width: 1rem;
      height: 1rem;
      margin: 0 0 -0.15rem 0.25rem;
    }
  }
}
</style>
