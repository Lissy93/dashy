<template>
  <div class="sub-side-bar">
    <div v-for="(item, index) in items" :key="index">
      <SideBarItem
        class="item"
        :icon="item.icon"
        :title="item.title"
        :url="item.url"
        :target="item.target"
        @launch-app="launchApp"
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
    launchApp(options) {
      this.$emit('launch-app', options);
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
  background: var(--side-bar-background-lighter);
  border-radius: var(--curve-factor);
  margin: 0.2rem;
  color: var(--side-bar-color);
  text-align: center;
  z-index: 3;
  .item:not(:last-child) {
    border-bottom: 1px dashed var(--side-bar-color);
  }
}

</style>
