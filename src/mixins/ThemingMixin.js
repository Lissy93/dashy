/**
 * This mixin can be extended by any component or view which needs to manage themes
 * It handles fetching and applying themes from the store, updating themes,
 * applying custom CSS variables and loading external stylesheets.
 * */

import Keys from '@/utils/StoreMutations';
import ErrorHandler from '@/utils/ErrorHandler';
import { builtInThemes, localStorageKeys, mainCssVars } from '@/utils/defaults';

const ThemingMixin = {
  data: () => ({
    selectedTheme: '', // Used only to bind current them to theme dropdown
  }),
  computed: {
    /* This is the theme from the central store. When it changes, the UI will update */
    themeFromStore() {
      return this.$store.getters.theme;
    },
    appConfig() {
      return this.$store.getters.appConfig;
    },
    /* Any extra user-defined themes, to add to dropdown */
    extraThemeNames() {
      const userThemes = this.appConfig?.cssThemes || [];
      if (typeof userThemes === 'string') return [userThemes];
      return userThemes;
    },
    /* If user specified external stylesheet(s), format and return */
    externalThemes() {
      const availableThemes = {};
      if (this.appConfig?.externalStyleSheet) {
        const externals = this.appConfig.externalStyleSheet;
        if (Array.isArray(externals)) {
          externals.forEach((ext, i) => {
            availableThemes[`External Stylesheet ${i + 1}`] = ext;
          });
        } else if (typeof externals === 'string') {
          availableThemes['External Stylesheet'] = this.appConfig.externalStyleSheet;
        } else {
          ErrorHandler('External stylesheets must be of type string or string[]');
        }
      }
      return availableThemes;
    },
    /* Combines all theme names for dropdown (built-in, user-defined and stylesheets) */
    themeNames() {
      const externalThemeNames = Object.keys(this.externalThemes);
      return [...this.extraThemeNames, ...externalThemeNames, ...builtInThemes];
    },
  },
  watch: {
    /* When theme in VueX store changes, then update theme */
    themeFromStore(newTheme) {
      if (newTheme) {
        this.resetToDefault();
        this.selectedTheme = newTheme;
        this.updateTheme(newTheme);
      }
    },
  },
  methods: {
    /* Called when user changes theme through the UI
     * Updates store, which will in turn update theme through watcher
     */
    themeChangedInUI() {
      this.$store.commit(Keys.SET_THEME, this.selectedTheme); // Update store
      this.updateTheme(this.selectedTheme); // Apply theme to UI
    },
    /**
     * Gets any custom styles the user has applied, wither from local storage, or from the config
     * @returns {object} An array of objects, one for each theme, containing kvps for variables
     */
    getCustomColors() {
      const localColors = JSON.parse(localStorage[localStorageKeys.CUSTOM_COLORS] || '{}');
      const configColors = this.appConfig.customColors || {};
      return Object.assign(configColors, localColors);
    },
    /* Gets user custom color preferences for current theme, and applies to DOM */
    applyCustomVariables(theme) {
      mainCssVars.forEach((vName) => { document.documentElement.style.removeProperty(`--${vName}`); });
      const themeColors = this.getCustomColors()[theme];
      if (themeColors) {
        Object.keys(themeColors).forEach((customVar) => {
          document.documentElement.style.setProperty(`--${customVar}`, themeColors[customVar]);
        });
      }
    },
    /* Sets the theme, by updating data-theme attribute on the html tag */
    applyLocalTheme(newTheme) {
      const htmlTag = document.getElementsByTagName('html')[0];
      if (htmlTag.hasAttribute('data-theme')) htmlTag.removeAttribute('data-theme');
      htmlTag.setAttribute('data-theme', newTheme);
    },
    /* If using an external stylesheet, load it in */
    applyRemoteTheme(href) {
      this.resetToDefault();
      const element = document.createElement('link');
      element.setAttribute('rel', 'stylesheet');
      element.setAttribute('type', 'text/css');
      element.setAttribute('id', 'user-defined-stylesheet');
      element.setAttribute('href', href);
      document.getElementsByTagName('head')[0].appendChild(element);
    },
    /* Determines if a given theme is local / not a custom user stylesheet */
    isThemeLocal(themeToCheck) {
      const localThemes = [...builtInThemes, ...this.extraThemeNames];
      return localThemes.includes(themeToCheck);
    },
    /* Updates theme. Checks if the new theme is local or external,
    and calls appropriate updating function. Updates local storage */
    updateTheme(newTheme) {
      if (newTheme.toLowerCase() === 'default') {
        this.resetToDefault();
      } else if (this.isThemeLocal(newTheme)) {
        this.applyLocalTheme(newTheme);
      } else if (this.externalThemes[newTheme]) {
        this.applyRemoteTheme(this.externalThemes[newTheme]);
      }
      this.applyCustomVariables(newTheme);
    },
    /* Removes any applied themes, and deletes any externally loaded stylesheets */
    resetToDefault() {
      const externalStyles = document.getElementById('user-defined-stylesheet');
      if (externalStyles) document.getElementsByTagName('head')[0].removeChild(externalStyles);
      document.getElementsByTagName('html')[0].removeAttribute('data-theme');
    },
    /* Call within mounted hook within a page to apply the correct theme */
    initializeTheme() {
      const initialTheme = this.themeFromStore;
      this.selectedTheme = initialTheme;
      const hasExternal = this.externalThemes && Object.entries(this.externalThemes).length > 0;

      if (this.isThemeLocal(initialTheme)) {
        this.updateTheme(initialTheme);
      } else if (hasExternal) {
        this.applyRemoteTheme(this.externalThemes[initialTheme]);
      }
    },
  },
};

export default ThemingMixin;
