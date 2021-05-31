<template>
  <div class="json-editor-outer">
    <textarea v-model="customCss"></textarea>
    <button class="save-button" @click="save()">Save Changes</button>
  </div>
</template>

<script>

import { localStorageKeys } from '@/utils/defaults';

export default {
  name: 'JsonEditor',
  props: {
    config: Object,
  },
  data() {
    return {
      customCss: this.config.appConfig.customCss || '',
    };
  },
  methods: {
    validate() {
      return true;
    },
    save() {
      let msg = '';
      if (this.validate()) {
        const appConfig = { ...this.config.appConfig };
        appConfig.customCss = this.customCss;
        localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(appConfig));
        msg = 'Changes saved succesfully';
        this.inject(this.customCss);
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

</style>
