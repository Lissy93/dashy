<template>
  <div class="home">
    <!-- Page title and navigation buttons -->
    <Header :pageInfo="getPageInfo(pageInfo)" />
    <!-- Search bar, layout options and settings -->
    <FilterTile ref="filterComp"
      @user-is-searchin="searching"
      @change-display-layout="setLayoutOrientation"
      class="filter-container"
    />
    <!-- Main content, section for each group of items -->
    <div :class="`item-group-container orientation-${layout}`">
      <ItemGroup
        v-for="(section, index) in sections"
        :key="index"
        :title="section.name"
        :displayData="getDisplayData(section)"
        :groupId="`section-${index}`"
        :items="filterTiles(section.items)"
         @itemClicked="finishedSearching()"
      />
    </div>
  </div>
</template>

<script>

import Header from '@/components/Header.vue';
import FilterTile from '@/components/FilterTile.vue';
import ItemGroup from '@/components/ItemGroup.vue';
import conf from '../data/conf.yml'; // Main site configuration

export default {
  name: 'home',
  components: {
    Header,
    FilterTile,
    ItemGroup,
  },
  data: () => ({
    pageInfo: conf.pageInfo, // Site meta data (title, description, etc)
    sections: conf.sections, // List of sections, containing items
    searchValue: '',
    layout: '',
  }),
  computed: {
    layoutOrientation: {
      get: () => localStorage.layoutOrientation || 'default',
      set: function setLayout(layout) {
        localStorage.setItem('layoutOrientation', layout);
        this.layout = layout;
      },
    },
  },
  methods: {
    setLayoutOrientation(layout) {
      this.layoutOrientation = layout;
    },
    getLayoutOrientation() {
      return localStorage.layoutOrientation || 'default';
    },
    /* Updates local data with search value, triggered from filter comp */
    searching(searchValue) {
      this.searchValue = searchValue;
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
    /* Returns either page info from the config, or default values */
    getPageInfo(pageInfo) {
      const defaults = { title: 'Demo', description: '' };
      if (pageInfo) {
        return {
          title: pageInfo.title || defaults.title,
          description: pageInfo.description || defaults.description,
        };
      }
      return defaults;
    },
    /* Injects font-awesome's script tag, used for item icons */
    initiateFontAwesome() {
      const fontAwesomeScript = document.createElement('script');
      fontAwesomeScript.setAttribute('src', 'https://kit.fontawesome.com/def7c3ce4c.js');
      document.head.appendChild(fontAwesomeScript);
    },
  },
  mounted() {
    this.initiateFontAwesome();
    this.layout = this.getLayoutOrientation();
  },
};
</script>

<style lang="scss" scoped>
@import '../../src/styles/color-pallet.scss';
@import '../../src/styles/media-queries.scss';

.home {
  background: $background;
  padding-bottom: 1px;
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
</style>
