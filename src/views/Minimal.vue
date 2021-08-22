<template>
  <div class="minimal-home" :style="getBackgroundImage() + setColumnCount()">
    <!-- Buttons for config and home page -->
    <div class="minimal-buttons">
      <ConfigLauncher :sections="sections" :pageInfo="pageInfo" :appConfig="appConfig"
        @modalChanged="modalChanged" class="config-launcher" />
    </div>
    <!-- Page title and search bar -->
    <div class="title-and-search">
      <router-link to="/">
        <h1>{{ pageInfo.title }}</h1>
      </router-link>
      <MinimalSearch @user-is-searchin="(s) => { this.searchValue = s; }" :active="!modalOpen" />
    </div>
    <div v-if="checkTheresData(sections)"
      :class="`item-group-container ${!tabbedView ? 'showing-all' : ''}`">
      <!-- Section heading buttons -->
      <MinimalHeading
        v-for="(section, index) in getSections(sections)"
        :key="`heading-${index}`"
        :index="index"
        :title="section.name"
        :selected="selectedSection === index"
        @sectionSelected="sectionSelected"
        class="headings"
      />
      <!-- Section item groups -->
      <MinimalSection
        v-for="(section, index) in getSections(sections)"
        :key="`body-${index}`"
        :index="index"
        :title="section.name"
        :icon="section.icon || undefined"
        :groupId="`section-${index}`"
        :items="filterTiles(section.items)"
        :selected="selectedSection === index"
        :showAll="!tabbedView"
        itemSize="small"
        @sectionSelected="sectionSelected"
        @itemClicked="finishedSearching()"
        @change-modal-visibility="updateModalVisibility"
      />
      <div v-if="checkIfResults()" class="no-data">
        {{searchValue ? $t('home.no-results') : $t('home.no-data')}}
      </div>
    </div>
    <div v-else class="no-data"> {{ $t('home.no-data') }} </div>
  </div>
</template>

<script>

import MinimalSection from '@/components/MinimalView/MinimalSection.vue';
import MinimalHeading from '@/components/MinimalView/MinimalHeading.vue';
import MinimalSearch from '@/components/MinimalView/MinimalSearch.vue';
import { GetTheme, ApplyLocalTheme, ApplyCustomVariables } from '@/utils/ThemeHelper';
import SearchUtil from '@/utils/Search';
import Defaults, { localStorageKeys } from '@/utils/defaults';
import ConfigLauncher from '@/components/Settings/ConfigLauncher';

export default {
  name: 'home',
  props: {
    sections: Array, // Main site content
    appConfig: Object, // Main site configuation (optional)
    pageInfo: Object,
  },
  components: {
    MinimalSection,
    MinimalHeading,
    MinimalSearch,
    ConfigLauncher,
  },
  data: () => ({
    searchValue: '',
    layout: '',
    modalOpen: false, // When true, keybindings are disabled
    selectedSection: 0, // The index of currently selected section
    tabbedView: true, // By default use tabs, when searching then show all instead
    theme: GetTheme(),
  }),
  watch: {
    /* When the theme changes, then call the update method */
    searchValue() {
      this.tabbedView = !(this.searchValue.length > 0);
    },
  },
  methods: {
    sectionSelected(index) {
      this.selectedSection = index;
    },
    /* Returns true if there is one or more sections in the config */
    checkTheresData(sections) {
      const localSections = localStorage[localStorageKeys.CONF_SECTIONS];
      return (sections && sections.length >= 1) || (localSections && localSections.length >= 1);
    },
    /* Returns sections from local storage if available, otherwise uses the conf.yml */
    getSections(sections) {
      // If the user has stored sections in local storage, return those
      const localSections = localStorage[localStorageKeys.CONF_SECTIONS];
      if (localSections) {
        const json = JSON.parse(localSections);
        if (json.length >= 1) return json;
      }
      // Otherwise, return the usuall data from conf.yml
      return sections;
    },
    /* Updates local data with search value, triggered from filter comp */
    searching(searchValue) {
      this.searchValue = searchValue || '';
    },
    /* Clears input field, once a searched item is opened */
    finishedSearching() {
      this.$refs.filterComp.clearFilterInput();
    },
    /* Extracts the site name from domain, used for the searching functionality */
    getDomainFromUrl(url) {
      if (!url) return '';
      const urlPattern = /^(?:https?:\/\/)?(?:w{3}\.)?([a-z\d.-]+)\.(?:[a-z.]{2,10})(?:[/\w.-]*)*/;
      const domainPattern = url.match(urlPattern);
      return domainPattern ? domainPattern[1] : '';
    },
    /* Returns only the tiles that match the users search query */
    filterTiles(allTiles) {
      if (!allTiles) return [];
      return SearchUtil(allTiles, this.searchValue);
    },
    /* Update data when modal is open (so that key bindings can be disabled) */
    updateModalVisibility(modalState) {
      this.modalOpen = modalState;
    },
    /* Checks if any of the icons are Font Awesome glyphs */
    checkIfFontAwesomeNeeded() {
      let isNeeded = false;
      if (!this.sections) return false;
      this.sections.forEach((section) => {
        if (section.icon && section.icon.includes('fa-')) isNeeded = true;
        section.items.forEach((item) => {
          if (item.icon && item.icon.includes('fa-')) isNeeded = true;
        });
      });
      return isNeeded;
    },
    /* Injects font-awesome's script tag, only if needed */
    initiateFontAwesome() {
      if (this.appConfig.enableFontAwesome || this.checkIfFontAwesomeNeeded()) {
        const fontAwesomeScript = document.createElement('script');
        const faKey = this.appConfig.fontAwesomeKey || Defaults.fontAwesomeKey;
        fontAwesomeScript.setAttribute('src', `https://kit.fontawesome.com/${faKey}.js`);
        document.head.appendChild(fontAwesomeScript);
      }
    },
    /* Returns true if there is more than 1 sub-result visible during searching */
    checkIfResults() {
      if (!this.sections) return false;
      else {
        let itemsFound = true;
        this.sections.forEach((section) => {
          if (this.filterTiles(section.items).length > 0) itemsFound = false;
        });
        return itemsFound;
      }
    },
    /* Make CSS to set the number of columns based on the number of sections */
    setColumnCount() {
      return `--col-count: ${this.sections.length};`;
    },
    /* Make CSS styles to apply the users custom background image */
    getBackgroundImage() {
      if (this.appConfig && this.appConfig.backgroundImg) {
        return `background: url('${this.appConfig.backgroundImg}');background-size:cover;`;
      }
      return '';
    },
    /* If theme present, then call helper to apply it, and any custom colors */
    applyTheme() {
      if (this.theme) {
        ApplyLocalTheme(this.theme);
        ApplyCustomVariables(this.theme);
      }
    },
    modalChanged(modalState) {
      this.modalOpen = modalState;
    },
  },
  mounted() {
    this.initiateFontAwesome();
    this.applyTheme();
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

.minimal-home {
  display: flex;
  flex-direction: column;
  margin: 1rem auto;
  padding-bottom: 1px;
  padding-top: 10vh;
  min-height: calc(99vh - var(--footer-height));
  width: 90%;
  max-width: 1000px;
  background: var(--minimal-view-background-color);
}

.title-and-search {
  text-align: center;
  h1 {
    color: var(--minimal-view-title-color);
    margin: 0;
    font-size: 3rem;
  }
  a {
    text-decoration: none;
  }
}

/* Outside container wrapping the item groups*/
.item-group-container {
  display: grid;
  gap: 0 0.5rem;
  margin: 3rem auto;
  width: 90%;
  grid-template-columns: repeat(var(--col-count), 1fr);
  @extend .scroll-bar;

  &.showing-all {
    flex-direction: column;
    display: flex;
    .headings {
      display: none;
    }
  }
}

 @include phone {
   .item-group-container {
    display: flex;
    flex-direction: column;
   }
}

.no-data {
    font-size: 2rem;
    color: var(--minimal-view-background-color);
    background: #ffffffeb;
    width: fit-content;
    margin: 2rem auto;
    padding: 0.5rem 1rem;
    border-radius: var(--curve-factor);
}

.minimal-buttons {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    display: flex;
    .home-page-icon {
      color: var(--minimal-view-settings-color);
      width: 1.5rem;
      height: 1.5rem;
      @extend .svg-button;
    }
}
</style>

<style lang="scss">
.minimal-home .minimal-buttons {
  .config-launcher span.config-label { display: none; }
  svg { opacity: var(--dimming-factor); border: none; }
  &:hover svg { opacity: 1; }
  .view-switcher {
    margin-top: 2rem;
    right: 0;
  }
}
</style>
