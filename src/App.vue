<template>
  <div id="dashy" data-theme="dark">
    <Header :pageInfo="getPageInfo(pageInfo)" />
    <router-view />
    <Footer v-if="showFooter" />
  </div>
</template>
<script>

import Header from '@/components/PageStrcture/Header.vue';
import Footer from '@/components/PageStrcture/Footer.vue';
import Defaults from '@/utils/defaults';
import conf from '@/data/conf.yml';

export default {
  name: 'app',
  components: {
    Header,
    Footer,
  },
  data: () => ({
    pageInfo: conf.pageInfo,
    showFooter: Defaults.visibleComponents.footer,
  }),
  methods: {
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
};
</script>

<style lang="scss">
@import '@/styles/global-styles.scss';
@import '@/styles/color-palette.scss';
@import '@/styles/color-themes.scss';

body {
  background: var(--background);
  margin: 0;
  padding: 0;
}

#app {
  .footer {
    text-align: center;
  }
}

</style>
