<template>
  <div class="minimal-home" :style="getBackgroundImage()">
    <!-- Main content, section for each group of items -->
    <div v-if="checkTheresData(sections)"
      :class="`item-group-container item-size-small`">
      <MinimalSection
        v-for="(section, index) in getSections(sections)"
        :key="index"
        :index="index"
        :title="section.name"
        :icon="section.icon || undefined"
        :groupId="`section-${index}`"
        :items="filterTiles(section.items)"
        :selected="selectedSection === index"
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
import Defaults, { localStorageKeys } from '@/utils/defaults';

export default {
  name: 'home',
  props: {
    sections: Array, // Main site content
    appConfig: Object, // Main site configuation (optional)
  },
  components: {
    MinimalSection,
  },
  data: () => ({
    searchValue: '',
    layout: '',
    modalOpen: false, // When true, keybindings are disabled
    selectedSection: 0, // The index of currently selected section
  }),
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
  padding-bottom: 1px;
  background: var(--background);
  min-height: calc(99.9vh - var(--footer-height));
  width: 90%;
  max-width: 1000px;
  margin: 1rem auto;
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

  /* Specify number of columns, based on screen size */
  @include phone {
    grid-template-columns: repeat(1, 1fr);
  }
  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }
  @include laptop {
    grid-template-columns: repeat(2, 1fr);
  }
  @include monitor {
    grid-template-columns: repeat(3, 1fr);
  }
  @include big-screen {
    grid-template-columns: repeat(4, 1fr);
  }
  @include big-screen-up {
    grid-template-columns: repeat(5, 1fr);
  }

  /* Hide when search term returns nothing */
  .no-results { display: none; }
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

section.filter-container {
  border-bottom: 1px solid var(--outline-color);
  @include phone {
    flex-direction: column;
  }
}

</style>
