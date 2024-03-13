<template>
  <div class="theme-selector-section" v-click-outside="closeThemeConfigurator">
    <div>
    <span class="theme-label">{{ $t('settings.theme-label') }}</span>
    <v-select
      :options="themeNames"
      v-model="selectedTheme"
      :value="$store.getters.theme"
      class="theme-dropdown"
      :tabindex="-2"
      @input="themeChanged"
    />
    </div>
    <IconPalette
      v-if="!hidePallete"
      class="color-button"
      @click="openThemeConfigurator"
      v-tooltip="$t('theme-maker.title')"
    />
    <CustomThemeMaker
      v-if="themeConfiguratorOpen"
      :themeToEdit="selectedTheme"
      @closeThemeConfigurator="closeThemeConfigurator()"
    />
  </div>
</template>

<script>

import CustomThemeMaker from '@/components/Settings/CustomThemeMaker';
import {
  LoadExternalTheme,
  ApplyLocalTheme,
  ApplyCustomVariables,
} from '@/utils/ThemeHelper';
import Defaults, { localStorageKeys } from '@/utils/defaults';
import Keys from '@/utils/StoreMutations';
import ErrorHandler from '@/utils/ErrorHandler';
import IconPalette from '@/assets/interface-icons/config-color-palette.svg';

export default {
  name: 'ThemeSelector',
  props: {
    hidePallete: Boolean,
  },
  components: {
    CustomThemeMaker,
    IconPalette,
  },
  watch: {
    /* When theme in VueX store changes, then update theme */
    themeFromStore(newTheme) {
      this.selectedTheme = newTheme;
      this.updateTheme(newTheme);
    },
  },
  data() {
    return {
      selectedTheme: '',
      themeConfiguratorOpen: false, // Control the opening of theme config popup
      themeHelper: new LoadExternalTheme(),
      ApplyLocalTheme,
      ApplyCustomVariables,
    };
  },
  computed: {
    /* Get appConfig from store */
    appConfig() {
      return this.$store.getters.appConfig;
    },
    /* Get users theme from store */
    themeFromStore() {
      return this.$store.getters.theme;
    },
    /* Combines all theme names (builtin and user defined) together */
    themeNames: function themeNames() {
      const externalThemeNames = Object.keys(this.externalThemes);
      const specialThemes = ['custom'];
      return [...this.extraThemeNames, ...externalThemeNames,
        ...Defaults.builtInThemes, ...specialThemes];
    },
    extraThemeNames() {
      const userThemes = this.appConfig.cssThemes || [];
      if (typeof userThemes === 'string') return [userThemes];
      return userThemes;
    },
    /* Returns an array of links to external CSS from the Config */
    externalThemes() {
      const availibleThemes = {};
      if (this.appConfig && this.appConfig.externalStyleSheet) {
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
      // availibleThemes.Default = '#';
      return availibleThemes;
    },
  },
  mounted() {
    const initialTheme = this.getInitialTheme();
    this.selectedTheme = initialTheme;
    // Quicker loading, if the theme is local we can apply it immidiatley
    if (this.isThemeLocal(initialTheme)) {
      this.updateTheme(initialTheme);
    }

    // If it's an external stylesheet, then wait for promise to resolve
    if (this.externalThemes && Object.entries(this.externalThemes).length > 0) {
      const added = Object.keys(this.externalThemes).map(
        name => this.themeHelper.add(name, this.externalThemes[name]),
      );
      // Once, added, then apply users initial theme
      Promise.all(added).then(() => {
        this.updateTheme(initialTheme);
      });
    }
  },
  methods: {
    /* Called when dropdown changed
     * Updates store, which will in turn update theme through watcher
     */
    themeChanged() {
      const pageId = this.$store.state.currentConfigInfo?.pageId || null;
      this.$store.commit(Keys.SET_THEME, { theme: this.selectedTheme, pageId });
      this.updateTheme(this.selectedTheme);
    },
    /* Returns the initial theme */
    getInitialTheme() {
      const localTheme = localStorage[localStorageKeys.THEME];
      if (localTheme && localTheme !== 'undefined') return localTheme;
      return this.appConfig.theme || Defaults.theme;
    },
    /* Determines if a given theme is local / not a custom user stylesheet */
    isThemeLocal(themeToCheck) {
      const localThemes = [...Defaults.builtInThemes, ...this.extraThemeNames];
      return localThemes.includes(themeToCheck);
    },
    /* Opens the theme color configurator popup */
    openThemeConfigurator() {
      this.$store.commit(Keys.SET_MODAL_OPEN, true);
      this.themeConfiguratorOpen = true;
    },
    /* Closes the theme color configurator popup */
    closeThemeConfigurator() {
      if (this.themeConfiguratorOpen) {
        this.$store.commit(Keys.SET_MODAL_OPEN, false);
        this.themeConfiguratorOpen = false;
      }
    },
    /* Updates theme. Checks if the new theme is local or external,
    and calls appropirate updating function. Updates local storage */
    updateTheme(newTheme) {
      if (newTheme === 'Default') {
        this.resetToDefault();
        this.themeHelper.theme = 'Default';
      } else if (this.isThemeLocal(newTheme)) {
        this.ApplyLocalTheme(newTheme);
      } else {
        this.themeHelper.theme = newTheme;
      }
      this.ApplyCustomVariables(newTheme);
      // localStorage.setItem(localStorageKeys.THEME, newTheme);
    },
    /* Removes any applied themes */
    resetToDefault() {
      document.getElementsByTagName('html')[0].removeAttribute('data-theme');
    },
  },
};
</script>

<style lang="scss">

@import 'vue-select/src/scss/vue-select.scss';
@import '@/styles/style-helpers.scss';

.theme-dropdown {
  div.vs__dropdown-toggle {
    border-color: var(--settings-text-color);
    border-radius: var(--curve-factor);
    min-width: 8rem;
    max-width: 16rem;
    height: 1.8rem;
    font-size: 0.85rem;
    cursor: pointer;
  }
  span.vs__selected, li.vs__dropdown-option {
    color: var(--settings-text-color);
    text-transform: capitalize;
  }
  svg.vs__open-indicator {
    fill: var(--settings-text-color);
  }
  ul.vs__dropdown-menu {
    width: auto;
    z-index: 12;
    max-width: 13rem;
    overflow-x: hidden;
    @extend .scroll-bar;
    background: var(--background);
    border-radius: var(--curve-factor);
    border-top: 1px solid var(--settings-text-color);
  }
  li.vs__dropdown-option--highlight {
    background: var(--settings-text-color);
    color: var(--background);
  }
  button.vs__clear {
    display: none;
  }
}

.theme-selector-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  span.theme-label {
    font-size: 1rem;
    color: var(--settings-text-color);
    margin: 1px 0 2px 0;
  }
}

svg.color-button {
  path {
    fill: var(--settings-text-color);
  }
  width: 1rem;
  height: 1rem;
  padding: 0.2rem;
  margin: 0.5rem;
  align-self: flex-end;
  text-align: center;
  background: var(--background);
  border: 1px solid var(--settings-text-color);;
  border-radius: var(--curve-factor);
  cursor: pointer;
  &:hover, &.selected {
    background: var(--settings-text-color);
    path { fill: var(--background); }
  }
}

</style>
