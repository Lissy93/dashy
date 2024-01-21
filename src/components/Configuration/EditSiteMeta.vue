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
    <div class="form">
      <h2>Nav Bar Links</h2>
      <div class="add-nav-bar-link" v-for="(link, index) in formElements.navLinks" :key="index">
        <div class="row">
          <span>Link Text</span>
          <input v-model="link.title" />
        </div>
        <div class="row">
          <span>Link URL</span>
          <input v-model="link.path" />
        </div>
      </div>
      <button class="add-new-link" @click="addNavLinkRow()" >
        <AddNewIcon />
        Add New Link
      </button>
    </div>
    <button class="save-button" @click="save()">
      <SaveConfigIcon />
      Save Changes
    </button>
  </div>
</template>

<script>

import { localStorageKeys } from '@/utils/defaults';
import AddNewIcon from '@/assets/interface-icons/add-new.svg';
import SaveConfigIcon from '@/assets/interface-icons/save-config.svg';

export default {
  name: 'EditSiteMeta',
  props: {
    config: Object,
  },
  components: {
    AddNewIcon,
    SaveConfigIcon,
  },
  methods: {
    save() {
      const pageInfo = { ...this.config.pageInfo };
      pageInfo.title = this.formElements.title;
      pageInfo.description = this.formElements.description;
      pageInfo.footerText = this.formElements.footerText;
      if (this.formElements.navLinks) {
        pageInfo.navLinks = this.formElements.navLinks.filter(link => (link.title !== ''));
      }
      localStorage.setItem(localStorageKeys.PAGE_INFO, JSON.stringify(pageInfo));
      this.$toasted.show('Changes saved successfully');
      setTimeout(() => { location.reload(); }, 1500); // eslint-disable-line no-restricted-globals
    },
    addNavLinkRow() {
      this.formElements.navLinks.push({ title: '', path: '' });
    },
  },
  data() {
    return {
      formElements: {
        title: this.config.pageInfo.title,
        description: this.config.pageInfo.description,
        footerText: this.config.pageInfo.footerText,
        navLinks: this.config.pageInfo.navLinks || [],
      },
    };
  },
};
</script>

<style scoped lang="scss">
.site-meta-container {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  background: var(--config-settings-background);
  height: calc(100% - 1rem);
  h2 {
    margin: 1rem auto;
    color: var(--config-settings-color);
  }
}

div.form {
  display: flex;
  flex-direction: column;
  width: fit-content;
  margin: 0 auto 1rem auto;
  padding-bottom: 1rem;
  &:not(:last-child) {
    border-bottom: 1px dashed var(--config-settings-color);
  }
  div.add-nav-bar-link {
    margin: 0 auto;
  }
  div.row {
    margin: 0.25rem auto;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    min-width: 24rem;
    span {
      font-size: 1.2rem;
      color: var(--config-settings-color);
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
        box-shadow: 1px 1px 6px var(--config-settings-color);
        outline: none;
      }
    }
  }
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem auto;
  svg {
    width: 1.2rem;
    margin: 0 0.2rem;
  }
}

button.save-button {
  padding:  0.5rem 1rem;
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

button.add-new-link {
  background: none;
  text-decoration: underline;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  color: var(--config-settings-color);
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid transparent;
  &:hover {
    border-color: var(--config-settings-color);
    text-decoration: none;
  }
  &:active {
    background: var(--config-settings-color);
    color: var(--config-settings-background);
    border-color: var(--config-settings-color);
  }
}
</style>
