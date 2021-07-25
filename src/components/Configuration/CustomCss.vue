<template>
  <div class="css-editor-outer">
    <prism-editor class="my-editor" v-model="customCss" :highlight="highlighter" line-numbers />
    <button class="save-button" @click="save()">{{ $t('config.css-save-btn') }}</button>
    <p class="quick-note">
      <b>{{ $t('config.css-note-label') }}:</b>
      {{ $t('config.css-note-l1') }} {{ $t('config.css-note-l2') }} {{ $t('config.css-note-l3') }}
    </p>
    <CustomThemeMaker :themeToEdit="currentTheme" class="color-config" />
  </div>
</template>

<script>
import CustomThemeMaker from '@/components/Settings/CustomThemeMaker';
import { getTheme } from '@/utils/ConfigHelpers';
import { PrismEditor } from 'vue-prism-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-funky.css';
import 'vue-prism-editor/dist/prismeditor.min.css';

import { localStorageKeys } from '@/utils/defaults';

export default {
  name: 'JsonEditor',
  props: {
    config: Object,
  },
  components: {
    CustomThemeMaker,
    PrismEditor,
  },
  data() {
    return {
      customCss: this.config.appConfig.customCss || '\n\n\n\n\n',
      currentTheme: getTheme(),
    };
  },
  methods: {
    validate(css) {
      return css === '' || css.match(/((?:^\s*)([\w#.@*,:\-.:>,*\s]+)\s*{(?:[\s]*)((?:[A-Za-z\- \s]+[:]\s*['"0-9\w .,/()\-!%]+;?)*)*\s*}(?:\s*))/gmi);
    },
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
    inject(userStyles) {
      const cleanedCss = userStyles.replace(/<\/?[^>]+(>|$)/g, '');
      const style = document.createElement('style');
      style.textContent = cleanedCss;
      document.head.append(style);
    },
    highlighter(code) {
      return highlight(code, languages.css);
    },
  },
};
</script>

<style lang="scss">

div.css-editor-outer {
  text-align: center;
  padding-bottom: 1rem;
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

.prism-editor-wrapper {
  min-height: 200px;
  border: 1px solid var(--transparent-70);
  border-radius: var(--curve-factor);
  width: 90%;
  margin: 0.5rem auto;
  background: var(--transparent-50);
}

p.quick-note {
  text-align: left;
  width: 80%;
  margin: 1rem auto;
  padding: 0.5rem;
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
