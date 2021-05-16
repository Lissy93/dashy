<template>
  <section>
    <SearchBar @user-is-searchin="userIsTypingSomething" ref="SearchBar" v-if="searchVisible" />
    <div class="options-container" v-if="settingsVisible">
      <ThemeSelector :themes="availableThemes"
        :confTheme="getInitialTheme()" :userThemes="getUserThemes()" />
      <LayoutSelector :displayLayout="displayLayout" @layoutUpdated="updateDisplayLayout"/>
      <ItemSizeSelector :iconSize="iconSize" @iconSizeUpdated="updateIconSize" />
      <ConfigEditor :sections="sections" />
    </div>
    <KeyboardShortcutInfo />
  </section>
</template>

<script>
import Defaults from '@/utils/defaults';
import SearchBar from '@/components/Settings/SearchBar';
import ConfigEditor from '@/components/Settings/ConfigEditor';
import ThemeSelector from '@/components/Settings/ThemeSelector';
import LayoutSelector from '@/components/Settings/LayoutSelector';
import ItemSizeSelector from '@/components/Settings/ItemSizeSelector';
import KeyboardShortcutInfo from '@/components/Settings/KeyboardShortcutInfo';

export default {
  name: 'FilterTile',
  props: {
    displayLayout: String,
    iconSize: String,
    availableThemes: Object,
    appConfig: Object,
    sections: Array,
  },
  components: {
    SearchBar,
    ConfigEditor,
    ThemeSelector,
    LayoutSelector,
    ItemSizeSelector,
    KeyboardShortcutInfo,
  },
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
    getInitialTheme() {
      return this.appConfig.theme || '';
    },
    /* Gets user themes if available */
    getUserThemes() {
      const userThemes = this.appConfig.cssThemes || [];
      if (typeof userThemes === 'string') return [userThemes];
      return userThemes;
    },
  },
  data() {
    return {
      searchVisible: Defaults.visibleComponents.searchBar,
      settingsVisible: Defaults.visibleComponents.settings,
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
  .options-container {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
    flex: 1;
    padding: 0.5rem 1rem;
    border-radius: var(--curve-factor-navbar) 0 0;
    background: var(--settings-background);
    div {
      margin-left: 0.5rem;
      opacity: var(--dimming-factor);
      &:hover { opacity: 1; }
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
    .options-container {
      display: none;
    }
  }

</style>
