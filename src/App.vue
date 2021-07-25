<template>
  <div id="dashy">
    <LoadingScreen :isLoading="isLoading" v-if="shouldShowSplash()" />
    <Header :pageInfo="pageInfo" />
    <router-view />
    <Footer :text="getFooterText()" v-if="visibleComponents.footer" />
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
  language as defaultLanguage,
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
      isLoading: true, // Set to false after mount complete
      showFooter: visibleComponents.footer,
      appConfig: Accumulator.appConfig(),
      pageInfo: Accumulator.pageInfo(),
      visibleComponents,
    };
  },
  methods: {
    /* If the user has specified custom text for footer - get it */
    getFooterText() {
      if (this.pageInfo && this.pageInfo.footerText) {
        return this.pageInfo.footerText;
      }
      return '';
    },
    /* Injects the users custom CSS as a style tag */
    injectCustomStyles(usersCss) {
      const style = document.createElement('style');
      style.textContent = usersCss;
      document.head.append(style);
    },
    /* Determine if splash screen should be shown */
    shouldShowSplash() {
      return (this.visibleComponents || defaultVisibleComponents).splashScreen
      || !localStorage[localStorageKeys.HIDE_WELCOME_BANNER];
    },
    /* Hide splash screen, either after 2 seconds, or immediately based on user preference */
    hideSplash() {
      if (this.shouldShowSplash()) {
        setTimeout(() => { this.isLoading = false; }, splashScreenTime || 1500);
      } else {
        this.isLoading = false;
      }
    },
    /* Checks local storage, then appConfig, and if a custom language is specified, its applied */
    applyLanguage() {
      let language = defaultLanguage; // Language to apply
      const availibleLocales = this.$i18n.availableLocales; // All available locales

      // If user has specified a language, locally or in config, then check and apply it
      const usersLang = localStorage[localStorageKeys.LANGUAGE] || this.appConfig.language;
      if (usersLang && availibleLocales.includes(usersLang)) {
        language = usersLang;
      } else {
        // Otherwise, attempt to apply language automatically, based on their system language
        const usersBorwserLang1 = window.navigator.language || ''; // e.g. en-GB or or ''
        const usersBorwserLang2 = usersBorwserLang1.split('-')[0]; // e.g. en or undefined
        if (availibleLocales.includes(usersBorwserLang1)) {
          language = usersBorwserLang1;
        } else if (availibleLocales.includes(usersBorwserLang2)) {
          language = usersBorwserLang2;
        }
      }
      // Apply Language
      this.$i18n.locale = language;
      document.getElementsByTagName('html')[0].setAttribute('lang', language);
    },
  },
  /* When component mounted, hide splash and initiate the injection of custom styles */
  mounted() {
    this.applyLanguage();
    this.hideSplash();
    if (this.appConfig.customCss) {
      const cleanedCss = this.appConfig.customCss.replace(/<\/?[^>]+(>|$)/g, '');
      this.injectCustomStyles(cleanedCss);
    }
  },
};
</script>

<style lang="scss">
/* Import styles used globally throughout the app */
@import '@/styles/global-styles.scss';
@import '@/styles/color-palette.scss';
@import '@/styles/dimensions.scss';
@import '@/styles/color-themes.scss';
@import '@/styles/typography.scss';
@import '@/styles/user-defined-themes.scss';

</style>
