<template>
  <div id="dashy">
    <LoadingScreen :isLoading="isLoading" v-if="shouldShowSplash()" />
    <Header :pageInfo="pageInfo" />
    <router-view />
    <Footer v-if="showFooter" :text="getFooterText()" />
  </div>
</template>
<script>

import Header from '@/components/PageStrcture/Header.vue';
import Footer from '@/components/PageStrcture/Footer.vue';
import LoadingScreen from '@/components/PageStrcture/LoadingScreen.vue';
import Defaults, { localStorageKeys, splashScreenTime } from '@/utils/defaults';
import conf from '../public/conf.yml';

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    LoadingScreen,
  },
  data() {
    return {
      // pageInfo: this.getPageInfo(conf.pageInfo),
      showFooter: Defaults.visibleComponents.footer,
      isLoading: true,
    };
  },
  computed: {
    pageInfo() {
      return this.getPageInfo(conf.pageInfo);
    },
    appConfig() {
      if (localStorage[localStorageKeys.APP_CONFIG]) {
        return JSON.parse(localStorage[localStorageKeys.APP_CONFIG]);
      } else if (conf.appConfig) {
        return conf.appConfig;
      } else {
        return Defaults.appConfig;
      }
    },
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
    injectCustomStyles(usersCss) {
      const style = document.createElement('style');
      style.textContent = usersCss;
      document.head.append(style);
    },
    shouldShowSplash() {
      return this.appConfig.showSplashScreen || !localStorage[localStorageKeys.HIDE_WELCOME_BANNER];
    },
    hideSplash() {
      if (this.shouldShowSplash()) {
        setTimeout(() => { this.isLoading = false; }, splashScreenTime || 2000);
      } else {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.hideSplash();
    if (this.appConfig.customCss) {
      const cleanedCss = this.appConfig.customCss.replace(/<\/?[^>]+(>|$)/g, '');
      this.injectCustomStyles(cleanedCss);
    }
  },
};
</script>

<style lang="scss">
@import '@/styles/global-styles.scss';
@import '@/styles/color-palette.scss';
@import '@/styles/color-themes.scss';
@import '@/styles/typography.scss';

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
