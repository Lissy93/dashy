<template>
  <div class="json-editor-outer">
    <prism-editor class="my-editor" v-model="customCss" :highlight="highlighter" line-numbers />
    <button class="save-button" @click="save()">Save Changes</button>
    <p>Note, you will need to refresh the page for your changes to take effect</p>
    <p>To remove all custom styles, delete the contents and hit Save Changes</p>
  </div>
</template>

<script>
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
    PrismEditor,
  },
  data() {
    return {
      customCss: this.config.appConfig.customCss || '\n\n\n\n\n',
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

</style>
