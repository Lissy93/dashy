<template>
  <div class="home">
    <Header />
    <FilterTile @user-is-searchin="searching" class="filter-container" />
    <div class="item-group-container">
      <masonry
        :cols="{600: 1, 780: 2, 1150: 2, 1780: 3, 9999: 4}"
        :gutter="30"
        >
        <ItemGroup
          v-for="(item, index) in items"
          :key="index"
          :groupId="item.id"
          :title="item.name"
          :collapsed="item.collapsed"
          :cols="item.cols"
          :items="filterTiles(item.items)"
        />
      </masonry>
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
    items: conf.sections,
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
  },
};
</script>

<style lang="scss" scoped>

@import '../../src/styles/color-pallet.scss';

.home {
  background: $background;
  padding-bottom: 1px;
}

.item-group-container {
  display: flex;
  flex-wrap: wrap;
  margin: 2rem;
  align-items:flex-start;
  align-content:flex-start;
  .item-group-outer {
    margin: 10px;
  }
}
</style>
