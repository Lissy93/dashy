<template>
  <div class="json-editor-outer">
    <v-jsoneditor
      v-model="jsonData"
      :options="options"
      height="650px"
    />
    <button :class="`save-button ${!isValid ? 'err' : ''}`" @click="save()">Save Changes</button>
    <p class="errors">
      <ul>
        <li v-for="(error, index) in errorMessages" :key="index" :class="`type-${error.type}`">
          {{error.msg}}
        </li>
        <li v-if="errorMessages.length < 1" class="type-valid">
          Config is Valid
        </li>
      </ul>
    </p>
    <p class="note">
      It is recommend to backup your existing confiruration before making any changes.
      <br>
      Remember that these changes are only applied locally,
      and will need to be exported to your conf.yml
    </p>
  </div>
</template>

<script>

import VJsoneditor from 'v-jsoneditor';
import { localStorageKeys } from '@/utils/defaults';
import configSchema from '@/utils/ConfigSchema';
import Ajv from 'ajv7';

export default {
  name: 'JsonEditor',
  props: {
    config: Object,
  },
  components: {
    VJsoneditor,
  },
  data() {
    return {
      jsonData: this.config,
      errorMessages: [],
      options: {
        schema: configSchema,
        mode: 'tree',
        modes: ['tree', 'code', 'preview'],
        name: 'config',
        ajv: new Ajv({
          allErrors: true,
          verbose: true,
          jsPropertySyntax: false,
          $data: true,
        }),
        onValidationError: this.validationErrors,
      },
    };
  },
  computed: {
    isValid() {
      return this.errorMessages.length < 1;
    },
  },
  methods: {
    save() {
      const data = this.jsonData;
      if (data.sections) {
        localStorage.setItem(localStorageKeys.CONF_SECTIONS, JSON.stringify(data.sections));
      }
      if (data.pageInfo) {
        localStorage.setItem(localStorageKeys.PAGE_INFO, JSON.stringify(data.pageInfo));
      }
      if (data.appConfig) {
        localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(data.appConfig));
      }
      if (data.appConfig.theme) {
        localStorage.setItem(localStorageKeys.THEME, data.appConfig.theme);
      }
      this.$toasted.show('Changes saved succesfully');
    },
    validationErrors(errors) {
      const errorMessages = [];
      errors.forEach((error) => {
        switch (error.type) {
          case 'validation':
            errorMessages.push({
              type: 'validation',
              msg: `Validatation Warning: ${error.error.keyword} ${error.error.message}`,
            });
            break;
          case 'error':
            errorMessages.push({
              type: 'parse',
              msg: error.message,
            });
            break;
          default:
            errorMessages.push({
              type: 'editor',
              msg: 'Error in JSON',
            });
            break;
        }
      });
      this.errorMessages = errorMessages;
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
p.errors {
  text-align: left;
  margin: 0.5rem auto;
  width: 95%;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      &.type-validation {
        color: var(--warning);
        &::before { content: "⚠️"; }
      }
      &.type-parse {
        color: var(--danger);
        &::before { content: "❌"; }
      }
      &.type-valid {
        color: var(--success);
        &::before { content: "✅"; }
      }
    }
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
  &.err {
    opacity: 0.8;
    cursor: default;
    &:hover {
      background: var(--config-settings-color);
      color: var(--config-settings-background);
      border-color: var(--danger);
    }
  }
}

.jsoneditor-menu {
  background: var(--config-settings-background);
  color: var(--config-settings-color);
}
.jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected,
.jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected:focus,
.jsoneditor-contextmenu .jsoneditor-menu li button.jsoneditor-selected:hover {
  background: var(--config-settings-color);
  color: var(--config-settings-background);
}
.jsoneditor-poweredBy {
  display: none;
}
.jsoneditor-tree, pre.jsoneditor-preview {
  background: #fff;
  text-align: left;
}
</style>
