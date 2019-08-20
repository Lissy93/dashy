<template>
  <div class="home">
    <Header />
    <FilterTile @user-is-searchin="searching" class="filter-container" />

    <div class="item-group-container">
      <ItemGroup
        v-for="item in items"
        :key="item.id"
        :groupId="item.id"
        :title="item.name"
        :items="filterTiles(item.items)"
      />
    </div>
  </div>
</template>

<script>

import Header from '@/components/Header.vue'
import FilterTile from '@/components/FilterTile.vue'
import ItemGroup from '@/components/ItemGroup.vue'
import * as linkData from './../data/item-data.json'

export default {
  name: 'home',
  components: {
    Header,
    FilterTile,
    ItemGroup
  },
  data: () => {
    return {
      items: linkData.default,
      searchTile: ''
    }
  },
  methods: {
    searching (searchTile) {
      this.searchTile = searchTile
    },
    filterTiles (allTiles) {
      return allTiles.filter(tile => {
        return tile.title.toLowerCase().includes(this.searchTile.toLowerCase())
      })
    }
  },
  props: {
    title: { default: 'Panel', type: String },
    subtitle: { default: 'All your server management tools in one place', type: String }
  }
}
</script>

<style lang="scss" scoped>

.home {
  background: #2F323A;
  padding-bottom: 1px;
}

.item-group-container {
  display: flex;
  margin: 2rem;
  align-items:flex-start;
  align-content:flex-start;
  .item-group-outer {
    margin: 10px;
  }
}
</style>
