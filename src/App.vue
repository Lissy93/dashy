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
import { config, appConfig, pageInfo } from '@/utils/ConfigAccumalator';

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    LoadingScreen,
  },
  provide: {
    config,
  },
  data() {
    return {
      showFooter: Defaults.visibleComponents.footer,
      isLoading: true,
      appConfig,
      pageInfo,
    };
  },
  methods: {
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
