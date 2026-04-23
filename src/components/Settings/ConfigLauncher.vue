<template>
  <div class="config-options" v-click-outside="closeMenus">
    <!-- Button and label -->
    <span class="config-label">{{ $t('settings.config-launcher-label') }}</span>
    <div class="config-buttons">
      <IconSpanner @click="showEditor()" tabindex="-2"
        v-tooltip="tooltip($t('settings.config-launcher-tooltip'))" />
      <IconInteractiveEditor @click="startInteractiveEditor()" tabindex="-2"
        v-tooltip="tooltip(enterEditModeTooltip)"
        :class="(isEditMode || !isEditAllowed) ? 'disabled' : ''" />
      <IconNavLinks v-if="hasNavLinks" @click="openNavLinksMenu()" tabindex="-2"
        v-tooltip="tooltip($t('settings.nav-links-tooltip'))"
        :aria-expanded="navLinksOpen" aria-haspopup="menu" />
      <IconViewMode @click="openChangeViewMenu()" tabindex="-2"
        v-tooltip="tooltip($t('alternate-views.alternate-view-heading'))" />
      <AuthButtons :userType="userState" iconOnly />
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
    <ViewSwitcher v-if="viewSwitcherOpen" />

    <!-- Menu listing user nav links and other configs -->
    <NavLinksSwitcher v-if="navLinksOpen" @close="closeMenus" />
  </div>
</template>

<script>
// Import components, and store-key identifiers
import ConfigContainer from '@/components/Configuration/ConfigContainer';
import LanguageSwitcher from '@/components/Settings/LanguageSwitcher';
import AuthButtons from '@/components/Settings/AuthButtons';
import Keys from '@/utils/StoreMutations';
import { topLevelConfKeys, localStorageKeys, modalNames } from '@/utils/config/defaults';
import ViewSwitcher from '@/components/Settings/ViewSwitcher';
import NavLinksSwitcher from '@/components/Settings/NavLinksSwitcher.vue';
import { buildAllLinks } from '@/utils/NavLinks';
// Import icons for config launcher buttons
import IconSpanner from '@/assets/interface-icons/config-editor.svg';
import IconInteractiveEditor from '@/assets/interface-icons/interactive-editor-edit-mode.svg';
import IconViewMode from '@/assets/interface-icons/application-change-view.svg';
import IconNavLinks from '@/assets/interface-icons/config-pages.svg';

export default {
  name: 'ConfigLauncher',
  data() {
    return {
      modalNames,
      viewSwitcherOpen: false,
      navLinksOpen: false,
    };
  },
  components: {
    ConfigContainer,
    LanguageSwitcher,
    AuthButtons,
    ViewSwitcher,
    NavLinksSwitcher,
    IconSpanner,
    IconInteractiveEditor,
    IconViewMode,
    IconNavLinks,
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
    isEditAllowed() {
      return this.$store.getters.permissions.allowViewConfig;
    },
    userState() {
      return this.$store.getters.userState;
    },
    /* Tooltip text for Edit Mode button, to change depending on it in edit mode */
    enterEditModeTooltip() {
      if (!this.isEditAllowed) return 'Config editor not available';
      return this.$t(
        `interactive-editor.menu.${this.isEditMode
          ? 'edit-mode-subtitle' : 'start-editing-tooltip'}`,
      );
    },
    /* True when there's at least one nav link or visible sub-page to show */
    hasNavLinks() {
      void this.$store.state.authRevision;
      const nav = (this.pageInfo && this.pageInfo.navLinks) || [];
      return buildAllLinks(this.$store, this.$route, nav).length > 0;
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
      return { content };
    },
    openChangeViewMenu() {
      this.viewSwitcherOpen = !this.viewSwitcherOpen;
      this.navLinksOpen = false;
    },
    openNavLinksMenu() {
      this.navLinksOpen = !this.navLinksOpen;
      this.viewSwitcherOpen = false;
    },
    closeMenus() {
      this.viewSwitcherOpen = false;
      this.navLinksOpen = false;
    },
    startInteractiveEditor() {
      if (!this.isEditMode && this.isEditAllowed) {
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

</style>
