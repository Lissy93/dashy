<template>
  <modal
    :name="modalName" @closed="modalClosed" @before-open="initForm"
    :resizable="true" width="50%" height="80%"
    classes="dashy-modal edit-multi-pages"
  >
    <div class="interactive-editor-inner" v-if="allowViewConfig">
      <h3>{{ $t('interactive-editor.menu.edit-pages-btn') }}</h3>
      <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
      <SchemaForm v-model="formData" :schema="customSchema" />
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
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';
import AccessError from '@/components/Configuration/AccessError';

const SchemaForm = defineAsyncComponent(() => import('@/components/FormElements/SchemaForm.vue'));

/* Curated subset of the pages schema (name, path, and the most commonly
 * toggled displayData flag). Full option list is in the docs. */
const pagesSchema = DashySchema.properties.pages;
const itemProps = pagesSchema.items.properties;
const PAGES_SCHEMA = {
  type: 'array',
  title: pagesSchema.title,
  description: pagesSchema.description,
  items: {
    type: 'object',
    title: pagesSchema.items.title,
    required: pagesSchema.items.required,
    properties: {
      name: itemProps.name,
      path: itemProps.path,
      displayData: {
        type: 'object',
        title: 'Display (see docs for more options)',
        properties: {
          hideForGuests: itemProps.displayData.properties.hideForGuests,
        },
      },
    },
  },
};

export default {
  name: 'EditMultiPages',
  components: { SaveCancelButtons, AccessError, SchemaForm },
  data() {
    return {
      formData: [],
      customSchema: PAGES_SCHEMA,
      modalName: modalNames.EDIT_MULTI_PAGES,
    };
  },
  computed: {
    pages() { return this.$store.getters.pages; },
    allowViewConfig() { return this.$store.getters.permissions.allowViewConfig; },
  },
  methods: {
    // Re-runs on each modal open so preview / save-locally elsewhere is reflected.
    initForm() {
      this.formData = safeClone(Array.isArray(this.pages) ? this.pages : [], []);
    },
    saveToState() {
      try {
        const pruned = pruneSchemaDefaults(this.formData, this.customSchema);
        const pages = Array.isArray(pruned) ? pruned : [];
        this.$store.commit(StoreKeys.SET_PAGES, pages);
        this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
        InfoHandler(`Pages list updated (${pages.length} page${pages.length === 1 ? '' : 's'})`, InfoKeys.EDITOR);
        this.cancelEditing();
      } catch (e) {
        ErrorHandler('Failed to save pages list', e);
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
