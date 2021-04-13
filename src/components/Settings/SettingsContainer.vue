<template>
  <section>
    <SearchBar @user-is-searchin="userIsTypingSomething" ref="SearchBar" />
    <div class="options-container">
      <ThemeSelector class="theme-selector" :themes="availableThemes" />
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
    padding: 0 1rem;
    border-radius: 20px 0 0;
    background: var(--background);
    div {
      opacity: 0.85;
      &:hover { opacity: 1; }
    }
  }

  @media screen and (max-width: 600px) {
    .options-container {
      display: none;
    }
  }
</style>
