<template>
  <div class="home">
    <Header :pageInfo="getPageInfo(pageInfo)" />
    <FilterTile @user-is-searchin="searching" class="filter-container" ref="filterComp" />
    <div class="item-group-container">
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
import conf from '../data/conf.yml';

export default {
  name: 'home',
  components: {
    Header,
    FilterTile,
    ItemGroup,
  },
  data: () => ({
    pageInfo: conf.pageInfo,
    sections: conf.sections,
    searchTile: '',
  }),
  methods: {
    finishedSearching() {
      this.$refs.filterComp.clearFilterInput();
    },
    /* Returns true if the user is currently searching */
    searching(searchTile) {
      this.searchTile = searchTile;
    },
    /* Extracts the website name from domain, used for the searching functionality */
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
        const searchTerm = this.searchTile.toLowerCase();
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
  },
  mounted() {
    const fontAwesomeScript = document.createElement('script');
    fontAwesomeScript.setAttribute('src', 'https://kit.fontawesome.com/def7c3ce4c.js');
    document.head.appendChild(fontAwesomeScript);
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
