<template>
  <section>
    <SearchBar @user-is-searchin="userIsTypingSomething" ref="SearchBar" />
    <div class="options-container">
      <ThemeSelector :themes="availableThemes" :confTheme="getInitialTheme()"/>
      <LayoutSelector :displayLayout="displayLayout" @layoutUpdated="updateDisplayLayout"/>
      <ItemSizeSelector :iconSize="iconSize" @iconSizeUpdated="updateIconSize" />
    </div>
    <KeyboardShortcutInfo />
  </section>
</template>

<script>
import SearchBar from '@/components/Settings/SearchBar';
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
  },
  components: {
    SearchBar,
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
  },
};
</script>

<style scoped lang="scss">

  section {
    display: flex;
    align-items: center;
    align-items: stretch;
    background: linear-gradient(0deg, var(--background) 0%, var(--background-darker) 100%);
  }
  .options-container {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-end;
    flex: 1;
    padding: 0.5rem 1rem;
    border-radius: var(--curve-factor-navbar) 0 0;
    background: var(--background);
    div {
      margin-left: 0.5rem;
      opacity: var(--dimming-factor);
      &:hover { opacity: 1; }
    }
  }

  @media screen and (max-width: 600px) {
    .options-container {
      display: none;
    }
  }
</style>
