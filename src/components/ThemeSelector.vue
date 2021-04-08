<template>
  <div class="theme-selector-section" v-if="themes" >
    <span class="theme-label">Themes</span>
    <v-select :options="themeNames" v-model="selectedTheme" label="Theme" class="theme-dropdown" />
  </div>
</template>

<script>

import ThemeHelper from '@/utils/ThemeHelper';

export default {
  name: 'ThemeSelector',
  props: {
    themes: Object,
  },
  watch: {
    selectedTheme(newTheme) {
      this.themeHelper.theme = newTheme;
    },
  },
  data() {
    return {
      selectedTheme: 'Default',
      themeHelper: new ThemeHelper(),
      loading: true,
    };
  },
  computed: {
    themeNames: function themeNames() { return Object.keys(this.themes); },
  },
  created() {
    const added = Object.keys(this.themes).map(
      name => this.themeHelper.add(name, this.themes[name]),
    );
    Promise.all(added).then(sheets => {
      console.log(`${sheets.length} themes loaded`);
      this.loading = false;
      this.themeHelper.theme = 'Deafault';
    });
  },
};
</script>

<style lang="scss">

@import '../../src/styles/color-pallet.scss';
@import 'vue-select/src/scss/vue-select.scss';

.theme-dropdown {
  div.vs__dropdown-toggle {
    border-color: var(--primary);
    min-width: 10rem;
    height: 2rem;
  }
  span.vs__selected, li.vs__dropdown-option {
    color: var(--primary);
  }
  button.vs__clear, svg.vs__open-indicator {
    fill: var(--primary);
  }
  ul.vs__dropdown-menu {
    width: auto;
    background: var(--background);
  }
  li.vs__dropdown-option--highlight {
    background: var(--primary);
    color: var(--background);
  }
}

.theme-selector-section {
  display: flex;
  flex-direction: column;
  opacity: 0.8;
  span.theme-label {
    font-size: 0.8rem;
    color: var(--primary);
    margin: 1px 0 2px 0;
  }
  &:hover {
    opacity: 1;
  }
}

</style>
