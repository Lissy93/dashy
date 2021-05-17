<template>
  <div class="site-meta-container">
    <h2>Edit Site Meta</h2>
    <div class="form">
      <div class="row">
        <span>Title</span>
        <input v-model="formElements.title" />
      </div>
      <div class="row">
        <span>Description</span>
        <input v-model="formElements.description" />
      </div>
      <div class="row">
        <span>Footer Text</span>
        <input v-model="formElements.footerText" />
      </div>
    </div>
    <button class="save-button" @click="save()">Save Changes</button>
  </div>
</template>

<script>

import { localStorageKeys } from '@/utils/defaults';

export default {
  name: 'EditSiteMeta',
  props: {
    config: Object,
  },
  methods: {
    save() {
      const pageInfo = { ...this.config.pageInfo };
      pageInfo.title = this.formElements.title;
      pageInfo.description = this.formElements.description;
      pageInfo.footerText = this.formElements.footerText;
      localStorage.setItem(localStorageKeys.PAGE_INFO, JSON.stringify(pageInfo));
      this.$toasted.show('Changes seved succesfully');
      setTimeout(() => { location.reload(); }, 1500); // eslint-disable-line no-restricted-globals
    },
  },
  data() {
    return {
      formElements: {
        title: this.config.pageInfo.title,
        description: this.config.pageInfo.description,
        footerText: this.config.pageInfo.footerText,
      },
    };
  },
};
</script>

<style scoped lang="scss">
.site-meta-container {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  background: var(--background-darker);
  height: calc(100% - 1rem);
  h2 {
    margin: 1rem auto;
    color: var(--config-settings-color);
  }
}

div.form {
  display: flex;
  flex-direction: column;
  div.row {
    margin: 0.25rem auto;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    min-width: 24rem;
    span {
      font-size: 1.2rem;
    }
    input {
      color: var(--config-settings-color);
      background: none;
      border: 1px solid var(--config-settings-color);
      border-radius: var(--curve-factor);
      padding: 0.25rem 0.5rem;
      margin: 0.5rem;
      min-width: 8rem;
      font-size: 1.2rem;
      &:focus {
        box-shadow: 1px 1px 6px #00ccb4;
        outline: none;
      }
    }
  }
}

button.save-button {
  padding:  0.5rem 1rem;
  margin: 0.5rem auto;
  font-size: 1.2rem;
  width: 24rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  border: 1px solid var(--config-settings-color);
  border-radius: var(--curve-factor);
  cursor: pointer;
  &:hover {
    background: var(--config-settings-color);
    color: var(--config-settings-background);
  }
}
</style>
