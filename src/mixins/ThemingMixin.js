/**
 * Provides dropdown state + computed theme list for components that let the user
 * pick a theme (ThemeSelector, CustomThemeMaker, etc). The actual DOM
 * application of themes is handled centrally in App.vue via a watcher on
 * `$store.getters.theme`, so this mixin deliberately does no DOM work.
 */

import Keys from '@/utils/StoreMutations';
import { builtInThemes } from '@/utils/config/defaults';
import { getExternalThemes, getExtraThemeNames } from '@/utils/Theming';

export default {
  data: () => ({ selectedTheme: '' }),
  computed: {
    appConfig() { return this.$store.getters.appConfig; },
    themeFromStore() { return this.$store.getters.theme; },
    externalThemes() { return getExternalThemes(this.appConfig); },
    extraThemeNames() { return getExtraThemeNames(this.appConfig); },
    themeNames() {
      return [...this.extraThemeNames, ...Object.keys(this.externalThemes), ...builtInThemes];
    },
  },
  watch: {
    themeFromStore: { immediate: true, handler(t) { this.selectedTheme = t; } },
  },
  methods: {
    /* Called when the user picks a theme in the dropdown — store commit
     * triggers the central watcher in App.vue to apply to the DOM. */
    themeChangedInUI() {
      this.$store.commit(Keys.SET_THEME, this.selectedTheme);
    },
  },
};
