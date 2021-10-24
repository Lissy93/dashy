<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="50%"
    height="80%"
    classes="dashy-modal edit-section"
    @closed="modalClosed"
  >
  <div class="edit-section-inner">
    <h3>Edit Section</h3>
    <FormSchema
      :schema="customSchema"
      v-model="sectionData"
      name="editSectionForm"
      class="edit-section-form"
    />
    <!-- Save to state button -->
    <Button class="edit-section-save-btn" :click="saveSection">Save</Button>
    </div>
  </modal>
</template>

<script>
import FormSchema from '@formschema/native';
import StoreKeys from '@/utils/StoreMutations';
import DashySchema from '@/utils/ConfigSchema';
import Button from '@/components/FormElements/Button';
import { modalNames } from '@/utils/defaults';

export default {
  name: 'EditSection',
  props: {
    sectionIndex: Number,
  },
  components: {
    Button,
    FormSchema,
  },
  data() {
    return {
      modalName: modalNames.EDIT_SECTION,
      schema: DashySchema.properties.sections.items.properties,
      sectionData: {},
    };
  },
  computed: {
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
  },
  mounted() {
    this.sectionData = this.$store.getters.getSectionByIndex(this.sectionIndex);
    this.$modal.show(modalNames.EDIT_SECTION);
  },
  methods: {
    getSectionFromState(index) {
      return this.$store.getters.getSectionByIndex(index);
    },
    /* Clean up work, triggered when modal closed */
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$emit('closeEditSection');
    },
    saveSection() {
      const { sectionIndex, sectionData } = this;
      this.$store.commit(StoreKeys.UPDATE_SECTION, { sectionIndex, sectionData });
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
