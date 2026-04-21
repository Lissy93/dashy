<template>
  <div id="dashy" :style="topLevelStyleModifications" :class="subPageClassName">
    <EditModeTopBanner v-if="isEditMode" />
    <LoadingScreen :isLoading="isLoading" v-if="shouldShowSplash" />
    <Header :pageInfo="pageInfo" />
    <router-view v-if="!isFetching" />
    <CriticalError v-if="hasCriticalError" />
    <Footer :text="footerText" v-if="footerVisible && !isFetching" />
  </div>
</template>
<script>

import Header from '@/components/PageStrcture/Header.vue';
import Footer from '@/components/PageStrcture/Footer.vue';
import EditModeTopBanner from '@/components/InteractiveEditor/EditModeTopBanner.vue';
import CriticalError from '@/components/PageStrcture/CriticalError.vue';
import LoadingScreen from '@/components/PageStrcture/LoadingScreen.vue';
import { welcomeMsg } from '@/utils/logging/CoolConsole';
import ErrorHandler from '@/utils/logging/ErrorHandler';
import { syncPageMeta } from '@/utils/PageMeta';
import { viewFromPath } from '@/utils/config/ConfigHelpers';
import Keys from '@/utils/StoreMutations';
import {
  localStorageKeys,
  splashScreenTime,
  language as defaultLanguage,
} from '@/utils/config/defaults';

export default {
  name: 'app',
  components: {
    Header,
    Footer,
    LoadingScreen,
    EditModeTopBanner,
    CriticalError,
  },
  data() {
    return {
      isLoading: true, // Set to false after mount complete
      isFetching: true, // Set to false after the conf has been fetched
    };
  },
  watch: {
    isEditMode(isEditMode) {
      // When in edit mode, show confirmation dialog on page exit
      window.onbeforeunload = isEditMode ? this.confirmExit : null;
    },
    config() {
      this.isFetching = false;
    },
    /* Sync document title + description whenever route or loaded config changes */
    metaDeps: {
      handler() { syncPageMeta(this.$route, this.$store); },
      immediate: true,
    },
  },
  computed: {
    /* If the user has specified custom text for footer - get it */
    footerText() {
      return this.pageInfo && this.pageInfo.footer ? this.pageInfo.footer : '';
    },
    /* Footer renders only when there's text AND we're not on workspace */
    footerVisible() {
      if (viewFromPath(this.$route.path) === 'workspace') return false;
      return !!this.footerText;
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
      return this.$store.getters.sections;
    },
    visibleComponents() {
      return this.$store.getters.visibleComponents;
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
    hasCriticalError() {
      return this.$store.state.criticalError;
    },
    subPageClassName() {
      return this.$store.state.currentConfigInfo?.confId || '';
    },
    /* Dep tuple so the metaDeps watcher tracks every reactive input */
    metaDeps() {
      return [this.$route.fullPath, this.pageInfo, this.sections];
    },
    topLevelStyleModifications() {
      const vc = this.visibleComponents;
      let styles = '';
      if (!this.footerVisible && !vc.pageTitle) styles += '--footer-height: 1rem;';
      else if (!this.footerVisible) styles += '--footer-height: 5rem;';
      else if (!vc.pageTitle) styles += '--footer-height: 4rem;';
      const maxWidth = this.parseContentMaxWidth(this.appConfig.contentMaxWidth);
      if (maxWidth) {
        styles += `--content-max-width: ${maxWidth};`;
      }
      return styles;
    },
  },
  methods: {
    /* Parse appConfig.contentMaxWidth into valid CSS unit */
    parseContentMaxWidth(usersCmw) {
      if (usersCmw === undefined || usersCmw === null || usersCmw === '') return null;
      const maxWidthStr = String(usersCmw).trim();
      if (/^\d+(\.\d+)?$/.test(maxWidthStr)) {
        return Number(maxWidthStr) <= 100 ? `${maxWidthStr}%` : `${maxWidthStr}px`;
      }
      if (/^\d+(\.\d+)?(%|px|rem|em|vw|vh)$/.test(maxWidthStr)) return maxWidthStr;
      ErrorHandler(`Invalid contentMaxWidth value: '${usersCmw}'`);
      return null;
    },
    /* Injects the users custom CSS as a style tag */
    injectCustomStyles(usersCss) {
      const style = document.createElement('style');
      style.textContent = usersCss;
      document.head.append(style);
    },
    /* Applies user-defined custom CSS and external stylesheets from appConfig */
    applyCustomStyles() {
      if (this.appConfig.customCss) {
        const cleanedCss = this.appConfig.customCss.replace(/<\/?[^>]+(>|$)/g, '');
        this.injectCustomStyles(cleanedCss);
      }
      if (this.appConfig.externalStyleSheet) {
        // Remove any previously injected external stylesheets to avoid duplicates bug
        document.querySelectorAll('[data-external-source]').forEach((el) => el.remove());
        // Then add the external stylesheet(s)
        const externals = this.appConfig.externalStyleSheet;
        const urls = Array.isArray(externals) ? externals : [externals];
        urls.forEach((url) => {
          if (typeof url !== 'string' || (!url.startsWith('http') && !url.startsWith('/'))) {
            ErrorHandler(`Invalid external stylesheet URL: ${url}`);
            return;
          }
          const link = document.createElement('link');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('type', 'text/css');
          link.setAttribute('href', url);
          link.setAttribute('data-external-source', 'dashy');
          document.head.appendChild(link);
        });
      }
    },
    /* Hide splash screen, either after 2 seconds, or immediately based on user preference */
    hideSplash() {
      if (this.shouldShowSplash) {
        setTimeout(() => { this.isLoading = false; }, splashScreenTime || 1000);
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
    /* If placeholder element still visible, hide it */
    hideLoader() {
      const loader = document.getElementById('loader');
      if (loader) loader.style.display = 'none';
    },
    /* Called when in edit mode and navigating away from page */
    confirmExit(e) {
      e.preventDefault();
      return 'You may have unsaved edits. Are you sure you want to exit the page?';
    },
    /* Detect and apply theme based on OS preference */
    applyThemeBasedOnOSPreference() {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const osTheme = prefersDark ? this.appConfig.nightTheme : this.appConfig.dayTheme;
      if (osTheme) {
        this.$store.commit(Keys.SET_THEME, osTheme);
        this.updateTheme(osTheme);
      }
    },
  },
  /* Basic initialization tasks on app load */
  async mounted() {
    await this.$store.dispatch(Keys.INITIALIZE_CONFIG); // Initialize config before moving on
    this.applyLanguage(); // Apply users local language
    this.applyThemeBasedOnOSPreference(); // Apply theme based on OS preference
    this.hideSplash(); // Hide the splash screen, if visible
    this.applyCustomStyles(); // Apply custom CSS and external stylesheets
    this.hideLoader(); // If initial placeholder still visible, hide it
    welcomeMsg(); // Show message in console
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
