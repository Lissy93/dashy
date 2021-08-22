<template>
  <div class="css-editor-outer">
    <!-- Add raw custom CSS -->
    <div class="css-wrapper">
      <h2 class="css-input-title">Custom CSS</h2>
      <textarea class="css-editor" v-model="customCss" />
      <button class="save-button" @click="save()">{{ $t('config.css-save-btn') }}</button>
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
import { getTheme } from '@/utils/ConfigHelpers';
import { localStorageKeys } from '@/utils/defaults';

export default {
  name: 'StyleEditor',
  props: {
    config: Object,
  },
  components: {
    CustomThemeMaker,
  },
  data() {
    return {
      customCss: this.config.appConfig.customCss || '\n\n',
      currentTheme: getTheme(),
    };
  },
  methods: {
    /* A regex to validate the users CSS */
    validate(css) {
      return css === '' || css.match(/([#.@]?[\w.:> ]+)[\s]{[\r\n]?([A-Za-z\- \r\n\t]+[:][\s]*[\w ./()\-!]+;[\r\n]*(?:[A-Za-z\- \r\n\t]+[:][\s]*[\w ./()\-!]+;[\r\n]*(2)*)*)}/gmi);
    },
    /* Save custom CSS in browser, call inject, and show success message */
    save() {
      let msg = '';
      if (this.validate(this.customCss)) {
        const appConfig = { ...this.config.appConfig };
        appConfig.customCss = this.customCss;
        localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(appConfig));
        msg = 'Changes saved succesfully';
        this.inject(this.customCss);
        if (this.customCss === '') setTimeout(() => { location.reload(); }, 1500); // eslint-disable-line no-restricted-globals
      } else {
        msg = 'Error - Invalid CSS';
      }
      this.$toasted.show(msg);
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

div.css-editor-outer {
  text-align: center;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;

  h2.css-input-title {
    margin: 0.5rem 0 0.2rem;
  }
}

button.save-button {
  padding:  0.5rem 1rem;
  margin: 0.25rem auto;
  font-size: 1.2rem;
  background: var(--config-settings-color);
  color: var(--config-settings-background);
  border: 1px solid var(--config-settings-background);
  border-radius: var(--curve-factor);
  cursor: pointer;
  &:hover {
    background: var(--config-settings-background);
    color: var(--config-settings-color);
    border-color: var(--config-settings-color);
  }
}

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

p.quick-note {
  text-align: left;
  width: 80%;
  margin: 1rem auto;
  padding: 0.5rem;
  font-size: 0.9rem;
  opacity: var(--dimming-factor);
  border-radius: var(--curve-factor);
}

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
