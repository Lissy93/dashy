<template>
  <!-- Intro Info -->
  <div class="edit-mode-bottom-banner">
    <div class="edit-banner-section intro-container">
      <p class="section-sub-title edit-mode-intro l-1">
        {{ $t('interactive-editor.edit-mode-subtitle') }}
      </p>
      <p class="edit-mode-intro l-2">
        {{ $t('interactive-editor.edit-mode-description') }}
      </p>
    </div>
    <div class="edit-banner-section empty-space"></div>
    <!-- Save Buttons -->
    <div class="edit-banner-section save-buttons-container">
      <p class="section-sub-title">Config Saving Options</p>
      <Button
        v-tooltip="tooltip($t('interactive-editor.export-config-tooltip'))"
      >
        {{ $t('interactive-editor.export-config-btn') }}
        <ExportIcon />
      </Button>
      <Button
        :click="reset"
        v-tooltip="tooltip($t('interactive-editor.cancel-changes-tooltip'))"
      >
        {{ $t('interactive-editor.cancel-changes-btn') }}
        <CancelIcon />
      </Button>
      <Button
        v-tooltip="tooltip($t('interactive-editor.save-locally-tooltip'))"
      >
        {{ $t('interactive-editor.save-locally-btn') }}
        <SaveLocallyIcon />
      </Button>
      <Button
        v-tooltip="tooltip($t('interactive-editor.save-disk-tooltip'))"
      >
        {{ $t('interactive-editor.save-disk-btn') }}
        <SaveToDiskIcon />
      </Button>
    </div>
    <!-- Open Modal Buttons -->
    <div class="edit-banner-section edit-site-config-buttons">
      <p class="section-sub-title">Edit Site Data</p>
      <Button
        v-tooltip="tooltip($t('interactive-editor.edit-page-info-tooltip'))"
      >
        {{ $t('interactive-editor.edit-page-info-btn') }}
        <PageInfoIcon />
      </Button>
      <Button
        v-tooltip="tooltip($t('interactive-editor.edit-app-config-tooltip'))"
      >
        {{ $t('interactive-editor.edit-app-config-btn') }}
        <AppConfigIcon />
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/FormElements/Button';
import StoreKeys from '@/utils/StoreMutations';

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
    SaveLocallyIcon,
    SaveToDiskIcon,
    ExportIcon,
    CancelIcon,
    AppConfigIcon,
    PageInfoIcon,
  },
  methods: {
    reset() {
      this.$store.dispatch(StoreKeys.INITIALIZE_CONFIG);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
    },
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
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
}
</style>
