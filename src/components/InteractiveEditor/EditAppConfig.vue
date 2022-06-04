<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="50%"
    height="80%"
    classes="dashy-modal edit-app-config"
    @closed="modalClosed"
  >
  <div class="edit-app-config-inner" v-if="allowViewConfig">
  <h3>{{ $t('interactive-editor.menu.edit-app-config-btn') }}</h3>
  <!-- Show caution message -->
  <div class="app-config-intro">
    <p class="use-caution">
      {{ $t('interactive-editor.edit-app-config.warning-msg-title') }}
    </p>
    {{ $t('interactive-editor.edit-app-config.warning-msg-l1') }}
    {{ $t('interactive-editor.edit-app-config.warning-msg-l2') }}
    <a href="https://dashy.to/docs/configuring#appconfig-optional">
      {{ $t('interactive-editor.edit-app-config.warning-msg-docs') }}
    </a>
    {{ $t('interactive-editor.edit-app-config.warning-msg-l3') }}
  </div>
  <!-- Save Button, upper -->
  <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
  <!-- The main form -->
  <FormSchema
    :schema="schema"
    v-model="formData"
    @submit.prevent="saveToState"
    :search="true"
    class="app-config-form"
    name="appConfigForm"
  ></FormSchema>
  <!-- Save Button, lower -->
  <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
  </div>
  <AccessError v-else />
  </modal>
</template>

<script>
import FormSchema from '@formschema/native';
import DashySchema from '@/utils/ConfigSchema';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';
import AccessError from '@/components/Configuration/AccessError';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';

export default {
  name: 'EditAppConfig',
  data() {
    return {
      formData: {},
      schema: DashySchema.properties.appConfig,
      modalName: modalNames.EDIT_APP_CONFIG,
    };
  },
  props: {},
  components: {
    FormSchema,
    SaveCancelButtons,
    AccessError,
  },
  mounted() {
    this.formData = this.appConfig;
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  methods: {
    /* When form submitteed, update VueX store with new appConfig, and close modal */
    saveToState() {
      const processedFormData = this.removeUndefinedValues(this.formData);
      this.$store.commit(StoreKeys.SET_APP_CONFIG, processedFormData);
      this.$modal.hide(this.modalName);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
    },
    cancelEditing() {
      this.$modal.hide(this.modalName);
    },
    /* Called when modal manually closed, updates state to allow searching again */
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
    /* Remove any attribute which has an undefined value before saving */
    removeUndefinedValues(rawAppConfig) {
      const raw = rawAppConfig;
      const isEmptyObject = (obj) => (typeof obj === 'object' && Object.keys(obj).length === 0);
      const isEmpty = (value) => (value === undefined || isEmptyObject(value));
      // Delete empty values
      Object.keys(raw).forEach(key => {
        if (isEmpty(raw[key])) delete raw[key];
      });
      // If KC config empty, delete it
      const kcConfig = raw.auth.keycloak;
      if (!kcConfig.clientId && !kcConfig.realm && !kcConfig.serverUrl) delete raw.auth.keycloak;
      return raw;
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';
@import '@/styles/schema-editor.scss';

.edit-app-config-inner {
  padding: 1rem;
  background: var(--interactive-editor-background);
  color: var(--interactive-editor-color);
  height: 100%;
  overflow-y: auto;
  @extend .scroll-bar;
  h3 {
    font-size: 1.4rem;
    margin: 0.5rem;
  }
  .app-config-form {
    @extend .schema-form;
    border-top: 1px dashed var(--interactive-editor-color);
  }
  .app-config-intro {
    padding: 0.5rem;
    font-size: 0.9rem;
    color: var(--interactive-editor-color);
    background: var(--interactive-editor-background-darker);
    border-radius: var(--interactive-editor-color);
    p.use-caution {
      color: var(--warning);
      margin: 0;
      font-weight: bold;
    }
    a {
      color: var(--interactive-editor-color);
    }
  }
}

</style>
