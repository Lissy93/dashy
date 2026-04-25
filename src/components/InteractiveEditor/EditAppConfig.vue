<template>
  <modal
    :name="modalName" @closed="modalClosed" @before-open="initForm"
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
import { defineAsyncComponent } from 'vue';
import DashySchema from '@/utils/config/ConfigSchema.json';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/config/defaults';
import ErrorHandler, { InfoHandler, InfoKeys } from '@/utils/logging/ErrorHandler';
import safeClone from '@/utils/safeClone';
import pruneSchemaDefaults from '@/utils/config/pruneSchemaDefaults';
import AccessError from '@/components/Configuration/AccessError';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';

const SchemaForm = defineAsyncComponent(() => import('@/components/FormElements/SchemaForm.vue'));

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
    // Read root appConfig, for partial sub-pages to inherit from
    ownAppConfig() { return this.$store.state.configSource.appConfig || {}; },
    allowViewConfig() { return this.$store.getters.permissions.allowViewConfig; },
  },
  methods: {
    // Re-runs on each modal open so the forms reflects changes made elsewhere
    initForm() {
      this.formData = safeClone(this.ownAppConfig, {});
    },
    saveToState() {
      try {
        const pruned = pruneSchemaDefaults(this.formData, this.schema);
        const patched = { ...this.$store.state.configSource, appConfig: pruned };
        this.$store.dispatch(StoreKeys.APPLY_EDITED_CONFIG, patched);
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
