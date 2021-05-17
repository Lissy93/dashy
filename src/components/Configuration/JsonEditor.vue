<template>
  <div class="json-editor-outer">
    <v-jsoneditor
      v-model="jsonData"
      :options="options"
      height="650px"
    />
    <button class="save-button" @click="save()">Save Changes</button>
    <p class="note">
      It is recommend to backup your existing confiruration before making any changes.
    </p>
  </div>
</template>

<script>

import VJsoneditor from 'v-jsoneditor';
import { localStorageKeys } from '@/utils/defaults';

export default {
  name: 'JsonEditor',
  props: {
    sections: Array,
  },
  components: {
    VJsoneditor,
  },
  data() {
    return {
      jsonData: this.sections,
      options: {
        mode: 'tree',
        modes: ['tree', 'code', 'preview'],
        name: 'sections',
      },
    };
  },
  methods: {
    save() {
      localStorage.setItem(localStorageKeys.CONF_SECTIONS, JSON.stringify(this.jsonData));
    },
  },
};
</script>

<style lang="scss">

.json-editor-outer {
  text-align: center;
}
p.note {
  font-size: 0.8rem;
  color: var(--medium-grey);
  margin: 0.2rem;
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
  }
}

.jsoneditor-menu {
  background: var(--config-settings-color);
  color: var(--config-settings-background);
}
.jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected,
.jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected:focus,
.jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected:hover {
  background: var(--config-settings-background);
  color: var(--config-settings-color);
}
.jsoneditor-poweredBy {
  display: none;
}
</style>
