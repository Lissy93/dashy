<template>
  <div class="theme-selector-section" v-if="themes" v-click-outside="closeThemeConfigurator">
    <div>
    <span class="theme-label">Theme</span>
    <v-select
      :options="themeNames"
      v-model="selectedTheme"
      class="theme-dropdown"
      :tabindex="-2"
    />
    </div>
    <IconPalette
      class="color-button"
      v-if="selectedTheme === 'custom'"
      @click="openThemeConfigurator"
    />
    <div
      v-if="themeConfiguratorOpen"
      class="theme-configurator-wrapper"
    >
      <p>Custom Theme Configurator</p>
    </div>
  </div>
</template>

<script>

import { LoadExternalTheme, ApplyLocalTheme, ApplyCustomTheme } from '@/utils/ThemeHelper';
import Defaults, { localStorageKeys } from '@/utils/defaults';
import IconPalette from '@/assets/interface-icons/config-color-palette.svg';

export default {
  name: 'ThemeSelector',
  props: {
    themes: Object,
    confTheme: String,
    userThemes: Array,
  },
  components: {
    IconPalette,
  },
  watch: {
    selectedTheme(newTheme) { this.updateTheme(newTheme); },
  },
  data() {
    return {
      selectedTheme: this.getInitialTheme(),
      builtInThemes: [...Defaults.builtInThemes, ...this.userThemes],
      themeHelper: new LoadExternalTheme(),
      // modalName: modalNames.THEME_MAKER,
      themeConfiguratorOpen: false,
      ApplyLocalTheme,
      ApplyCustomTheme,
    };
  },
  computed: {
    themeNames: function themeNames() {
      const externalThemeNames = Object.keys(this.themes);
      const specialThemes = ['custom'];
      return [...specialThemes, ...externalThemeNames, ...this.builtInThemes];
    },
  },
  created() {
    const added = Object.keys(this.themes).map(
      name => this.themeHelper.add(name, this.themes[name]),
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
    isThemeLocal(themeToCheck) {
      return this.builtInThemes.includes(themeToCheck);
    },
    openThemeConfigurator() {
      this.themeConfiguratorOpen = true;
    },
    closeThemeConfigurator() {
      this.themeConfiguratorOpen = false;
    },
    /* Updates theme. Checks if the new theme is local or external,
    and calls appropirate updating function. Updates local storage */
    updateTheme(newTheme) {
      if (newTheme === 'custom') {
        this.ApplyCustomTheme();
      } else if (newTheme === 'Deafault') {
        this.resetToDefault();
        this.themeHelper.theme = 'Deafault';
      } else if (this.isThemeLocal(newTheme)) {
        this.ApplyLocalTheme(newTheme);
      } else {
        this.themeHelper.theme = newTheme;
      }
      localStorage.setItem(localStorageKeys.THEME, newTheme);
    },
    resetToDefault() {
      document.getElementsByTagName('html')[0].removeAttribute('data-theme');
    },
  },
};
</script>

<style lang="scss">

@import 'vue-select/src/scss/vue-select.scss';

.theme-dropdown {
  div.vs__dropdown-toggle {
    border-color: var(--settings-text-color);
    border-radius: var(--curve-factor);
    width: 8rem;
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
    background: var(--background);
    z-index: 5;
    max-width: 13rem;
    overflow-x: hidden;
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

div.theme-configurator-wrapper {
  position: absolute;
  right: 2rem;
  top: 3rem;
  width: 30%;
  height: 50%;
  padding: 0.5rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  border-radius: var(--curve-factor);
  box-shadow: 0 8px 10px -2px rgba(0, 0, 0, 0.6), 1px 1px 6px var(--primary);
}

</style>
