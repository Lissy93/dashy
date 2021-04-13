<template>
  <div id="dashy" data-theme="dark">
    <Header :pageInfo="getPageInfo(pageInfo)" />
    <router-view />
    <Footer />
  </div>
</template>
<script>

import Header from '@/components/PageStrcture/Header.vue';
import Footer from '@/components/PageStrcture/Footer.vue';
import conf from '@/data/conf.yml';

export default {
  name: 'app',
  components: {
    Header,
    Footer,
  },
  data: () => ({
    pageInfo: conf.pageInfo,
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
@import '../src/styles/global-styles.scss';
@import '../src/styles/color-palette.scss';

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
