<template>
  <modal
    :name="modalName" @closed="modalClosed"
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
import DashySchema from '@/utils/ConfigSchema.json';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';
import ErrorHandler, { InfoHandler, InfoKeys } from '@/utils/ErrorHandler';
import safeClone from '@/utils/safeClone';
import AccessError from '@/components/Configuration/AccessError';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';
import SchemaForm from '@/components/FormElements/SchemaForm';

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
    pageInfo() { return this.$store.getters.pageInfo; },
    allowViewConfig() { return this.$store.getters.permissions.allowViewConfig; },
  },
  mounted() {
    this.formData = safeClone(this.pageInfo, {});
  },
  methods: {
    saveToState() {
      try {
        this.$store.commit(StoreKeys.SET_PAGE_INFO, this.formData);
        this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
        InfoHandler('Page info updated', InfoKeys.EDITOR);
        this.cancelEditing();
      } catch (e) {
        ErrorHandler('Failed to save page info', e);
        this.$toasted.show('Error saving changes. See Logs.', { className: 'toast-error' });
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
