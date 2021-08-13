<template>
  <div class="minimal-home" :style="getBackgroundImage() + setColumnCount()">
    <div class="title-and-search">
      <router-link to="/">
        <h1>{{ pageInfo.title }}</h1>
      </router-link>
      <MinimalSearch @user-is-searchin="(s) => { this.searchValue = s; }" />
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
        :class="(filterTiles(section.items).length === 0 && searchValue) ? 'no-results' : ''"
      />
    </div>
  </div>
</template>

<script>

import MinimalSection from '@/components/MinimalView/MinimalSection.vue';
import MinimalHeading from '@/components/MinimalView/MinimalHeading.vue';
import MinimalSearch from '@/components/MinimalView/MinimalSearch.vue';
import Defaults, { localStorageKeys } from '@/utils/defaults';

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
  },
  data: () => ({
    searchValue: '',
    layout: '',
    modalOpen: false, // When true, keybindings are disabled
    selectedSection: 0, // The index of currently selected section
    tabbedView: true, // By default use tabs, when searching then show all instead
  }),
  watch: {
    /* When the theme changes, then call the update method */
    searchValue() {
      this.tabbedView = !this.searchValue.length > 0;
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
      return allTiles.filter((tile) => {
        const {
          title, description, provider, url,
        } = tile;
        const searchTerm = this.searchValue.toLowerCase();
        return (title && title.toLowerCase().includes(searchTerm))
          || (provider && provider.toLowerCase().includes(searchTerm))
          || (description && description.toLowerCase().includes(searchTerm))
          || this.getDomainFromUrl(url).includes(searchTerm);
      });
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
    setColumnCount() {
      return `--col-count: ${this.sections.length};`;
    },
    getBackgroundImage() {
      if (this.appConfig && this.appConfig.backgroundImg) {
        return `background: url('${this.appConfig.backgroundImg}');background-size:cover;`;
      }
      return '';
    },
  },
  mounted() {
    this.initiateFontAwesome();
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

.minimal-home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem auto;
  padding-bottom: 1px;
  min-height: calc(99.9vh - var(--footer-height));
  width: 90%;
  max-width: 1000px;
  background: var(--background);
}

.title-and-search {
  text-align: center;
  h1 {
    color: var(--heading-text-color);
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

  /* Hide when search term returns nothing */
  .no-results { display: none; }

  &.showing-all {
    flex-direction: column;
    display: flex;
    .headings {
      display: none;
    }
  }
}

.no-data {
    font-size: 2rem;
    color: var(--background);
    background: #ffffffeb;
    width: fit-content;
    margin: 2rem auto;
    padding: 0.5rem 1rem;
    border-radius: var(--curve-factor);
}

</style>
