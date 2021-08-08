<template>
  <section>
    <SearchBar ref="SearchBar"
      @user-is-searchin="userIsTypingSomething"
      v-if="searchVisible"
      :active="!modalOpen"
    />
    <div class="options-outer">
      <div :class="`options-container ${!settingsVisible ? 'hide' : ''}`">
        <ThemeSelector :externalThemes="externalThemes" @modalChanged="modalChanged"
          :confTheme="getInitialTheme()" :userThemes="getUserThemes()" />
        <LayoutSelector :displayLayout="displayLayout" @layoutUpdated="updateDisplayLayout"/>
        <ItemSizeSelector :iconSize="iconSize" @iconSizeUpdated="updateIconSize" />
        <ConfigLauncher :sections="sections" :pageInfo="pageInfo" :appConfig="appConfig"
          @modalChanged="modalChanged" />
        <AppButtons  v-if="isUserLoggedIn()" />
      </div>
      <div :class="`show-hide-container ${settingsVisible? 'hide-btn' : 'show-btn'}`">
        <button @click="toggleSettingsVisibility()"
          v-tooltip="`${settingsVisible? 'Hide' : 'Open'} Settings Menu`" tabindex="-2">
          <IconClose v-if="settingsVisible" />
          <IconOpen v-else />
        </button>
      </div>
    </div>
    <KeyboardShortcutInfo />
    <AppInfoModal />
  </section>
</template>

<script>
import SearchBar from '@/components/Settings/SearchBar';
import ConfigLauncher from '@/components/Settings/ConfigLauncher';
import ThemeSelector from '@/components/Settings/ThemeSelector';
import LayoutSelector from '@/components/Settings/LayoutSelector';
import ItemSizeSelector from '@/components/Settings/ItemSizeSelector';
import AppButtons from '@/components/Settings/AppButtons';
import KeyboardShortcutInfo from '@/components/Settings/KeyboardShortcutInfo';
import AppInfoModal from '@/components/Configuration/AppInfoModal';
import IconOpen from '@/assets/interface-icons/config-open-settings.svg';
import IconClose from '@/assets/interface-icons/config-close.svg';
import {
  localStorageKeys,
  visibleComponents as defaultVisibleComponents,
} from '@/utils/defaults';

export default {
  name: 'SettingsContainer',
  props: {
    displayLayout: String,
    iconSize: String,
    externalThemes: Object,
    appConfig: Object,
    pageInfo: Object,
    sections: Array,
    modalOpen: Boolean,
  },
  components: {
    SearchBar,
    ConfigLauncher,
    ThemeSelector,
    LayoutSelector,
    ItemSizeSelector,
    AppButtons,
    KeyboardShortcutInfo,
    AppInfoModal,
    IconOpen,
    IconClose,
  },
  inject: ['visibleComponents'],
  methods: {
    userIsTypingSomething(something) {
      this.$emit('user-is-searchin', something);
    },
    clearFilterInput() {
      this.$refs.SearchBar.clearFilterInput();
    },
    updateDisplayLayout(layout) {
      this.$emit('change-display-layout', layout);
    },
    updateIconSize(iconSize) {
      this.$emit('change-icon-size', iconSize);
    },
    modalChanged(changedTo) {
      this.$emit('change-modal-visibility', changedTo);
    },
    getInitialTheme() {
      return this.appConfig.theme || '';
    },
    isUserLoggedIn() {
      return !!localStorage[localStorageKeys.USERNAME];
    },
    /* Gets user themes if available */
    getUserThemes() {
      const userThemes = this.appConfig.cssThemes || [];
      if (typeof userThemes === 'string') return [userThemes];
      return userThemes;
    },
    toggleSettingsVisibility() {
      this.settingsVisible = !this.settingsVisible;
      localStorage.setItem(localStorageKeys.HIDE_SETTINGS, this.settingsVisible);
    },
    getSettingsVisibility() {
      return JSON.parse(localStorage[localStorageKeys.HIDE_SETTINGS]
        || (this.visibleComponents || defaultVisibleComponents).settings);
    },
  },
  data() {
    return {
      settingsVisible: this.getSettingsVisibility(),
      searchVisible: (this.visibleComponents || defaultVisibleComponents).searchBar,
    };
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
