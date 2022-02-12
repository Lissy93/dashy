<template>
  <modal
    :name="modalName" @closed="modalClosed"
    :resizable="true" width="50%" height="80%"
    classes="dashy-modal edit-section"
  >
  <div class="edit-section-inner" v-if="allowViewConfig">
    <h3>
      {{ $t(`interactive-editor.edit-section.${isAddNew ? 'add' : 'edit'}-section-title`) }}
    </h3>
    <FormSchema
      :schema="customSchema"
      v-model="sectionData"
      name="editSectionForm"
      class="edit-section-form"
    />
    <SaveCancelButtons
      :saveClick="saveSection"
      :cancelClick="modalClosed"
    />
    </div>
    <AccessError v-else />
  </modal>
</template>

<script>
import FormSchema from '@formschema/native';
import StoreKeys from '@/utils/StoreMutations';
import DashySchema from '@/utils/ConfigSchema';
import { modalNames } from '@/utils/defaults';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';
import AccessError from '@/components/Configuration/AccessError';

export default {
  name: 'EditSection',
  props: {
    sectionIndex: Number,
    isAddNew: Boolean,
  },
  components: {
    SaveCancelButtons,
    FormSchema,
    AccessError,
  },
  data() {
    return {
      modalName: modalNames.EDIT_SECTION,
      schema: DashySchema.properties.sections.items.properties,
      sectionData: {},
    };
  },
  computed: {
    /* Make a custom schema object, using fields from ConfigSchema */
    customSchema() {
      const sectionSchema = this.schema;
      const displayDataSchema = this.schema.displayData.properties;
      return {
        type: 'object',
        properties: {
          name: sectionSchema.name,
          icon: sectionSchema.icon,
          displayData: {
            title: '',
            description: '',
            type: 'object',
            properties: {
              sortBy: displayDataSchema.sortBy,
              rows: displayDataSchema.rows,
              cols: displayDataSchema.cols,
              collapsed: displayDataSchema.collapsed,
              hideForGuests: displayDataSchema.hideForGuests,
            },
          },
        },
      };
    },
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  mounted() {
    this.sectionData = this.$store.getters.getSectionByIndex(this.sectionIndex);
    this.$modal.show(modalNames.EDIT_SECTION);
  },
  methods: {
    /* From the current index, return section data */
    getSectionFromState(index) {
      if (this.isAddNew) return {};
      return this.$store.getters.getSectionByIndex(index);
    },
    /* Clean up work, triggered when modal closed */
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$emit('closeEditSection');
    },
    /* Either update existing section, or insert new one, then close modal */
    saveSection() {
      const { sectionIndex, sectionData } = this;
      if (this.isAddNew) {
        this.$store.commit(StoreKeys.INSERT_SECTION, sectionData);
      } else {
        this.$store.commit(StoreKeys.UPDATE_SECTION, { sectionIndex, sectionData });
      }
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
      this.$emit('closeEditSection');
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';
@import '@/styles/schema-editor.scss';

.edit-section-inner {
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
  .edit-section-form {
    @extend .schema-form;
    margin-bottom: 2.5rem;
  }
  .edit-section-save-btn {
    margin-bottom: 2rem;
  }
}
</style>
