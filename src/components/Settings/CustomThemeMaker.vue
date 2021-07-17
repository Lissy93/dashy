<template>
  <div class="theme-configurator-wrapper">
    <h3 class="configurator-title">Custom Configurator</h3>
    <div class="color-row" v-for="colorName in Object.keys(customColors)" :key="colorName">
      <label :for="`color-input-${colorName}`" class="color-name">
        {{colorName.replace('-', ' ')}}
      </label>
      <v-swatches
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
    </div> <!-- End of color list -->
    <p class="show-more-variables" @click="findAllVariableNames">Show All Variables</p>
    <div class="action-buttons">
      <Button><SaveIcon />Save</Button>
      <Button :click="resetUnsavedColors"><CancelIcon />Cancel</Button>
    </div>
  </div>
</template>

<script>
import VSwatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.css';

import Button from '@/components/FormElements/Button';
import SaveIcon from '@/assets/interface-icons/save-config.svg';
import CancelIcon from '@/assets/interface-icons/config-cancel.svg';

const mainVariables = ['primary', 'background', 'background-darker'];

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
      customColors: this.makeInitialData(mainVariables),
    };
  },
  methods: {
    /* Sets the value to a given variable in the DOM */
    setVariable(variable, value) {
      document.documentElement.style.setProperty(`--${variable}`, value);
    },
    /* Itterates over available variables, removing them from the DOM */
    resetUnsavedColors() {
      const variables = Object.keys(this.customColors);
      variables.forEach((variable) => {
        document.documentElement.style.removeProperty(`--${variable}`);
      });
      this.$emit('closeThemeConfigurator');
    },
    /* Finds the current dominent value for a given CSS variable */
    getCssVariableValue(cssVar) {
      return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || 'inherit';
    },
    /* Returns a JSON object, with the variable name as key, and color as value */
    makeInitialData(variableArray) {
      const data = {};
      const addDash = (colorVar) => (/^--/.exec(colorVar) ? colorVar : `--${colorVar}`);
      variableArray.forEach((colorName) => {
        data[colorName.replace('--', '')] = this.getCssVariableValue(addDash(colorName));
      });
      return data;
    },
    /* If a builtin theme is applied, grab it's colors */
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
    },
    /* Returns a complmenting text color for the palete foreground */
    /* White if the color is dark, otherwise black */
    getForegroundColor(colorHex) {
      const hexToRgb = (hex) => {
        const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!colorParts || colorParts.length < 3) return 'pink';
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
  },
};
</script>

<style lang="scss">

div.theme-configurator-wrapper {
  position: absolute;
  top: 4rem;
  right: 1rem;
  width: 16rem;
  min-height: 12rem;
  max-height: 20rem;
  padding: 0.5rem;
  z-index: 5;
  overflow-y: auto;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  border-radius: var(--curve-factor);
  box-shadow: 0 8px 10px -2px rgba(0, 0, 0, 0.6), 1px 1px 6px var(--primary);

  h3.configurator-title {
    text-align: center;
    font-weight: normal;
    margin: 0.4rem;
  }

  div.color-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0;
    &:not(:last-child) { border-bottom: 1px dashed var(--primary); }
    label.color-name {
      text-transform: capitalize;
    }
  }

  input.swatch-input {
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

p.show-more-variables {
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
}

div.action-buttons {
  display: flex;
  button {
    min-width: 6rem;
    padding: 0.25rem 0.5rem;
    margin: 1rem 0.5rem 0.5rem;
  }
}

</style>
