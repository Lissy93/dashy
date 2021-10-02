<!-- Main homepage for default view -->
<template>
  <div class="home" :style="getBackgroundImage()">
    <!-- Search bar, layout options and settings -->
    <SettingsContainer ref="filterComp"
      @user-is-searchin="searching"
      @change-display-layout="setLayoutOrientation"
      @change-icon-size="setItemSize"
      @change-modal-visibility="updateModalVisibility"
      :displayLayout="layout"
      :iconSize="itemSizeBound"
      :externalThemes="getExternalCSSLinks()"
      :sections="allSections"
      :appConfig="appConfig"
      :pageInfo="pageInfo"
      :modalOpen="modalOpen"
      class="settings-outer"
    />
    <!-- Main content, section for each group of items -->
    <div v-if="checkTheresData(sections)"
      :class="`item-group-container `
        + `orientation-${layout} `
        + `item-size-${itemSizeBound} `
        + (this.colCount ? `col-count-${this.colCount} ` : '')"
      >
      <Section
        v-for="(section, index) in filteredTiles"
        :key="index"
        :title="section.name"
        :icon="section.icon || undefined"
        :displayData="getDisplayData(section)"
        :groupId="`section-${index}`"
        :items="filterTiles(section.items, searchValue)"
        :searchTerm="searchValue"
        :itemSize="itemSizeBound"
        @itemClicked="finishedSearching()"
        @change-modal-visibility="updateModalVisibility"
        :class="
        (searchValue && filterTiles(section.items, searchValue).length === 0) ? 'no-results' : ''"
      />
    </div>
    <!-- Show message when there's no data to show -->
    <div v-if="checkIfResults()" class="no-data">
      {{searchValue ? $t('home.no-results') : $t('home.no-data')}}
    </div>
  </div>
</template>

<script>

import SettingsContainer from '@/components/Settings/SettingsContainer.vue';
import Section from '@/components/LinkItems/Section.vue';
import { searchTiles } from '@/utils/Search';
import Defaults, { localStorageKeys, iconCdns } from '@/utils/defaults';

export default {
  name: 'home',
  props: {
    sections: Array, // Main site content
    appConfig: Object, // Main site configuation (optional)
    pageInfo: Object, // Page metadata (optional)
  },
  components: {
    SettingsContainer,
    Section,
  },
  data: () => ({
    searchValue: '',
    layout: '',
    itemSizeBound: '',
    modalOpen: false, // When true, keybindings are disabled
  }),
  computed: {
    /* Get class for num columns, if specified by user */
    colCount() {
      let { colCount } = this.appConfig;
      if (!colCount) return null;
      if (colCount < 1) colCount = 1;
      if (colCount > 8) colCount = 8;
      return colCount;
    },
    /* Combines sections from config file, with those in local storage */
    allSections() {
      // If the user has stored sections in local storage, return those
      const localSections = localStorage[localStorageKeys.CONF_SECTIONS];
      if (localSections) {
        const json = JSON.parse(localSections);
        if (json.length >= 1) return json;
      }
      // Otherwise, return the usuall data from conf.yml
      return this.sections;
    },
    filteredTiles() {
      const sections = this.allSections;
      return sections.filter((section) => this.filterTiles(section.items, this.searchValue));
    },
    /* Updates layout (when button clicked), and saves in local storage */
    layoutOrientation: {
      get() { return this.appConfig.layout || Defaults.layout; },
      set: function setLayout(layout) {
        localStorage.setItem(localStorageKeys.LAYOUT_ORIENTATION, layout);
        this.layout = layout;
      },
    },
    /* Updates icon size (when button clicked), and saves in local storage */
    iconSize: {
      get() { return this.appConfig.iconSize || Defaults.iconSize; },
      set: function setIconSize(iconSize) {
        localStorage.setItem(localStorageKeys.ICON_SIZE, iconSize);
        this.itemSizeBound = iconSize;
      },
    },
  },
  methods: {
    /* Returns true if there is one or more sections in the config */
    checkTheresData(sections) {
      const localSections = localStorage[localStorageKeys.CONF_SECTIONS];
      return (sections && sections.length >= 1) || (localSections && localSections.length >= 1);
    },
    /* Updates local data with search value, triggered from filter comp */
    searching(searchValue) {
      this.searchValue = searchValue || '';
    },
    /* Clears input field, once a searched item is opened */
    finishedSearching() {
      this.$refs.filterComp.clearFilterInput();
    },
    /* Returns only the tiles that match the users search query */
    filterTiles(allTiles, searchTerm) {
      return searchTiles(allTiles, searchTerm);
    },
    /* Returns optional section display preferences if available */
    getDisplayData(section) {
      return !section.displayData ? {} : section.displayData;
    },
    /* Sets layout attribute, which is used by Section */
    setLayoutOrientation(layout) {
      this.layoutOrientation = layout;
    },
    /* Sets item size attribute, which is used by Section */
    setItemSize(itemSize) {
      this.iconSize = itemSize;
    },
    /* Update data when modal is open (so that key bindings can be disabled) */
    updateModalVisibility(modalState) {
      this.modalOpen = modalState;
    },
    /* Returns an array of links to external CSS from the Config */
    getExternalCSSLinks() {
      const availibleThemes = {};
      if (this.appConfig) {
        if (this.appConfig.externalStyleSheet) {
          const externals = this.appConfig.externalStyleSheet;
          if (Array.isArray(externals)) {
            externals.forEach((ext, i) => {
              availibleThemes[`External Stylesheet ${i + 1}`] = ext;
            });
          } else {
            availibleThemes['External Stylesheet'] = this.appConfig.externalStyleSheet;
          }
        }
      }
      availibleThemes.Default = '#';
      return availibleThemes;
    },
    /* Checks if any sections or items use icons from a given CDN */
    checkIfIconLibraryNeeded(prefix) {
      let isNeeded = false;
      if (!this.allSections) return false;
      this.allSections.forEach((section) => {
        if (section.icon && section.icon.includes(prefix)) isNeeded = true;
        section.items.forEach((item) => {
          if (item.icon && item.icon.includes(prefix)) isNeeded = true;
        });
      });
      return isNeeded;
    },
    /* Checks if any of the icons are Font Awesome glyphs */
    checkIfFontAwesomeNeeded() {
      let isNeeded = this.checkIfIconLibraryNeeded('fa-');
      const currentTheme = localStorage[localStorageKeys.THEME]; // Some themes require FA
      if (['material', 'material-dark'].includes(currentTheme)) isNeeded = true;
      return isNeeded;
    },
    /* Injects font-awesome's script tag, only if needed */
    initiateFontAwesome() {
      if (this.appConfig.enableFontAwesome || this.checkIfFontAwesomeNeeded()) {
        const fontAwesomeScript = document.createElement('script');
        const faKey = this.appConfig.fontAwesomeKey || Defaults.fontAwesomeKey;
        fontAwesomeScript.setAttribute('src', `${iconCdns.fa}/${faKey}.js`);
        document.head.appendChild(fontAwesomeScript);
      }
    },
    /* Checks if any of the icons are Material Design Icons */
    checkIfMdiNeeded() {
      return this.checkIfIconLibraryNeeded('mdi-');
    },
    /* Injects Material Design Icons, only if needed */
    initiateMaterialDesignIcons() {
      if (this.checkIfMdiNeeded()) {
        const mdiStylesheet = document.createElement('link');
        mdiStylesheet.setAttribute('rel', 'stylesheet');
        mdiStylesheet.setAttribute('href', iconCdns.mdi);
        document.head.appendChild(mdiStylesheet);
      }
    },
    /* Returns true if there is more than 1 sub-result visible during searching */
    checkIfResults() {
      if (!this.allSections) return false;
      else {
        let itemsFound = true;
        this.allSections.forEach((section) => {
          if (this.filterTiles(section.items, this.searchValue).length > 0) itemsFound = false;
        });
        return itemsFound;
      }
    },
    /* If user has a background image, then generate CSS attributes */
    getBackgroundImage() {
      if (this.appConfig && this.appConfig.backgroundImg) {
        return `background: url('${this.appConfig.backgroundImg}');background-size:cover;`;
      }
      return '';
    },
  },
  mounted() {
    this.initiateFontAwesome();
    this.initiateMaterialDesignIcons();
    this.layout = this.layoutOrientation;
    this.itemSizeBound = this.iconSize;
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

.home {
  padding-bottom: 1px;
  background: var(--background);
  min-height: calc(99.9vh - var(--footer-height));
}

/* Outside container wrapping the item groups*/
.item-group-container {
  display: grid;
  gap: 0.5rem;
  margin: 0 auto;
  max-width: 90%;
  overflow: auto;
  @extend .scroll-bar;
  @include monitor-up {
    max-width: 1400px;
  }

  /* Options for alternate layouts, triggered by buttons */
  &.orientation-horizontal {
    display: flex;
    flex-direction: column;
  }
  &.orientation-vertical {
    max-width: 100%;
    @include tablet-up {
      display: flex;
      flex-direction: row;
    }
  }
  &.orientation-horizontal, &.orientation-vertical {
    @include phone { --content-max-width: 100%; }
    @include tablet { --content-max-width: 98%; }
    @include laptop { --content-max-width: 90%; }
    @include monitor { --content-max-width: 85%; }
    @include big-screen { --content-max-width: 80%; }
    @include big-screen-up { --content-max-width: 60%; }
    max-width: var(--content-max-width, 90%);
  }

  /* Specify number of columns, based on screen size or user preference */
  @include phone { --col-count: 1; }
  @include tablet { --col-count: 2; }
  @include laptop { --col-count: 2; }
  @include monitor { --col-count: 3; }
  @include big-screen { --col-count: 4; }
  @include big-screen-up { --col-count: 5; }

  @include tablet-up {
    &.col-count-1 { --col-count: 1; }
    &.col-count-2 { --col-count: 2; }
    &.col-count-3 { --col-count: 3; }
    &.col-count-4 { --col-count: 4; }
    &.col-count-5 { --col-count: 5; }
    &.col-count-6 { --col-count: 6; }
    &.col-count-7 { --col-count: 7; }
    &.col-count-8 { --col-count: 8; }
  }

  grid-template-columns: repeat(var(--col-count, 2), minmax(0, 1fr));

  /* Hide when search term returns nothing */
  .no-results { display: none; }
}

/* Custom styles only applied when there is no sections in config */
.no-data {
    font-size: 2rem;
    color: var(--background);
    background: #ffffffeb;
    width: fit-content;
    margin: 2rem auto;
    padding: 0.5rem 1rem;
    border-radius: var(--curve-factor);
}

/* Settings section, includes search, config and user settings */
section.settings-outer {
  border-bottom: 1px solid var(--outline-color);
  @include phone {
    flex-direction: column;
  }
}

</style>
