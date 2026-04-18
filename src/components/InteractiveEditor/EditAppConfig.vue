<template>
  <modal
    :name="modalName" @closed="modalClosed"
    :resizable="true" width="50%" height="80%"
    classes="dashy-modal edit-app-config"
  >
    <div class="interactive-editor-inner" v-if="allowViewConfig">
      <h3>{{ $t('interactive-editor.menu.edit-app-config-btn') }}</h3>
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
      <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
      <SchemaForm v-model="formData" :schema="schema" class="app-config-form" />
      <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
    </div>
    <AccessError v-else />
  </modal>
</template>

<script>
import DashySchema from '@/utils/ConfigSchema.json';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';
import ErrorHandler, { InfoHandler, InfoKeys } from '@/utils/ErrorHandler';
import safeClone from '@/utils/safeClone';
import AccessError from '@/components/Configuration/AccessError';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';
import SchemaForm from '@/components/FormElements/SchemaForm';

export default {
  name: 'EditAppConfig',
  components: { AccessError, SaveCancelButtons, SchemaForm },
  data() {
    return {
      formData: {},
      schema: DashySchema.properties.appConfig,
      modalName: modalNames.EDIT_APP_CONFIG,
    };
  },
  computed: {
    appConfig() { return this.$store.getters.appConfig; },
    allowViewConfig() { return this.$store.getters.permissions.allowViewConfig; },
  },
  mounted() {
    this.formData = safeClone(this.appConfig, {});
  },
  methods: {
    saveToState() {
      try {
        this.$store.commit(StoreKeys.SET_APP_CONFIG, this.formData);
        this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
        InfoHandler('App config updated', InfoKeys.EDITOR);
        this.cancelEditing();
      } catch (e) {
        ErrorHandler('Failed to save app config', e);
        this.$toast.error('Error saving changes, check the logs');
      }
    },
    cancelEditing() { this.$modal.hide(this.modalName); },
    modalClosed() { this.$store.commit(StoreKeys.SET_MODAL_OPEN, false); },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';

.edit-app-config .app-config-intro {
  padding: 0.5rem;
  font-size: 0.9rem;
  color: var(--interactive-editor-color);
  background: var(--interactive-editor-background-darker);
  border-radius: var(--curve-factor);
  p.use-caution {
    margin: 0;
    color: var(--warning);
    font-weight: bold;
  }
  a { color: var(--interactive-editor-color); }
}
.edit-app-config .app-config-form {
  margin: 1rem 0;
}
</style>
