<!-- Main homepage for default view -->
<template>
  <div class="home" :style="getBackgroundImage()">
    <!-- Search bar, layout options and settings -->
    <SettingsContainer ref="filterComp"
      @user-is-searchin="searching"
      @change-modal-visibility="updateModalVisibility"
      :displayLayout="layout"
      :iconSize="itemSizeBound"
      :externalThemes="getExternalCSSLinks()"
      :modalOpen="modalOpen"
      class="settings-outer"
    />
    <!-- Show back button, when on single-section view -->
    <div v-if="singleSectionView">
      <router-link to="/home" class="back-to-all-link">
        <BackIcon />
        <span>Back to All</span>
      </router-link>
    </div>
    <!-- Main content, section for each group of items -->
    <div v-if="checkTheresData(sections)"
      :class="`item-group-container `
        + `orientation-${layout} `
        + `item-size-${itemSizeBound} `
        + (isEditMode ? 'edit-mode ' : '')
        + (singleSectionView ? 'single-section-view ' : '')
        + (this.colCount ? `col-count-${this.colCount} ` : '')"
      >
      <template v-for="(section, index) in filteredTiles">
        <Section
          :key="index"
          :index="index"
          :title="section.name"
          :icon="section.icon || undefined"
          :displayData="getDisplayData(section)"
          :groupId="`section-${index}`"
          :items="filterTiles(section.items, searchValue)"
          :widgets="section.widgets"
          :searchTerm="searchValue"
          :itemSize="itemSizeBound"
          @itemClicked="finishedSearching()"
          @change-modal-visibility="updateModalVisibility"
          :class="
          (searchValue && filterTiles(section.items, searchValue).length === 0) ? 'no-results' : ''"
        />
      </template>
      <!-- Show add new section button, in edit mode -->
      <AddNewSection v-if="isEditMode" />
    </div>
    <!-- Show message when there's no data to show -->
    <div v-if="checkIfResults()" class="no-data">
      {{searchValue ? $t('home.no-results') : $t('home.no-data')}}
    </div>
    <!-- Show banner at bottom of screen, for Saving config changes -->
    <EditModeSaveMenu v-if="isEditMode" />
    <!-- Modal for viewing and exporting configuration file -->
    <ExportConfigMenu />
  </div>
</template>

<script>

import SettingsContainer from '@/components/Settings/SettingsContainer.vue';
import Section from '@/components/LinkItems/Section.vue';
import EditModeSaveMenu from '@/components/InteractiveEditor/EditModeSaveMenu.vue';
import ExportConfigMenu from '@/components/InteractiveEditor/ExportConfigMenu.vue';
import AddNewSection from '@/components/InteractiveEditor/AddNewSectionLauncher.vue';
import { searchTiles } from '@/utils/Search';
import StoreKeys from '@/utils/StoreMutations';
import Defaults, { localStorageKeys, iconCdns, modalNames } from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';
import BackIcon from '@/assets/interface-icons/back-arrow.svg';

export default {
  name: 'home',
  components: {
    SettingsContainer,
    EditModeSaveMenu,
    ExportConfigMenu,
    AddNewSection,
    Section,
    BackIcon,
  },
  data: () => ({
    searchValue: '',
    layout: '',
    itemSizeBound: '',
    addNewSectionOpen: false,
  }),
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
    widgets() {
      return this.$store.getters.widgets;
    },
    modalOpen() {
      return this.$store.state.modalOpen;
    },
    singleSectionView() {
      return this.findSingleSection(this.$store.getters.sections, this.$route.params.section);
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
    /* Get class for num columns, if specified by user */
    colCount() {
      let { colCount } = this.appConfig;
      if (!colCount) return null;
      if (colCount < 1) colCount = 1;
      if (colCount > 8) colCount = 8;
      return colCount;
    },
    /* Return all sections, that match users search term */
    filteredTiles() {
      const sections = this.singleSectionView || this.sections;
      return sections.filter((section) => this.filterTiles(section.items, this.searchValue));
    },
    /* Updates layout (when button clicked), and saves in local storage */
    layoutOrientation() {
      return this.$store.getters.layout;
    },
    /* Updates icon size (when button clicked), and saves in local storage */
    iconSize() {
      return this.$store.getters.iconSize;
    },
  },
  watch: {
    layoutOrientation(layout) {
      localStorage.setItem(localStorageKeys.LAYOUT_ORIENTATION, layout);
      this.layout = layout;
    },
    iconSize(size) {
      localStorage.setItem(localStorageKeys.ICON_SIZE, size);
      this.itemSizeBound = size;
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
      return searchTiles(allTiles, searchTerm) || [];
    },
    /* Returns optional section display preferences if available */
    getDisplayData(section) {
      return !section.displayData ? {} : section.displayData;
    },
    /* Update data when modal is open (so that key bindings can be disabled) */
    updateModalVisibility(modalState) {
      this.$store.commit('SET_MODAL_OPEN', modalState);
    },
    openAddNewSectionMenu() {
      this.addNewSectionOpen = true;
      this.$modal.show(modalNames.EDIT_SECTION);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    closeEditSection() {
      this.addNewSectionOpen = false;
      this.$modal.hide(modalNames.EDIT_SECTION);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
    /* If on sub-route, and section exists, then return only that section */
    findSingleSection: (allSections, sectionTitle) => {
      if (!sectionTitle) return undefined;
      let sectionToReturn;
      const parse = (section) => section.replaceAll(' ', '-').toLowerCase().trim();
      allSections.forEach((section) => {
        if (parse(sectionTitle) === parse(section.name)) {
          sectionToReturn = [section];
        }
      });
      if (!sectionToReturn) ErrorHandler(`No section named '${sectionTitle}' was found`);
      return sectionToReturn;
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
      if (!this.sections) return false;
      this.sections.forEach((section) => {
        if (section && section.items) {
          if (section.icon && section.icon.includes(prefix)) isNeeded = true;
          section.items.forEach((item) => {
            if (item.icon && item.icon.includes(prefix)) isNeeded = true;
          });
        }
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
      if (!this.sections) return false;
      else {
        let itemsFound = true;
        this.sections.forEach((section) => {
          if (section.widgets && section.widgets.length > 0) itemsFound = false;
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

.back-to-all-link {
  display: flex;
  align-items: center;
  padding: 0.25rem;
  margin: 0.25rem;
  @extend .svg-button;
  svg { margin-right: 0.5rem; }
  text-decoration: none;
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
  &.orientation-horizontal, &.orientation-vertical, &.single-section-view {
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

  /* Additional spacing when in edit mode */
  &.edit-mode {
    margin-bottom: 12rem;
  }

  /* When in single-section view mode */
  &.single-section-view {
    display: block;
  }
  .add-new-section {
    border: 2px dashed var(--primary);
    border-radius: var(--curve-factor);
    padding: var(--item-group-padding);
    background: var(--item-group-background);
    color: var(--primary);
    font-size: 1.2rem;
    cursor: pointer;
    text-align: center;
    height: fit-content;
    margin: 10px;
  }
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
