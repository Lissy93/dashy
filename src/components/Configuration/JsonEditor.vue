<template>
  <div class="json-editor-outer">
    <!-- Main JSON editor -->
    <v-jsoneditor
      v-model="jsonData"
      :options="options"
    />
    <!-- Options raido, and save button -->
    <div class="save-options">
      <span class="save-option-title">{{ $t('config-editor.save-location-label') }}:</span>
      <div class="option">
        <input type="radio" id="local" value="local"
          v-model="saveMode" class="radio-option" :disabled="!allowWriteToDisk" />
        <label for="local" class="save-option-label">
          {{ $t('config-editor.location-local-label') }}
        </label>
      </div>
      <div class="option">
        <input type="radio" id="file" value="file" v-model="saveMode" class="radio-option"
          :disabled="!allowWriteToDisk" />
        <label for="file" class="save-option-label">
          {{ $t('config-editor.location-disk-label') }}
        </label>
      </div>
    </div>
    <button :class="`save-button ${!isValid ? 'err' : ''}`" @click="save()">
      {{ $t('config-editor.save-button') }}
    </button>
    <!-- List validation warnings -->
    <p class="errors">
      <ul>
        <li v-for="(error, index) in errorMessages" :key="index" :class="`type-${error.type}`">
          {{error.msg}}
        </li>
        <li v-if="errorMessages.length < 1" class="type-valid">
          {{ $t('config-editor.valid-label') }}
        </li>
      </ul>
    </p>
    <!-- Information notes -->
    <p v-if="saveSuccess !== undefined"
      :class="`response-output status-${saveSuccess ? 'success' : 'fail'}`">
      {{saveSuccess
        ? $t('config-editor.status-success-msg') : $t('config-editor.status-fail-msg') }}
    </p>
    <p class="response-output">{{ responseText }}</p>
    <p v-if="saveSuccess" class="response-output">
      {{ $t('config-editor.success-note-l1') }}
      {{ $t('config-editor.success-note-l2') }}
      {{ $t('config-editor.success-note-l3') }}
    </p>
    <p class="note">{{ $t('config.backup-note') }}</p>
  </div>
</template>

<script>

import axios from 'axios';
import VJsoneditor from 'v-jsoneditor';
import { localStorageKeys } from '@/utils/defaults';
import configSchema from '@/utils/ConfigSchema.json';
import JsonToYaml from '@/utils/JsonToYaml';
import { isUserAdmin } from '@/utils/Auth';

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
      saveMode: 'file',
      options: {
        schema: configSchema,
        mode: 'tree',
        modes: ['tree', 'code', 'preview'],
        name: 'config',
        onValidationError: this.validationErrors,
      },
      jsonParser: JsonToYaml,
      responseText: '',
      saveSuccess: undefined,
      allowWriteToDisk: this.shouldAllowWriteToDisk(),
    };
  },
  computed: {
    isValid() {
      return this.errorMessages.length < 1;
    },
  },
  mounted() {
    if (!this.allowWriteToDisk) this.saveMode = 'local';
  },
  methods: {
    shouldAllowWriteToDisk() {
      const { appConfig } = this.config;
      return appConfig.allowConfigEdit !== false && isUserAdmin(appConfig.auth);
    },
    save() {
      if (this.saveMode === 'local' || !this.allowWriteToDisk) {
        this.saveConfigLocally();
      } else if (this.saveMode === 'file') {
        this.writeConfigToDisk();
      } else {
        this.$toasted.show(this.$t('config-editor.error-msg-save-mode'));
      }
    },
    writeConfigToDisk() {
      // 1. Convert JSON into YAML
      const yaml = this.jsonParser(this.jsonData);
      // 2. Prepare the request
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      const endpoint = `${baseUrl}/config-manager/save`;
      const headers = { 'Content-Type': 'text/plain' };
      const body = { config: yaml, timestamp: new Date() };
      const request = axios.post(endpoint, body, headers);
      // 3. Make the request, and handle response
      request.then((response) => {
        this.saveSuccess = response.data.success || false;
        this.responseText = response.data.message;
        if (this.saveSuccess) {
          this.carefullyClearLocalStorage();
          this.showToast(this.$t('config-editor.success-msg-disk'), true);
        } else {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
        }
      })
        .catch((error) => {
          this.saveSuccess = false;
          this.responseText = error;
          this.showToast(error, false);
        });
    },
    saveConfigLocally() {
      const data = this.jsonData;
      if (data.sections) {
        localStorage.setItem(localStorageKeys.CONF_SECTIONS, JSON.stringify(data.sections));
      }
      if (data.pageInfo) {
        localStorage.setItem(localStorageKeys.PAGE_INFO, JSON.stringify(data.pageInfo));
      }
      if (data.appConfig) {
        data.appConfig.auth = this.config.appConfig.auth || [];
        localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(data.appConfig));
      }
      if (data.appConfig.theme) {
        localStorage.setItem(localStorageKeys.THEME, data.appConfig.theme);
      }
      this.showToast(this.$t('config-editor.success-msg-local'), true);
    },
    carefullyClearLocalStorage() {
      localStorage.removeItem(localStorageKeys.PAGE_INFO);
      localStorage.removeItem(localStorageKeys.APP_CONFIG);
      localStorage.removeItem(localStorageKeys.CONF_SECTIONS);
    },
    validationErrors(errors) {
      const errorMessages = [];
      errors.forEach((error) => {
        switch (error.type) {
          case 'validation':
            errorMessages.push({
              type: 'validation',
              msg: `${this.$t('config-editor.warning-msg-validation')}: `
                + `${error.error.keyword} ${error.error.message}`,
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
              msg: this.$t('config-editor.error-msg-bad-json'),
            });
            break;
        }
      });
      this.errorMessages = errorMessages;
    },
    showToast(message, success) {
      this.$toasted.show(message, { className: `toast-${success ? 'success' : 'error'}` });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/media-queries.scss';

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
p.response-output {
  font-size: 0.8rem;
  text-align: left;
  margin: 0.5rem auto;
  width: 95%;
  color: var(--config-settings-color);
  &.status-success {
    font-weight: bold;
    color: var(--success);
  }
  &.status-fail {
    font-weight: bold;
    color: var(--danger);
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

div.save-options {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: var(--code-editor-background);
  color: var(--code-editor-color);
  border-top: 2px solid var(--config-settings-background);
  @include tablet-down { flex-direction: column; }
  .option {
    @include tablet-up { margin-left: 2rem; }
  }
  span.save-option-title {
    cursor: default;
  }
  input.radio-option {
    cursor: pointer;
  }
  label.save-option-label {
    cursor: pointer;
  }
}

.jsoneditor-container.min-box {
  height: 58vh;
}

.jsoneditor, .jsoneditor-menu {
  border-color: var(--primary);
}
.jsoneditor {
  border-bottom: none;
}

.jsoneditor-menu, .pico-modal-header {
  background: var(--config-settings-background) !important;
  color: var(--config-settings-color) !important;
}
.jsoneditor-contextmenu .jsoneditor-menu li button {
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  &.jsoneditor-selected, &.jsoneditor-selected:focus, &.jsoneditor-selected:hover {
    background: var(--config-settings-color);
    color: var(--config-settings-background);
  }
}
div.jsoneditor-search div.jsoneditor-frame {
  border-radius: var(--curve-factor);
}
.jsoneditor-poweredBy {
  display: none;
}
.jsoneditor-tree, pre.jsoneditor-preview {
  background: var(--code-editor-background);
  text-align: left;
}

.jsoneditor-jmespath-label {
  color: var(--config-settings-color) !important;
}
.jsoneditor-jmespath-block.jsoneditor-modal-actions input {
  background: var(--config-settings-color);
  color: var(--config-settings-background);
  border: 1px solid var(--config-settings-background);
  border-radius: var(--curve-factor);
  &:hover {
    background: var(--config-settings-background);
    color: var(--config-settings-color);
    border-color: var(--config-settings-color);
  }
}
textarea.jsoneditor-transform-preview, div.jsoneditor-jmespath-block textarea#query {
  border: 1px solid var(--config-settings-color);
  border-radius: var(--curve-factor);
}
</style>
