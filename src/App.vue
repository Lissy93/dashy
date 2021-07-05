<template>
  <div id="dashy">
    <LoadingScreen :isLoading="isLoading" v-if="shouldShowSplash()" />
    <Header :pageInfo="pageInfo" v-if="!shouldHidePageComponents()" />
    <router-view />
    <Footer v-if="showFooter && !shouldHidePageComponents()" :text="getFooterText()" />
  </div>
</template>
<script>

import Header from '@/components/PageStrcture/Header.vue';
import Footer from '@/components/PageStrcture/Footer.vue';
import LoadingScreen from '@/components/PageStrcture/LoadingScreen.vue';
import { componentVisibility } from '@/utils/ConfigHelpers';
import ConfigAccumulator from '@/utils/ConfigAccumalator';
import {
  localStorageKeys,
  splashScreenTime,
  visibleComponents as defaultVisibleComponents,
} from '@/utils/defaults';

const Accumulator = new ConfigAccumulator();
const config = Accumulator.config();
const visibleComponents = componentVisibility(config.appConfig) || defaultVisibleComponents;

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    LoadingScreen,
  },
  provide: {
    config,
    visibleComponents,
  },
  data() {
    return {
      showFooter: visibleComponents.footer,
      isLoading: true,
      appConfig: Accumulator.appConfig(),
      pageInfo: Accumulator.pageInfo(),
      visibleComponents,
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
      return (this.visibleComponents || defaultVisibleComponents).splashScreen
      || !localStorage[localStorageKeys.HIDE_WELCOME_BANNER];
    },
    hideSplash() {
      if (this.shouldShowSplash() && !this.shouldHidePageComponents()) {
        setTimeout(() => { this.isLoading = false; }, splashScreenTime || 2000);
      } else {
        this.isLoading = false;
      }
    },
    shouldHidePageComponents() {
      return (['download'].includes(this.$route.name));
    },
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
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
@import '@/styles/dimensions.scss';
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
