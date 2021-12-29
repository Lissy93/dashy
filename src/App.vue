<template>
  <div id="dashy">
    <EditModeTopBanner v-if="isEditMode" />
    <LoadingScreen :isLoading="isLoading" v-if="shouldShowSplash" />
    <Header :pageInfo="pageInfo" />
    <router-view />
    <Footer :text="footerText" v-if="visibleComponents.footer" />
  </div>
</template>
<script>

import Header from '@/components/PageStrcture/Header.vue';
import Footer from '@/components/PageStrcture/Footer.vue';
import EditModeTopBanner from '@/components/InteractiveEditor/EditModeTopBanner.vue';
import LoadingScreen from '@/components/PageStrcture/LoadingScreen.vue';
import { welcomeMsg } from '@/utils/CoolConsole';
import ErrorHandler from '@/utils/ErrorHandler';
import Keys from '@/utils/StoreMutations';
import {
  localStorageKeys,
  splashScreenTime,
  language as defaultLanguage,
} from '@/utils/defaults';

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    LoadingScreen,
    EditModeTopBanner,
  },
  data() {
    return {
      isLoading: true, // Set to false after mount complete
    };
  },
  computed: {
    /* If the user has specified custom text for footer - get it */
    footerText() {
      return this.pageInfo && this.pageInfo.footerText ? this.pageInfo.footerText : '';
    },
    /* Determine if splash screen should be shown */
    shouldShowSplash() {
      return (this.appConfig.showSplashScreen);
    },
    config() {
      return this.$store.state.config;
    },
    appConfig() {
      return this.$store.getters.appConfig;
    },
    pageInfo() {
      return this.$store.getters.pageInfo;
    },
    sections() {
      return this.$store.getters.pageInfo;
    },
    visibleComponents() {
      return this.$store.getters.visibleComponents;
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
  },
  created() {
    this.$store.dispatch(Keys.INITIALIZE_CONFIG);
  },
  methods: {
    /* Injects the users custom CSS as a style tag */
    injectCustomStyles(usersCss) {
      const style = document.createElement('style');
      style.textContent = usersCss;
      document.head.append(style);
    },
    /* Hide splash screen, either after 2 seconds, or immediately based on user preference */
    hideSplash() {
      if (this.shouldShowSplash) {
        setTimeout(() => { this.isLoading = false; }, splashScreenTime || 1500);
      } else {
        this.isLoading = false;
      }
    },

    /* Auto-detects users language from browser/ os, when not specified */
    autoDetectLanguage(availibleLocales) {
      const isLangSupported = (languageList, userLang) => languageList
        .map(lang => lang.toLowerCase()).find((lang) => lang === userLang.toLowerCase());

      const usersBorwserLang1 = window.navigator.language || ''; // e.g. en-GB or or ''
      const usersBorwserLang2 = usersBorwserLang1.split('-')[0]; // e.g. en or undefined
      const usersSpairLangs = window.navigator.languages; // e.g [en, en-GB, en-US]
      return isLangSupported(availibleLocales, usersBorwserLang1)
        || isLangSupported(availibleLocales, usersBorwserLang2)
        || usersSpairLangs.find((spair) => isLangSupported(availibleLocales, spair))
        || defaultLanguage;
    },

    /* Get users language, if not available then call auto-detect */
    getLanguage() {
      const availibleLocales = this.$i18n.availableLocales; // All available locales
      const usersLang = localStorage[localStorageKeys.LANGUAGE] || this.appConfig.language;
      if (usersLang) {
        if (availibleLocales.includes(usersLang)) {
          return usersLang;
        } else {
          ErrorHandler(`Unsupported Language: '${usersLang}'`);
        }
      }
      return this.autoDetectLanguage(availibleLocales);
    },

    /* Fetch or detect users language, then apply it */
    applyLanguage() {
      const language = this.getLanguage();
      this.$store.commit(Keys.SET_LANGUAGE, language);
      this.$i18n.locale = language;
      document.getElementsByTagName('html')[0].setAttribute('lang', language);
    },
    hideLoader() {
      const loader = document.getElementById('loader');
      if (loader) loader.style.display = 'none';
    },
  },
  /* When component mounted, hide splash and initiate the injection of custom styles */
  mounted() {
    this.applyLanguage();
    this.hideSplash();
    if (this.appConfig.customCss) {
      const cleanedCss = this.appConfig.customCss.replace(/<\/?[^>]+(>|$)/g, '');
      this.injectCustomStyles(cleanedCss);
      this.hideLoader();
    }
    welcomeMsg();
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
