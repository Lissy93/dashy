<template>
  <modal
    :name="modalName" @closed="modalClosed" @before-open="initForm"
    :resizable="true" width="50%" height="80%"
    classes="dashy-modal edit-page-info"
  >
    <div class="interactive-editor-inner" v-if="allowViewConfig">
      <h3>{{ $t('interactive-editor.menu.edit-page-info-btn') }}</h3>
      <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
      <SchemaForm v-model="formData" :schema="schema" />
      <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
    </div>
    <AccessError v-else />
  </modal>
</template>

<script>
import DashySchema from '@/utils/config/ConfigSchema.json';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/config/defaults';
import ErrorHandler, { InfoHandler, InfoKeys } from '@/utils/logging/ErrorHandler';
import safeClone from '@/utils/safeClone';
import { defineAsyncComponent } from 'vue';
import AccessError from '@/components/Configuration/AccessError';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';

const SchemaForm = defineAsyncComponent(() => import('@/components/FormElements/SchemaForm.vue'));

export default {
  name: 'EditPageInfo',
  components: { AccessError, SaveCancelButtons, SchemaForm },
  data() {
    return {
      formData: {},
      schema: DashySchema.properties.pageInfo,
      modalName: modalNames.EDIT_PAGE_INFO,
    };
  },
  computed: {
    ownPageInfo() { return this.$store.state.configSource.pageInfo || {}; },
    allowViewConfig() { return this.$store.getters.permissions.allowViewConfig; },
  },
  methods: {
    initForm() {
      this.formData = safeClone(this.ownPageInfo, {});
    },
    saveToState() {
      try {
        const patched = { ...this.$store.state.configSource, pageInfo: this.formData };
        this.$store.dispatch(StoreKeys.APPLY_EDITED_CONFIG, patched);
        this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
        InfoHandler('Page info updated', InfoKeys.EDITOR);
        this.cancelEditing();
      } catch (e) {
        ErrorHandler('Failed to save page info', e);
        this.$toast.error('Error saving changes. See Logs.');
      }
    },
    cancelEditing() { this.$modal.hide(this.modalName); },
    modalClosed() { this.$store.commit(StoreKeys.SET_MODAL_OPEN, false); },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';
</style>
