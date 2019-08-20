<template>
  <div class="home">
    <section class="top-section">
      <div class="heading">
        <h1>{{title}}</h1>
        <span class="subtitle">{{subtitle}}</span>
      </div>
      <Nav class="nav" />
    </section>
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

import Nav from '@/components/Nav.vue'
import FilterTile from '@/components/FilterTile.vue'
import ItemGroup from '@/components/ItemGroup.vue'
import * as linkData from './../data/item-data.json'

export default {
  name: 'home',
  components: {
    Nav,
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

section.top-section {
    margin: 0;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    background: #282a32;
    align-items: center;
    align-content: flex-start;
    @media screen and (max-width: 600px) {
      flex-direction: column-reverse;
    }
}

.heading {
  display: flex;
  flex-direction: column;
  h1 {
    background: -webkit-linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 3rem;
    margin: 0;
  }
  span.subtitle {
    color: #9F86FF;
    font-style: italic;
    text-shadow: 1px 1px 2px #130f23;
  }
  @media screen and (max-width: 600px) {
    text-align: center;
    padding: 0.25rem 0;
  }
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
