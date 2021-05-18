<template>
  <div id="dashy" data-theme="dark">
    <Header :pageInfo="pageInfo" />
    <router-view />
    <Footer v-if="showFooter" :text="getFooterText()" />
  </div>
</template>
<script>

import Header from '@/components/PageStrcture/Header.vue';
import Footer from '@/components/PageStrcture/Footer.vue';
import Defaults, { localStorageKeys } from '@/utils/defaults';
import conf from '../public/conf.yml';

export default {
  name: 'app',
  components: {
    Header,
    Footer,
  },
  data: () => ({
    // pageInfo: this.getPageInfo(conf.pageInfo),
    appConfig: conf.appConfig || Defaults.appConfig,
    showFooter: Defaults.visibleComponents.footer,
  }),
  computed: {
    pageInfo: function pi() { return this.getPageInfo(conf.pageInfo); },
  },
  methods: {
    /* Returns either page info from the config, or default values */
    getPageInfo(pageInfo) {
      const defaults = Defaults.pageInfo;

      let localPageInfo;
      try {
        localPageInfo = JSON.parse(localStorage[localStorageKeys.PAGE_INFO]);
      } catch (e) {
        localPageInfo = {};
      }
      if (pageInfo) {
        return {
          title: localPageInfo.title || pageInfo.title || defaults.title,
          description: localPageInfo.description || pageInfo.description || defaults.description,
          navLinks: localPageInfo.navLinks || pageInfo.navLinks || defaults.navLinks,
          footerText: localPageInfo.footerText || pageInfo.footerText || defaults.footerText,
        };
      }
      return defaults;
    },
    getFooterText() {
      if (this.pageInfo && this.pageInfo.footerText) {
        return this.pageInfo.footerText;
      }
      return '';
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
