<template>
  <div :class="`theme-configurator-wrapper ${showingAllVars ? 'showing-all' : ''}`">
    <h3 class="configurator-title">{{ $t('theme-maker.title') }}</h3>
    <div class="color-row-container">
      <!-- Show color swatch input for each color -->
      <div class="color-row" v-for="colorName in Object.keys(customColors)" :key="colorName">
        <label :for="`color-input-${colorName}`" class="color-name">
          {{colorName.replaceAll('-', ' ')}}
        </label>
        <v-swatches
          v-if="isColor(colorName, customColors[colorName])"
          v-model="customColors[colorName]"
          show-fallback
          fallback-input-type="color"
          popover-x="left"
          :swatches="swatches"
          @input="setVariable(colorName, customColors[colorName])"
        >
          <input
            :id="`color-input-${colorName}`"
            slot="trigger"
            :value="customColors[colorName]"
            class="swatch-input form__input__element"
            readonly
            :style="makeSwatchStyles(colorName)"
          />
        </v-swatches>
        <input v-else
          :id="`color-input-${colorName}`"
          v-model="customColors[colorName]"
          :class="`misc-input ${isTextual(colorName, customColors[colorName]) ? 'long-input' : ''}`"
          @input="setVariable(colorName, customColors[colorName])"
        />
      </div> <!-- End of color list -->
    </div>
    <!-- More options: Export, Reset, Show all -->
    <p @click="showFontVariables" class="action-text-btn show-all-vars-btn">
        {{ $t('theme-maker.change-fonts-button') }}
    </p>
    <p @click="findAllVariableNames" class="action-text-btn show-all-vars-btn">
       {{ $t('theme-maker.show-all-button') }}
    </p>
    <p @click="exportToClipboard" class="action-text-btn">
      {{ $t('theme-maker.export-button') }}
    </p>
    <p @click="resetAndSave" class="action-text-btn">
       {{ $t('theme-maker.reset-button') }} '{{ themeToEdit }}'
    </p>
    <!-- Save and cancel buttons -->
    <div class="action-buttons">
      <Button :click="saveChanges">
        <SaveIcon /> {{ $t('theme-maker.save-button') }}
      </Button>
      <Button :click="resetUnsavedColors">
        <CancelIcon /> {{ $t('theme-maker.cancel-button') }}
      </Button>
    </div>
  </div>
</template>

<script>
import VSwatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.css';
import StoreKeys from '@/utils/StoreMutations';
import { localStorageKeys, mainCssVars, swatches } from '@/utils/defaults';
import Button from '@/components/FormElements/Button';
import SaveIcon from '@/assets/interface-icons/save-config.svg';
import CancelIcon from '@/assets/interface-icons/config-cancel.svg';

export default {
  name: 'ThemeMaker',
  components: {
    VSwatches,
    Button,
    SaveIcon,
    CancelIcon,
  },
  data() {
    return {
      customColors: this.makeInitialData(mainCssVars),
      showingAllVars: false,
      swatches,
    };
  },
  props: {
    themeToEdit: String,
  },
  methods: {
    /* Finds the current dominent value for a given CSS variable */
    getCssVariableValue(cssVar) {
      return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || 'inherit';
    },
    /* Sets the value to a given variable in the DOM */
    setVariable(variable, value) {
      document.documentElement.style.setProperty(`--${variable}`, value);
    },
    /* Updates browser storage, and srore with new color settings, and shows success msg */
    saveChanges() {
      const priorSettings = JSON.parse(localStorage[localStorageKeys.CUSTOM_COLORS] || '{}');
      priorSettings[this.themeToEdit] = this.customColors;
      localStorage.setItem(localStorageKeys.CUSTOM_COLORS, JSON.stringify(priorSettings));
      this.$store.commit(StoreKeys.SET_CUSTOM_COLORS, priorSettings);
      this.$toasted.show(this.$t('theme-maker.saved-toast', { theme: this.themeToEdit }));
      this.$emit('closeThemeConfigurator');
    },
    /* Itterates over available variables, removing them from the DOM */
    resetUnsavedColors() {
      const variables = Object.keys(this.customColors);
      variables.forEach((variable) => {
        document.documentElement.style.removeProperty(`--${variable}`);
      });
      this.customColors = this.makeInitialData(mainCssVars);
      this.$emit('closeThemeConfigurator');
    },
    /* Resets styles, and removes data for current theme from local storage */
    resetAndSave() {
      const priorSettings = JSON.parse(localStorage[localStorageKeys.CUSTOM_COLORS] || '{}');
      delete priorSettings[this.themeToEdit];
      localStorage.setItem(localStorageKeys.CUSTOM_COLORS, JSON.stringify(priorSettings));
      this.resetUnsavedColors();
      this.$toasted.show(this.$t('theme-maker.reset-toast', { theme: this.themeToEdit }));
    },
    /* Generates CSS for the currently applied variables, and copys to users clipboard */
    exportToClipboard() {
      const themeName = this.themeToEdit.replace(/^\w/, c => c.toUpperCase());
      let clipboardText = `// Custom Colors for ${themeName}\n`;
      Object.keys(this.customColors).forEach((customVar) => {
        clipboardText += (`--${customVar}: ${this.customColors[customVar]};\n`);
      });
      navigator.clipboard.writeText(clipboardText);
      this.$toasted.show(this.$t('theme-maker.copied-toast', { theme: themeName }));
    },
    /* Returns a JSON object, with the variable name as key, and color as value */
    makeInitialData(variableArray) {
      const data = {};
      const hasDash = (colorVar) => (/^--/.exec(colorVar));
      const addDash = (colorVar) => (hasDash(colorVar) ? colorVar : `--${colorVar}`);
      const removeDash = (colorVar) => (hasDash(colorVar) ? colorVar.replace('--', '') : colorVar);
      variableArray.forEach((colorName) => {
        data[removeDash(colorName)] = this.getCssVariableValue(addDash(colorName));
      });
      return data;
    },
    /* Adds font variables to list */
    showFontVariables() {
      const currentVariables = this.customColors;
      const fonts = ['font-headings', 'font-body', 'font-monospace'];
      const fontVariables = this.makeInitialData(fonts);
      this.customColors = { ...currentVariables, ...fontVariables };
    },
    /* Find all available CSS variables for the current applied theme */
    findAllVariableNames() {
      const availableVariables = Array.from(document.styleSheets)
        .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
        .reduce(
          ((acc, sheet) => ([
            ...acc,
            ...Array.from(sheet.cssRules).reduce(
              (def, rule) => (rule.selectorText === ':root' || rule.selectorText === 'html'
                ? [...def, ...Array.from(rule.style).filter(name => name.startsWith('--'))] : def),
              [],
            ),
          ])),
          [],
        );
      this.customColors = this.makeInitialData(availableVariables);
      this.showingAllVars = true;
    },
    /* Returns a complmenting text color for the palete input foreground */
    /* White if the color is dark, otherwise black */
    getForegroundColor(colorHex) {
      /* Converts a 3-digit hex code to a 6-digit hex code (e.g. #f01 --> #ff0011) */
      const threeToSix = (hex) => {
        let digit = hex;
        digit = digit.split('').map((item) => (item === '#' ? item : item + item)).join('');
        return digit;
      };
      /* Converts hex code to RGB (e.g. #ff0011 --> rgb(255,0,0) ) */
      const hexToRgb = (hex) => {
        let hexCode = hex.slice(0, 7);
        if (hex.startsWith('#') && hex.length === 4) hexCode = threeToSix(hexCode);
        const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexCode);
        if (!colorParts || colorParts.length < 3) return 'black';
        const parse = (index) => parseInt(colorParts[index], 16);
        return colorParts ? { r: parse(1), g: parse(2), b: parse(3) } : null;
      };
      /* Given an RGB value, return the lightness ratio */
      const getLightness = (rgb) => (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      if (!colorHex.startsWith('#')) return 'white'; // Not a hex, do nothing
      // Convert hex to RGB obj, get lightness, and return opposing color
      return getLightness(hexToRgb(colorHex.trim())) < 100 ? 'white' : 'black';
    },
    /* The contents of the style attribute, to set background and text color of swatch */
    makeSwatchStyles(colorName) {
      const contrastingColor = this.getForegroundColor(this.customColors[colorName]);
      return `background:${this.customColors[colorName]};`
      + `color:${contrastingColor}; border: 1px solid ${contrastingColor}`;
    },
    /* Determines if a given variable should NOT use the color picker component */
    isColor(variableName, variableValue) {
      // If value is a dimension, then it aint a color
      if ((/rem|px|%/.exec(variableValue))) return false;
      const nonColorVariables = [ // Known non-color variables
        '--font-headings', '--font-body', '--font-monospace',
        '--curve-factor', '--curve-factor-navbar', '--curve-factor-small',
        '--dimming-factor', '--scroll-bar-width', '--header-height', '--footer-height',
        '--item-group-padding', '--item-shadow', '--item-hover-shadow:', '--item-icon-transform',
        '--item-icon-transform-hover', '--item-group-shadow', '--context-menu-shadow',
        '--settings-container-shadow', '--side-bar-width',
      ];
      // If the variable name is known to not be a color (in above list)
      if (nonColorVariables.includes(`--${variableName}`)) return false;
      return true; // It must be a color, we'll use the color picker
    },
    /* Determine if a given key is that of a known font variable, or has a long value */
    isTextual(varName, varValue) {
      return varName.startsWith('font-') || (varValue && varValue.length > 12);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';

div.theme-configurator-wrapper {
  position: absolute;
  top: 4rem;
  right: 1rem;
  width: 16rem;
  min-height: 12rem;
  max-height: 32rem;
  padding: 0.5rem;
  z-index: 5;
  overflow-y: visible;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  border-radius: var(--curve-factor);
  box-shadow: 0 8px 10px -2px rgba(0, 0, 0, 0.6), 1px 1px 6px var(--primary);

  h3.configurator-title {
    text-align: center;
    font-weight: normal;
    margin: 0.4rem;
  }

  div.color-row-container {
    max-height: 20rem;
    overflow-y: visible;
    @extend .scroll-bar;
    div.color-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.25rem 0;
      border-bottom: 1px dashed var(--primary);
      label.color-name {
        text-transform: capitalize;
      }
    }
  }

  input.swatch-input, input.misc-input {
    border: none;
    margin: 0.2rem;
    padding: 0.5rem;
    width: 4rem;
    border-radius: var(--curve-factor);
    font-family: var(--font-monospace);
    color: var(--black);
    font-weight: bold;
    cursor: pointer;
    &:hover {
      box-shadow: inset 0 0 4px 4px #00000033;
    }
    &:active {
      box-shadow: inset 0 0 4px 4px #00000080;
      outline: none;
    }
    &.long-input {
      cursor: text;
      font-style: italic;
      font-weight: 200;
      padding: 0.5rem 0.2rem;
      font-size: 0.75rem;
      width: 9rem;
      &:hover { box-shadow: none; }
    }
  }
}

p.action-text-btn {
  cursor: pointer;
  margin: 0.5rem auto 0;
  padding: 0.2rem 0.4rem;
  width: fit-content;
  text-align: center;
  text-decoration: underline;
  border-radius: var(--curve-factor);
  border: 1px solid var(--background-darker);
  &:hover {
    background: var(--background);
    border-color: var(--primary);
    text-decoration: none;
  }
  &:active {
    background: var(--primary);
    color: var(--background);
  }
  &.hide {
    display: none;
  }
}

div.action-buttons {
  display: flex;
  justify-content: center;
  button {
    min-width: 6rem;
    padding: 0.25rem 0.5rem;
    margin: 1rem 0.5rem 0.5rem;
  }
}

div.theme-configurator-wrapper.showing-all {
  overflow: auto;
  div.color-row-container {
    overflow: auto;
  }
  p.show-all-vars-btn {
    display: none;
  }
}

</style>
