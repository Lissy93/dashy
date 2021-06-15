<template>
  <div class="side-bar-item">
    <Icon v-if="icon" :icon="icon" size="small" />
    <p v-else>{{ title }}</p>
  </div>
</template>

<script>

import Icon from '@/components/LinkItems/ItemIcon.vue';
import Defaults from '@/utils/defaults';

export default {
  name: 'SideBarItem',
  inject: ['config'],
  props: {
    icon: String,
    title: String,
  },
  mounted() {
    this.initiateFontAwesome();
  },
  components: {
    Icon,
  },
  methods: {
    initiateFontAwesome() {
      const fontAwesomeScript = document.createElement('script');
      const faKey = this.config.appConfig.fontAwesomeKey || Defaults.fontAwesomeKey;
      fontAwesomeScript.setAttribute('src', `https://kit.fontawesome.com/${faKey}.js`);
      document.head.appendChild(fontAwesomeScript);
    },
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
