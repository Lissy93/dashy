<template>
  <div class="json-editor-outer">
    <!-- Main JSON editor -->
    <v-jsoneditor v-model="jsonData" :options="options" />
    <!-- Options raido, and save button -->
    <Radio class="save-options"
      v-model="saveMode"
      :label="$t('config-editor.save-location-label')"
      :options="saveOptions"
      :initialOption="initialSaveMode"
      :disabled="!allowWriteToDisk"
      />
    <!-- Save Buttons -->
    <div :class="`btn-container ${!isValid ? 'err' : ''}`">
      <Button :click="save">
        {{ $t('config-editor.save-button') }}
      </Button>
      <Button :click="startPreview">
        {{ $t('config-editor.preview-button') }}
      </Button>
    </div>
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
    <p v-if="!allowWriteToDisk" class="no-permission-note">
      {{ $t('config-editor.not-admin-note') }}
    </p>
    <p class="response-output">{{ responseText }}</p>
    <p v-if="saveSuccess" class="response-output">
      {{ $t('config-editor.success-note-l1') }}
      {{ $t('config-editor.success-note-l2') }}
    </p>
    <p class="note">{{ $t('config.backup-note') }}</p>
  </div>
</template>

<script>

import axios from 'axios';
import ProgressBar from 'rsup-progress';
import VJsoneditor from 'v-jsoneditor';
import jsYaml from 'js-yaml';
import ErrorHandler, { InfoHandler, InfoKeys } from '@/utils/ErrorHandler';
import configSchema from '@/utils/ConfigSchema.json';
import StoreKeys from '@/utils/StoreMutations';
import { localStorageKeys, serviceEndpoints, modalNames } from '@/utils/defaults';
import { isUserAdmin } from '@/utils/Auth';
import Button from '@/components/FormElements/Button';
import Radio from '@/components/FormElements/Radio';

export default {
  name: 'JsonEditor',
  components: {
    VJsoneditor,
    Button,
    Radio,
  },
  data() {
    return {
      jsonData: {},
      errorMessages: [],
      saveMode: '',
      options: {
        schema: configSchema,
        mode: 'tree',
        modes: ['tree', 'code', 'preview'],
        name: 'config',
        onValidationError: this.validationErrors,
      },
      responseText: '',
      saveSuccess: undefined,
      progress: new ProgressBar({ color: 'var(--progress-bar)' }),
      saveOptions: [
        { label: this.$t('config-editor.location-disk-label'), value: 'file' },
        { label: this.$t('config-editor.location-local-label'), value: 'local' },
      ],
    };
  },
  computed: {
    config() {
      return this.$store.state.config;
    },
    isValid() {
      return this.errorMessages.length < 1;
    },
    allowWriteToDisk() {
      const { appConfig } = this.config;
      return appConfig.allowConfigEdit !== false && isUserAdmin();
    },
    initialSaveMode() {
      return this.allowWriteToDisk ? 'file' : 'local';
    },
  },
  mounted() {
    this.jsonData = this.config;
    if (!this.allowWriteToDisk) this.saveMode = 'local';
  },
  methods: {
    /* Calls appropriate save method, based on save-type radio selected */
    save() {
      if (this.saveMode === 'local' || !this.allowWriteToDisk) {
        this.saveConfigLocally();
      } else if (this.saveMode === 'file') {
        this.writeConfigToDisk();
      } else {
        this.$toasted.show(this.$t('config-editor.error-msg-save-mode'));
      }
    },
    /* Applies changes to the local state, begins edit mode and closes modal */
    startPreview() {
      InfoHandler('Applying changes to local state...', InfoKeys.RAW_EDITOR);
      const data = this.jsonData;
      this.$store.commit(StoreKeys.SET_APP_CONFIG, data.appConfig);
      this.$store.commit(StoreKeys.SET_PAGE_INFO, data.pageInfo);
      this.$store.commit(StoreKeys.SET_SECTIONS, data.sections);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
      this.$modal.hide(modalNames.CONF_EDITOR);
    },
    /* Converts config to YAML, and writes it to disk */
    writeConfigToDisk() {
      // 1. Convert JSON into YAML
      const yaml = jsYaml.dump(this.config);
      // 2. Prepare the request
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      const endpoint = `${baseUrl}${serviceEndpoints.save}`;
      const headers = { 'Content-Type': 'text/plain' };
      const body = { config: yaml, timestamp: new Date() };
      const request = axios.post(endpoint, body, headers);
      // 3. Make the request, and handle response
      this.progress.start();
      request.then((response) => {
        this.saveSuccess = response.data.success || false;
        this.responseText = response.data.message;
        if (this.saveSuccess) {
          this.carefullyClearLocalStorage();
          this.showToast(this.$t('config-editor.success-msg-disk'), true);
        } else {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
        }
        InfoHandler('Config has been written to disk succesfully', InfoKeys.RAW_EDITOR);
        this.$store.commit(StoreKeys.SET_CONFIG, this.jsonData);
        this.progress.end();
      })
        .catch((error) => {
          this.saveSuccess = false;
          this.responseText = error;
          this.showToast(error, false);
          ErrorHandler(`Failed to save config. ${error}`);
          this.progress.end();
        });
    },
    /* Saves config to local browser storage */
    saveConfigLocally() {
      const data = this.jsonData;
      if (data.sections) {
        localStorage.setItem(localStorageKeys.CONF_SECTIONS, JSON.stringify(data.sections));
      }
      if (data.pageInfo) {
        localStorage.setItem(localStorageKeys.PAGE_INFO, JSON.stringify(data.pageInfo));
      }
      if (data.appConfig) {
        data.appConfig.auth = this.config.appConfig.auth || {};
        localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(data.appConfig));
      }
      if (data.appConfig.theme) {
        localStorage.setItem(localStorageKeys.THEME, data.appConfig.theme);
      }
      InfoHandler('Config has succesfully been saved in browser storage', InfoKeys.RAW_EDITOR);
      this.showToast(this.$t('config-editor.success-msg-local'), true);
    },
    /* Clears config from browser storage, only removing relevant items  */
    carefullyClearLocalStorage() {
      localStorage.removeItem(localStorageKeys.PAGE_INFO);
      localStorage.removeItem(localStorageKeys.APP_CONFIG);
      localStorage.removeItem(localStorageKeys.CONF_SECTIONS);
    },
    /* Convert error messages into readable format for UI */
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
    /* Shows toast message */
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

p.no-permission-note {
  color: var(--config-settings-color);
}

.btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    padding:  0.5rem 1rem;
    margin: 0.25rem;
    font-size: 1.2rem;
    background: var(--config-settings-background);
    color: var(--config-settings-color);
    border: 1px solid var(--config-settings-color);
    border-radius: var(--curve-factor);
    &:hover {
      background: var(--config-settings-color);
      color: var(--config-settings-background);
      border-color: var(--config-settings-background);
    }
  }
  &.err button {
    opacity: 0.8;
    cursor: default;
    &:hover {
      background: var(--config-settings-background);
      color: var(--config-settings-color);
      border-color: var(--danger);
    }
  }
}

div.save-options.radio-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-top: 2px solid var(--config-settings-background);
  background: var(--code-editor-background);
  label.radio-label {
    font-size: 1rem;
    flex-grow: revert;
    flex-basis: revert;
    color: var(--code-editor-color);
    padding-left: 1rem;
  }
  .radio-wrapper {
    margin: 0;
    font-size: 1rem;
    justify-content: space-around;
    background: var(--code-editor-background);
    color: var(--code-editor-color);
    .radio-option:hover:not(.wrap-disabled) {
      border: 1px solid var(--code-editor-color);
    }
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
