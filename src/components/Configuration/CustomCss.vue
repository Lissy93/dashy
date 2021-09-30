<template>
  <div class="css-editor-outer">
    <!-- Add raw custom CSS -->
    <div class="css-wrapper">
      <h2 class="css-input-title">Custom CSS</h2>
      <textarea class="css-editor" v-model="customCss" />
      <Button class="save-button" :click="save">{{ $t('config.css-save-btn') }}</button>
      <p class="quick-note">
        <b>{{ $t('config.css-note-label') }}:</b>
        {{ $t('config.css-note-l1') }} {{ $t('config.css-note-l2') }} {{ $t('config.css-note-l3') }}
      </p>
    </div>

    <!-- UI color configurator -->
    <CustomThemeMaker :themeToEdit="currentTheme" class="color-config" />
  </div>
</template>

<script>

import CustomThemeMaker from '@/components/Settings/CustomThemeMaker';
import Button from '@/components/FormElements/Button';
import { getTheme } from '@/utils/ConfigHelpers';
import { localStorageKeys } from '@/utils/defaults';
import { InfoHandler } from '@/utils/ErrorHandler';

export default {
  name: 'StyleEditor',
  props: {
    config: Object,
  },
  components: {
    Button,
    CustomThemeMaker,
  },
  data() {
    return {
      customCss: this.config.appConfig.customCss || '\n\n',
      currentTheme: getTheme(),
    };
  },
  methods: {
    /* Save custom CSS in browser, call inject, and show success message */
    save() {
      // Get, and sanitize users CSS
      const css = this.customCss.replace(/<\/?[^>]+(>|$)/g, '');
      // Update app config, and apply settings locally
      const appConfig = { ...this.config.appConfig };
      appConfig.customCss = css;
      localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(appConfig));
      // Immidiatley inject new CSS
      this.inject(css);
      // If reseting styles, then refresh the page
      if (css === '') setTimeout(() => { location.reload(); }, 1500); // eslint-disable-line no-restricted-globals
      // Show status message
      InfoHandler('User syles has been saved', 'Custom CSS Update');
      this.$toasted.show('Changes saved successfully');
    },
    /* Formats CSS, and applies it to page */
    inject(userStyles) {
      const cleanedCss = userStyles.replace(/<\/?[^>]+(>|$)/g, '');
      const style = document.createElement('style');
      style.textContent = cleanedCss;
      document.head.append(style);
    },
  },
};
</script>

<style lang="scss">

// Main layout
div.css-editor-outer {
  text-align: center;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;

  div.css-wrapper {
    display: flex;
    flex-direction: column;
  }
  h2.css-input-title {
    margin: 0.5rem 0 0.2rem;
  }
}

// Save button
button.save-button{
  background: var(--config-settings-color);
  color: var(--config-settings-background);
  border: 1px solid var(--config-settings-background);
  &:hover:not(:disabled) {
    background: var(--config-settings-background);
    color: var(--config-settings-color);
    border-color: var(--config-settings-color);
  }
}

// CSS textarea input
.css-editor {
  margin: 1rem auto;
  padding: 0.5rem;
  width: 80%;
  height: 8rem;
  max-height: 16rem;
  min-height: 4rem;
  resize: vertical;
  outline: none;
  border: 1px solid var(--config-settings-color);
  border-radius: var(--curve-factor);
  background: var(--transparent-50);
  color: var(--config-settings-color);
  &:focus {
    box-shadow: 0 40px 70px -2px rgba(0, 0, 0, 0.6), 1px 1px 6px var(--config-settings-color);
  }
}

// Info note
p.quick-note {
  text-align: left;
  width: 80%;
  margin: 1rem auto;
  padding: 0.5rem;
  font-size: 0.9rem;
  opacity: var(--dimming-factor);
  border-radius: var(--curve-factor);
}

// Theme editor
.color-config.theme-configurator-wrapper {
  border: 1px solid var(--config-settings-color);
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  position: relative;
  width: 80%;
  max-width: 24rem;
  margin: 1rem auto;
  box-shadow: none;
  right: 0;
  top: 0;
  max-height: unset;
  .color-row-container {
    text-align: left;
    max-height: unset;
  }
}

</style>
