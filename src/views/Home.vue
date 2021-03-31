<template>
  <div class="home">
    <Header />
    <FilterTile @user-is-searchin="searching" class="filter-container" />
    <div class="item-group-container">
      <ItemGroup
        v-for="(section, index) in sections"
        :key="index"
        :title="section.name"
        :displayData="getDisplayData(section)"
        :groupId="`section-${index}`"
        :items="filterTiles(section.items)"
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
  props: {
    title: { default: 'Panel', type: String },
    subtitle: { default: 'All your server management tools in one place', type: String },
  },
  components: {
    Header,
    FilterTile,
    ItemGroup,
  },
  data: () => ({
    sections: conf.sections,
    searchTile: '',
  }),
  methods: {
    searching(searchTile) {
      this.searchTile = searchTile;
    },
    getDomainFromUrl(url) {
      const urlPattern = /^(?:https?:\/\/)?(?:w{3}\.)?([a-z\d.-]+)\.(?:[a-z.]{2,10})(?:[/\w.-]*)*/;
      const domainPattern = url.match(urlPattern);
      return domainPattern ? domainPattern[1] : '';
    },
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
    getDisplayData(section) {
      const defaultDisplayData = { collapsed: null, rows: null, cols: null };
      return !section.displayData ? defaultDisplayData : section.displayData;
    },
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
  gap: 10px;

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
