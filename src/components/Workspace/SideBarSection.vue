<template>
  <div class="sub-side-bar">
    <div v-for="(item, index) in items" :key="index">
      <SideBarItem
        class="item"
        :icon="item.icon"
        :title="item.title"
        :url="item.url"
        :click="launchItem"
      />
    </div>
  </div>
</template>

<script>

import SideBarItem from '@/components/Workspace/SideBarItem.vue';

export default {
  name: 'SideBarSection',
  inject: ['config'],
  props: {
    items: Array,
  },
  components: {
    SideBarItem,
  },
  methods: {
    launchItem(url) {
      this.$emit('launch', url);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

div.sub-side-bar {
  display: flex;
  flex-direction: column;
  background: var(--side-bar-background);
  color: var(--side-bar-color);
  border: 1px dashed red;
  text-align: center;
  .item:not(:last-child) {
    border-bottom: 1px dashed var(--side-bar-color);
  }
}

</style>
