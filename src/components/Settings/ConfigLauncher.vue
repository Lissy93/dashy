<template>
  <div class="config-options" v-click-outside="closeViewSwitcher">
    <!-- Button and label -->
    <span class="config-label">{{ $t('settings.config-launcher-label') }}</span>
    <div class="config-buttons">
      <IconSpanner @click="showEditor()" tabindex="-2"
        v-tooltip="tooltip($t('settings.config-launcher-tooltip'))" />
      <IconInteractiveEditor @click="startInteractiveEditor()" tabindex="-2"
        v-tooltip="tooltip(enterEditModeTooltip)"
        :class="isEditMode ? 'disabled' : ''" />
      <IconViewMode @click="openChangeViewMenu()" tabindex="-2"
        v-tooltip="tooltip($t('alternate-views.alternate-view-heading'))" />
    </div>

    <!-- Modal containing all the configuration options -->
    <modal :name="modalNames.CONF_EDITOR" :resizable="true" width="60%" height="85%"
      @closed="editorClosed" classes="dashy-modal">
      <ConfigContainer :config="combineConfig()" />
    </modal>

    <!-- Modal for manually changing locale -->
    <modal :name="modalNames.LANG_SWITCHER" classes="dashy-modal"
      :resizable="true" width="35%" height="60%">
      <LanguageSwitcher />
    </modal>

    <!-- Menu for switching view -->
    <div v-if="viewSwitcherOpen" class="view-switcher">
      <ul>
        <li>
          <router-link to="/home">
            <IconHome /><span>{{ $t('alternate-views.default') }}</span>
          </router-link>
        </li>
        <li>
          <router-link to="/minimal">
            <IconMinimalView /><span>{{ $t('alternate-views.minimal') }}</span>
          </router-link>
        <li>
          <router-link to="/workspace">
            <IconWorkspaceView /><span>{{ $t('alternate-views.workspace') }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import ConfigContainer from '@/components/Configuration/ConfigContainer';
import LanguageSwitcher from '@/components/Settings/LanguageSwitcher';
import { topLevelConfKeys, localStorageKeys, modalNames } from '@/utils/defaults';
import Keys from '@/utils/StoreMutations';
import IconSpanner from '@/assets/interface-icons/config-editor.svg';
import IconInteractiveEditor from '@/assets/interface-icons/interactive-editor-start-editing.svg';
import IconViewMode from '@/assets/interface-icons/application-change-view.svg';
import IconHome from '@/assets/interface-icons/application-home.svg';
import IconWorkspaceView from '@/assets/interface-icons/open-workspace.svg';
import IconMinimalView from '@/assets/interface-icons/application-minimal.svg';

export default {
  name: 'ConfigLauncher',
  data() {
    return {
      modalNames,
      viewSwitcherOpen: false,
    };
  },
  components: {
    ConfigContainer,
    LanguageSwitcher,
    IconSpanner,
    IconInteractiveEditor,
    IconViewMode,
    IconHome,
    IconWorkspaceView,
    IconMinimalView,
  },
  computed: {
    sections() {
      return this.$store.getters.sections;
    },
    appConfig() {
      return this.$store.getters.appConfig;
    },
    pageInfo() {
      return this.$store.getters.pageInfo;
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
    enterEditModeTooltip() {
      // Change tooltip text for 'Enter Edit Mode' button, when already in Edit Mode
      return this.$t(
        `interactive-editor.${this.isEditMode ? 'edit-mode-subtitle' : 'start-editing-tooltip'}`,
      );
    },
  },
  methods: {
    showEditor: function show() {
      this.$modal.show(modalNames.CONF_EDITOR);
      this.$store.commit(Keys.SET_MODAL_OPEN, true);
    },
    editorClosed: function show() {
      this.$store.commit(Keys.SET_MODAL_OPEN, false);
    },
    combineConfig() {
      const conf = {};
      conf[topLevelConfKeys.APP_CONFIG] = this.appConfig;
      conf[topLevelConfKeys.PAGE_INFO] = this.pageInfo;
      conf[topLevelConfKeys.SECTIONS] = this.sections;
      conf[topLevelConfKeys.APP_CONFIG].theme = localStorage[localStorageKeys.THEME]
        || conf[topLevelConfKeys.APP_CONFIG].theme;
      return conf;
    },
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
    },
    openChangeViewMenu() {
      this.viewSwitcherOpen = !this.viewSwitcherOpen;
    },
    closeViewSwitcher() {
      this.viewSwitcherOpen = false;
    },
    startInteractiveEditor() {
      if (!this.isEditMode) {
        this.$store.commit(Keys.SET_EDIT_MODE, true);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/style-helpers.scss';

.config-options {
  @extend .svg-button;
  display: flex;
  flex-direction: column;
  color: var(--settings-text-color);
  min-width: 3.2rem;
}

.view-switcher {
  position: absolute;
  right: 1rem;
  margin-top: 3rem;
  z-index: 5;
  background: var(--background);
  border: 1px solid var(--settings-text-color);
  border-radius: var(--curve-factor);
  box-shadow: var(--settings-container-shadow);
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      cursor: pointer;
      padding: 0.25rem 0.75rem;
      a {
        color: var(--settings-text-color);
        text-decoration: none;
        display: flex;
        align-items: center;
      }
      &:hover {
        background: var(--settings-text-color);
        a { color: var(--background); }
      }
      svg {
        margin: 0 0.25rem 0 0;
        border: none;
      }
    }
  }
}
</style>
