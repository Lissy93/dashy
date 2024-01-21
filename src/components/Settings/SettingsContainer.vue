<template>
  <section v-bind:class="{ 'settings-hidden': !settingsVisible }">
    <SearchBar ref="SearchBar"
      @user-is-searchin="userIsTypingSomething"
      v-if="searchVisible"
    />
    <div class="options-outer">
      <div :class="`options-container ${!settingsVisible ? 'hide' : ''}`">
        <ThemeSelector />
        <LayoutSelector :displayLayout="displayLayout" />
        <ItemSizeSelector :iconSize="iconSize" />
        <ConfigLauncher />
        <AuthButtons  v-if="userState !== 0" :userType="userState" />
      </div>
      <div :class="`show-hide-container ${settingsVisible? 'hide-btn' : 'show-btn'}`">
        <button @click="toggleSettingsVisibility()"
          v-tooltip="`${settingsVisible? 'Hide' : 'Open'} Settings Menu`" tabindex="-2">
          <IconClose v-if="settingsVisible" />
          <IconOpen v-else />
        </button>
      </div>
    </div>
    <AppInfoModal />
  </section>
</template>

<script>
import SearchBar from '@/components/Settings/SearchBar';
import ConfigLauncher from '@/components/Settings/ConfigLauncher';
import ThemeSelector from '@/components/Settings/ThemeSelector';
import LayoutSelector from '@/components/Settings/LayoutSelector';
import ItemSizeSelector from '@/components/Settings/ItemSizeSelector';
import AuthButtons from '@/components/Settings/AuthButtons';
import AppInfoModal from '@/components/Configuration/AppInfoModal';
import IconOpen from '@/assets/interface-icons/config-open-settings.svg';
import IconClose from '@/assets/interface-icons/config-close.svg';
import {
  localStorageKeys,
  visibleComponents as defaultVisibleComponents,
} from '@/utils/defaults';

import { getUserState } from '@/utils/Auth';

export default {
  name: 'SettingsContainer',
  props: {
    displayLayout: String,
    iconSize: String,
    externalThemes: Object,
  },
  components: {
    SearchBar,
    ConfigLauncher,
    ThemeSelector,
    LayoutSelector,
    ItemSizeSelector,
    AuthButtons,
    AppInfoModal,
    IconOpen,
    IconClose,
  },
  data() {
    return {
      settingsVisible: true,
    };
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
    /**
    * Determines which button should display, based on the user type
    * 0 = Auth not configured, don't show anything
    * 1 = Auth configured, and user logged in, show logout button
    * 2 = Auth configured, guest access enabled, and not logged in, show login
    * Note that if auth is enabled, but not guest access, and user not logged in,
    * then they will never be able to view the homepage, so no button needed
    */
    userState() {
      return getUserState();
    },
    /* Object indicating which components should be hidden, based on user preferences */
    visibleComponents() {
      return this.$store.getters.visibleComponents;
    },
    searchVisible() {
      return this.$store.getters.visibleComponents.searchBar;
    },
  },
  mounted() {
    this.settingsVisible = this.getSettingsVisibility();
  },
  methods: {
    /* Emit event to begin/ continue searching */
    userIsTypingSomething(something) {
      this.$emit('user-is-searchin', something);
    },
    /* Call function to clear search field, remove focus and reset results */
    clearFilterInput() {
      if (this.$refs.SearchBar) this.$refs.SearchBar.clearFilterInput();
    },
    getInitialTheme() {
      return this.appConfig.theme || '';
    },
    /* Gets user themes if available */
    getUserThemes() {
      const userThemes = this.appConfig.cssThemes || [];
      if (typeof userThemes === 'string') return [userThemes];
      return userThemes;
    },
    /* Show / hide settings */
    toggleSettingsVisibility() {
      this.settingsVisible = !this.settingsVisible;
      localStorage.setItem(localStorageKeys.HIDE_SETTINGS, this.settingsVisible);
    },
    /* Get initial settings visibility, either from appConfig, local storage or browser type */
    getSettingsVisibility() {
      const screenWidth = document.body.clientWidth;
      if (screenWidth && screenWidth < 600) return false;
      if ((this.visibleComponents || {}).settings === false) return false;
      if (localStorage[localStorageKeys.HIDE_SETTINGS] === 'false') return false;
      return defaultVisibleComponents.settings;
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  section {
    display: flex;
    align-items: center;
    align-items: stretch;
    background: linear-gradient(0deg, var(--background) 0%, var(--background-darker) 100%);
    box-shadow: var(--settings-container-shadow);
  }
  .options-outer {
    display: flex;
    position: relative;
    flex: 1;
    background: var(--settings-background);
    border-radius: var(--curve-factor-navbar);
  }
  .options-container {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
    flex: 1;
    padding: 0.5rem 1.5rem 0.5rem 1rem;
    border-radius: var(--curve-factor-navbar) 0 0;
    background: var(--settings-background);
    div {
      margin-left: 0.5rem;
      opacity: var(--dimming-factor);
      opacity: 1;
      &:hover { opacity: 1; }
    }
    &.hide {
      display: none;
    }
    @include very-tiny-phone {
      flex-direction: column;
      align-items: baseline;
      div {
        width: 100%;
        text-align: center;
        .theme-selector-section { justify-content: center; }
      }
    }
  }

  .show-hide-container {
    display: flex;
    // align-items: center;
    background: var(--settings-background);
    color: var(--settings-text-color);
    width: 1.5rem;
    position: absolute;
    top: 4px;
    right: 4px;
    &.show-btn {
      width: 2rem;
      top: 0.5rem;
      right: 0.5rem;
      @include phone {
        top: -3rem !important;
      }
    }
    button {
      width: 100%;
      padding: 2px 2px 0 2px;
      margin: 2px;
      border-radius: var(--curve-factor);
      height: fit-content;
      background: none;
      border: none;
      color: var(--settings-text-color);
      cursor: pointer;
      opacity: var(--dimming-factor);
    }
    &:hover button {
      background: var(--settings-text-color);
      color: var(--settings-background);
    }
  }

  @include tablet {
    section {
      display: block;
      margin: 0 auto;
      background: none;
      .options-container {
          justify-content: center;
      }
    }
  }

  @include phone {
    .options-container, .show-hide-button {
      // display: none;
    }
  }

</style>
