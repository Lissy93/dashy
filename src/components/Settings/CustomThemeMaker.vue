<template>
  <div class="theme-configurator-wrapper">
    <h3 class="configurator-title">Custom Configurator</h3>
    <div class="color-row">
      <label for="col">Primary</label>
      <v-swatches
        v-model="color"
        show-fallback
        fallback-input-type="color"
        popover-x="left"
      >
      <input
        id="col"
        slot="trigger"
        :value="color"
        class="swatch-input form__input__element"
        readonly
        :style="`background:${color}; color: ${getForegroundColor(color)};`"
      />
      </v-swatches>
    </div>
  </div>
</template>

<script>
import VSwatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.css';

export default {
  name: 'ThemeMaker',
  components: {
    VSwatches,
  },
  data: () => ({
    color: '#A463BF',
  }),
  methods: {
    /* Returns a complmenting text color for the palete foreground */
    /* White if the color is dark, otherwise black */
    getForegroundColor(colorHex) {
      const hexToRgb = (hex) => {
        const colorParts = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        const parse = (index) => parseInt(colorParts[index], 16);
        return colorParts ? { r: parse(1), g: parse(2), b: parse(3) } : null;
      };
      const getLightness = (rgb) => (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
      return getLightness(hexToRgb(colorHex)) < 100 ? 'white' : 'black';
    },
    /* If a builtin theme is applied, grab it's colors */
    getAllThemeNames() {
      Array.from(document.styleSheets) // Get all stylesheets, filter out irrelevant ones
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
    },
  },
};
</script>

<style lang="scss">

div.theme-configurator-wrapper {
  position: absolute;
  right: 6rem;
  top: 3rem;
  width: 12rem;
  min-height: 12rem;
  padding: 0.5rem;
  z-index: 5;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  border-radius: var(--curve-factor);
  box-shadow: 0 8px 10px -2px rgba(0, 0, 0, 0.6), 1px 1px 6px var(--primary);

  h3.configurator-title {
    text-align: center;
    margin: 0.4rem;
  }

  div.color-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem 0;
    &:not(:last-child) { border-bottom: 1px dashed var(--primary); }
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

</style>
