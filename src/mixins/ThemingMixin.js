// import {
//   LoadExternalTheme,
//   ApplyLocalTheme,
//   ApplyCustomVariables,
// } from '@/utils/ThemeHelper';
import { builtInThemes, localStorageKeys, mainCssVars } from '@/utils/defaults';
import Keys from '@/utils/StoreMutations';
import ErrorHandler from '@/utils/ErrorHandler';

const ThemingMixin = {
  data: () => ({
    selectedTheme: '',
    // themeHelper: new LoadExternalTheme(),
  }),
  computed: {
    themeFromStore() {
      return this.$store.getters.theme;
    },
    appConfig() {
      return this.$store.getters.appConfig;
    },
    extraThemeNames() {
      const userThemes = this.appConfig?.cssThemes || [];
      if (typeof userThemes === 'string') return [userThemes];
      return userThemes;
    },
    /* If user specified external stylesheet(s), format and return */
    externalThemes() {
      const availibleThemes = {};
      if (this.appConfig?.externalStyleSheet) {
        const externals = this.appConfig.externalStyleSheet;
        if (Array.isArray(externals)) {
          externals.forEach((ext, i) => {
            availibleThemes[`External Stylesheet ${i + 1}`] = ext;
          });
        } else if (typeof externals === 'string') {
          availibleThemes['External Stylesheet'] = this.appConfig.externalStyleSheet;
        } else {
          ErrorHandler('External stylesheets must be of type string or string[]');
        }
      }
      return availibleThemes;
    },
    /* Combines all theme names (builtin and user defined) together */
    themeNames() {
      const externalThemeNames = Object.keys(this.externalThemes);
      return [...this.extraThemeNames, ...externalThemeNames, ...builtInThemes];
    },
  },
  watch: {
    /* When theme in VueX store changes, then update theme */
    themeFromStore(newTheme) {
      this.selectedTheme = newTheme;
      this.updateTheme(newTheme);
    },
  },
  methods: {
    /* Called when user changes theme through the UI
     * Updates store, which will in turn update theme through watcher
     */
    themeChanged() {
      this.$store.commit(Keys.SET_THEME, this.selectedTheme);
      this.updateTheme(this.selectedTheme);
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
    /* Determines if a given theme is local / not a custom user stylesheet */
    isThemeLocal(themeToCheck) {
      const localThemes = [...builtInThemes, ...this.extraThemeNames];
      return localThemes.includes(themeToCheck);
    },
    /* Updates theme. Checks if the new theme is local or external,
    and calls appropirate updating function. Updates local storage */
    updateTheme(newTheme) {
      // this.themeHelper.theme = newTheme;
      if (newTheme.toLowerCase() === 'default') {
        this.resetToDefault();
      } else if (this.isThemeLocal(newTheme)) {
        this.applyLocalTheme(newTheme);
      }
      this.applyCustomVariables(newTheme);
    },
    /* Removes any applied themes */
    resetToDefault() {
      document.getElementsByTagName('html')[0].removeAttribute('data-theme');
    },
    initializeTheme() {
      const initialTheme = this.themeFromStore;
      this.selectedTheme = initialTheme;
      const hasExternal = this.externalThemes && Object.entries(this.externalThemes).length > 0;

      if (this.isThemeLocal(initialTheme)) {
        this.updateTheme(initialTheme);
      } else if (hasExternal) {
        const added = Object.keys(this.externalThemes).map(
          name => this.themeHelper.add(name, this.externalThemes[name]),
        );
        // Once, added, then apply users initial theme
        Promise.all(added).then(() => {
          this.updateTheme(initialTheme);
        });
      }
    },
  },
};

export default ThemingMixin;
