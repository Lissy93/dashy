<template>
  <div class="home">
    <!-- Search bar, layout options and settings -->
    <SettingsContainer ref="filterComp"
      @user-is-searchin="searching"
      @change-display-layout="setLayoutOrientation"
      @change-icon-size="setItemSize"
      :displayLayout="layout"
      :iconSize="itemSizeBound"
      :availableThemes="getAvailibleThemes()"
      class="filter-container"
    />
    <!-- Main content, section for each group of items -->
    <div v-if="checkTheresData(sections)"
      :class="`item-group-container orientation-${layout} item-size-${itemSizeBound}`">
      <ItemGroup
        v-for="(section, index) in sections"
        :key="index"
        :title="section.name"
        :displayData="getDisplayData(section)"
        :groupId="`section-${index}`"
        :items="filterTiles(section.items)"
         @itemClicked="finishedSearching()"
         :itemSize="itemSizeBound"
      />
    </div>
    <div v-else class="no-data">No Data Found Yet</div>
  </div>
</template>

<script>

import SettingsContainer from '@/components/Settings/SettingsContainer.vue';
import ItemGroup from '@/components/LinkItems/ItemGroup.vue';

export default {
  name: 'home',
  props: {
    sections: Array, // Main site content
    appConfig: Object, // Main site configuation (optional)
  },
  components: {
    SettingsContainer,
    ItemGroup,
  },
  data: () => ({
    searchValue: '',
    layout: '',
    itemSizeBound: '',
  }),
  computed: {
    layoutOrientation: {
      get: () => localStorage.layoutOrientation || 'default',
      set: function setLayout(layout) {
        localStorage.setItem('layoutOrientation', layout);
        this.layout = layout;
      },
    },
    iconSize: {
      get: () => localStorage.iconSize || 'medium',
      set: function setIconSize(iconSize) {
        localStorage.setItem('iconSize', iconSize);
        this.itemSizeBound = iconSize;
      },
    },
  },
  methods: {
    /* Returns true if there is one or more sections in the config */
    checkTheresData(sections) {
      return sections && sections.length >= 1;
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
      const urlPattern = /^(?:https?:\/\/)?(?:w{3}\.)?([a-z\d.-]+)\.(?:[a-z.]{2,10})(?:[/\w.-]*)*/;
      const domainPattern = url.match(urlPattern);
      return domainPattern ? domainPattern[1] : '';
    },
    /* Returns only the tiles that match the users search query */
    filterTiles(allTiles) {
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
    /* Returns optional section display preferences if available */
    getDisplayData(section) {
      return !section.displayData ? {} : section.displayData;
    },
    /* Sets layout attribute, which is used by ItemGroup */
    setLayoutOrientation(layout) {
      this.layoutOrientation = layout;
    },
    /* Sets item size attribute, which is used by ItemGroup */
    setItemSize(itemSize) {
      this.iconSize = itemSize;
    },
    getAvailibleThemes() {
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
      availibleThemes.Deafault = '#';
      return availibleThemes;
    },
    /* Checks if any of the icons are Font Awesome glyphs */
    checkIfFontAwesomeNeeded() {
      let isFound = false;
      this.sections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.icon && item.icon.includes('fas')) isFound = true;
        });
      });
      return isFound;
    },
    /* Injects font-awesome's script tag, only if needed */
    initiateFontAwesome() {
      if (this.checkIfFontAwesomeNeeded()) {
        const fontAwesomeScript = document.createElement('script');
        fontAwesomeScript.setAttribute('src', 'https://kit.fontawesome.com/def7c3ce4c.js');
        document.head.appendChild(fontAwesomeScript);
      }
    },
  },
  mounted() {
    this.initiateFontAwesome();
    this.layoutOrientation = this.layoutOrientation;
    this.itemSizeBound = this.iconSize;
  },
};
</script>

<style lang="scss" scoped>
@import '../../src/styles/media-queries.scss';

.home {
  background: var(--background);
  padding-bottom: 1px;
  min-height: 90%;
}

/* Outside container wrapping the item groups*/
.item-group-container {
  display: grid;
  gap: 0.5rem;

  /* Options for alternate layouts, triggered by buttons */
  &.orientation-horizontal {
    display: flex;
    flex-direction: column;
  }
  &.orientation-vertical {
    display: flex;
    flex-direction: row;
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
}

.no-data {
    font-size: 2rem;
    color: var(--background);
    background: #ffffffeb;
    width: fit-content;
    margin: 2rem auto;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

</style>
