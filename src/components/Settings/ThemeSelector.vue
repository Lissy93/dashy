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
      @input="themeChangedInUI"
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
import Keys from '@/utils/StoreMutations';
import IconPalette from '@/assets/interface-icons/config-color-palette.svg';
import ThemingMixin from '@/mixins/ThemingMixin';

export default {
  name: 'ThemeSelector',
  mixins: [ThemingMixin],
  props: {
    hidePallete: Boolean,
  },
  components: {
    CustomThemeMaker,
    IconPalette,
  },
  data() {
    return {
      themeConfiguratorOpen: false, // Control the opening of theme config popup
    };
  },
  computed: {},
  mounted() {
    this.initializeTheme();
  },
  methods: {
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
