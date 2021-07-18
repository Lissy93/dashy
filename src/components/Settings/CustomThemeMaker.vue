<template>
  <div :class="`theme-configurator-wrapper ${showingAllVars ? 'showing-all' : ''}`">
    <h3 class="configurator-title">Theme Configurator</h3>
    <div class="color-row-container">
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
        :value="customColors[colorName]"
        class="misc-input"
        @input="setVariable(colorName, customColors[colorName])"
      />
    </div> <!-- End of color list -->
    </div>
    <p @click="exportToClipboard" class="action-text-btn">
      Export Custom Variables
    </p>
    <p @click="resetAndSave" class="action-text-btn show-all-vars-btn">
      Reset Styles for '{{ themeToEdit }}'
    </p>
    <p @click="findAllVariableNames" class="action-text-btn">
      Show All Variables
    </p>
    <div class="action-buttons">
      <Button :click="saveChanges"><SaveIcon />Save</Button>
      <Button :click="resetUnsavedColors"><CancelIcon />Cancel</Button>
    </div>
  </div>
</template>

<script>
import VSwatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.css';
import { localStorageKeys, mainCssVars } from '@/utils/defaults';

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
    /* Saves the users omdified variables in local storage */
    saveChanges() {
      const priorSettings = JSON.parse(localStorage[localStorageKeys.CUSTOM_COLORS] || '{}');
      priorSettings[this.themeToEdit] = this.customColors;
      localStorage.setItem(localStorageKeys.CUSTOM_COLORS, JSON.stringify(priorSettings));
      this.$toasted.show('Theme Updates Succesfully');
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
      this.$toasted.show(`Custom Colors for ${this.themeToEdit} Removed`);
    },
    /* Generates CSS for the currently applied variables, and copys to users clipboard */
    exportToClipboard() {
      const themeName = this.themeToEdit.replace(/^\w/, c => c.toUpperCase());
      let clipboardText = `// Custom Colors for ${themeName}\n`;
      Object.keys(this.customColors).forEach((customVar) => {
        clipboardText += (`--${customVar}: ${this.customColors[customVar]};\n`);
      });
      navigator.clipboard.writeText(clipboardText);
      this.$toasted.show(`Theme data for ${themeName} copied to clipboard`);
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
    /* Find all available CSS variables for the current applied theme */
    findAllVariableNames() {
      const availableVariables = Array.from(document.styleSheets)
        .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
        .reduce(
          ((acc, sheet) => ([
            ...acc,
            ...Array.from(sheet.cssRules).reduce(
              (def, rule) => (rule.selectorText === ':root'
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
      const hexToRgb = (hex) => {
        const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!colorParts || colorParts.length < 3) return 'black';
        const parse = (index) => parseInt(colorParts[index], 16);
        return colorParts ? { r: parse(1), g: parse(2), b: parse(3) } : null;
      };
      const getLightness = (rgb) => (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
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
  max-height: 28rem;
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
    max-height: 16rem;
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
