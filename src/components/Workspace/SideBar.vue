<template>
  <nav class="side-bar">
    <div v-for="(section, index) in sections" :key="index">
      <SideBarItem class="item" :icon="section.icon" :title="section.title" />
    </div>
  </nav>
</template>

<script>

import SideBarItem from '@/components/Workspace/SideBarItem.vue';

export default {
  name: 'SideBar',
  inject: ['config'],
  props: {
    sections: Array,
  },
  components: {
    SideBarItem,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

nav.side-bar {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: var(--side-bar-background);
  color: var(--side-bar-color);
  height: 100%;
  width: 3rem;
  text-align: center;
  .item:not(:last-child) {
    border-bottom: 1px dashed var(--side-bar-color);
  }
}

</style>
