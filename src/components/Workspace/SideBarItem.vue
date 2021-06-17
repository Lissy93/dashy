<template>
  <div class="side-bar-item" @click="click()">
    <Icon v-if="icon" :icon="icon" size="small" :url="url" />
    <p v-else>{{ title }}</p>
  </div>
</template>

<script>

import Icon from '@/components/LinkItems/ItemIcon.vue';

export default {
  name: 'SideBarItem',
  inject: ['config'],
  props: {
    icon: String,
    title: String,
    url: String,
    click: Function,
  },
  components: {
    Icon,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

div.side-bar-item {
  color: var(--side-bar-color);
  background: var(--side-bar-background);
  text-align: center;
}

</style>
