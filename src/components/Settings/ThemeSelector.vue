<template>
  <div class="theme-selector-section" v-click-outside="closeThemeConfigurator">
    <div>
    <span class="theme-label">{{ $t('settings.theme-label') }}</span>
    <v-select
      :options="themeNames"
      v-model="selectedTheme"
      class="theme-dropdown"
      :tabindex="-2"
    />
    </div>
    <IconPalette
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
import IconPalette from '@/assets/interface-icons/config-color-palette.svg';

export default {
  name: 'ThemeSelector',
  props: {
    externalThemes: Object,
    confTheme: String,
    userThemes: Array,
  },
  components: {
    CustomThemeMaker,
    IconPalette,
  },
  watch: {
    /* When the theme changes, then call the update method */
    selectedTheme(newTheme) {
      this.updateTheme(newTheme);
    },
  },
  data() {
    return {
      selectedTheme: this.getInitialTheme(),
      builtInThemes: [...Defaults.builtInThemes, ...this.userThemes],
      themeHelper: new LoadExternalTheme(),
      themeConfiguratorOpen: false, // Control the opening of theme config popup
      ApplyLocalTheme,
      ApplyCustomVariables,
    };
  },
  computed: {
    /* Combines all theme names (builtin and user defined) together */
    themeNames: function themeNames() {
      const externalThemeNames = Object.keys(this.externalThemes);
      const specialThemes = ['custom'];
      return [...externalThemeNames, ...this.builtInThemes, ...specialThemes];
    },
  },
  created() {
    // Pass all user custom stylesheets to the themehelper
    const added = Object.keys(this.externalThemes).map(
      name => this.themeHelper.add(name, this.externalThemes[name]),
    );
    // Quicker loading, if the theme is local we can apply it immidiatley
    if (this.isThemeLocal(this.selectedTheme)) {
      this.updateTheme(this.selectedTheme);
    // If it's an external stylesheet, then wait for promise to resolve
    } else if (this.selectedTheme !== Defaults.theme) {
      Promise.all(added).then(() => {
        this.updateTheme(this.selectedTheme);
      });
    }
  },
  methods: {
    /* Get default theme */
    getInitialTheme() {
      return localStorage[localStorageKeys.THEME] || this.confTheme || Defaults.theme;
    },
    /* Determines if a given theme is local / not a custom user stylesheet */
    isThemeLocal(themeToCheck) {
      return this.builtInThemes.includes(themeToCheck);
    },
    /* Opens the theme color configurator popup */
    openThemeConfigurator() {
      this.$emit('modalChanged', true);
      this.themeConfiguratorOpen = true;
    },
    /* Closes the theme color configurator popup */
    closeThemeConfigurator() {
      // this.$emit('modalChanged', false);
      this.themeConfiguratorOpen = false;
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
      localStorage.setItem(localStorageKeys.THEME, newTheme);
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
    z-index: 5;
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
