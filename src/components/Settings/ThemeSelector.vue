<template>
  <div class="theme-selector-section" v-if="themes" >
    <span class="theme-label">Themes</span>
    <v-select
      :options="themeNames"
      v-model="selectedTheme"
      class="theme-dropdown"
      :tabindex="2"
    />
  </div>
</template>

<script>

import ThemeHelper from '@/utils/ThemeHelper';
import Defaults from '@/utils/defaults';

export default {
  name: 'ThemeSelector',
  props: {
    themes: Object,
    confTheme: String,
  },
  watch: {
    selectedTheme(newTheme) { this.updateTheme(newTheme); },
  },
  data() {
    return {
      selectedTheme: this.getInitialTheme(),
      themeHelper: new ThemeHelper(),
      loading: true,
      builtInThemes: Defaults.builtInThemes,
    };
  },
  computed: {
    themeNames: function themeNames() {
      const externalThemeNames = Object.keys(this.themes);
      return externalThemeNames.concat(this.builtInThemes);
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
    } else if (this.selectedTheme !== 'Default') {
      Promise.all(added).then(() => {
        this.updateTheme(this.selectedTheme);
      });
    }
  },
  methods: {
    setLocalTheme(newTheme) {
      const htmlTag = document.getElementsByTagName('html')[0];
      if (htmlTag.hasAttribute('data-theme')) htmlTag.removeAttribute('data-theme');
      htmlTag.setAttribute('data-theme', newTheme);
    },
    /* Get default theme */
    getInitialTheme() {
      return localStorage.theme || this.confTheme || Defaults.defaultTheme;
    },
    isThemeLocal(themeToCheck) {
      return this.builtInThemes.includes(themeToCheck);
    },
    /* Updates theme. Checks if the new theme is local or external,
    and calls appropirate updating function. Updates local storage */
    updateTheme(newTheme) {
      if (newTheme === 'Deafault') {
        this.resetToDefault();
        this.themeHelper.theme = 'Deafault';
      } else if (this.isThemeLocal(newTheme)) {
        this.setLocalTheme(newTheme);
      } else {
        this.themeHelper.theme = newTheme;
      }
      localStorage.setItem('theme', newTheme);
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
    min-width: 10rem;
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
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  span.theme-label {
    font-size: 1rem;
    color: var(--settings-text-color);
    margin: 1px 0 2px 0;
  }
}

</style>
