<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="50%"
    height="85%"
    classes="dashy-modal edit-item"
    @closed="modalClosed"
  >
  <div class="edit-item-inner">
    <h3 class="title">Edit Item</h3>
    <p class="sub-title">Editing {{item.title}} (ID: {{itemId}})</p>
    <p class="warning-note" v-if="formData.length === 0">
      No data configured yet. Click an attribute in the list below to add the field to the form.
    </p>
    <div class="row" v-for="(row, index) in formData" :key="row.name">
      <Input
        v-model="formData[index].value"
        :description="row.description"
        :label="row.name"
        :type="row.type"
        layout="horizontal"
        />
        <BinIcon @click="() => removeField(row.name)" />
    </div>
    <div class="add-more-inputs" v-if="additionalFormData.length > 0">
      <h4>More Fields</h4>
      <div class="more-fields">
        <span
          v-for="row in additionalFormData"
          :key="row.name"
          @click="() => appendNewField(row.name)"
          class="add-field-tag">
          <AddIcon /> {{ row.name }}
        </span>
      </div>
    </div>
    <Button :click="saveItem">Save</Button>
    </div>
  </modal>
</template>

<script>
import AddIcon from '@/assets/interface-icons/interactive-editor-add.svg';
import BinIcon from '@/assets/interface-icons/interactive-editor-remove.svg';
import Input from '@/components/FormElements/Input';
import Button from '@/components/FormElements/Button';
import StoreKeys from '@/utils/StoreMutations';
import DashySchema from '@/utils/ConfigSchema';
import { modalNames } from '@/utils/defaults';

export default {
  name: 'EditItem',
  data() {
    return {
      modalName: modalNames.EDIT_ITEM,
      schema: DashySchema.properties.sections.items.properties.items.items.properties,
      formData: [], // Array of form fields
      additionalFormData: [], // Array of not-yet-used form fields
      item: {},
    };
  },
  props: {
    itemId: String,
  },
  computed: {},
  components: {
    Input,
    Button,
    AddIcon,
    BinIcon,
  },
  mounted() {
    this.item = this.getItemFromState(this.itemId);
    this.formData = this.makeInitialFormData();
    this.$modal.show(modalNames.EDIT_ITEM);
  },
  methods: {
    /* For a given item ID, return the item obj from store */
    getItemFromState(id) {
      return this.$store.getters.getItemById(id);
    },
    /* Using the schema and item obj, generate data to be rendered in the form */
    makeInitialFormData() {
      const formData = [];
      const requiredFields = ['title', 'description', 'url', 'icon', 'target', 'hotkey', 'provider', 'tags'];
      Object.keys(this.schema).forEach((property) => {
        const singleRow = {
          name: property,
          description: this.schema[property].description,
          value: this.item[property],
          type: this.getInputType(this.schema[property]),
        };
        if (this.item[property] || requiredFields.includes(property)) {
          formData.push(singleRow);
        } else {
          this.additionalFormData.push(singleRow);
        }
      });
      return formData;
    },
    /* Saves the updated item to VueX Store */
    saveItem() {
      const newItem = {};
      this.formData.forEach((row) => {
        newItem[row.name] = row.value;
      });
      newItem.id = this.itemId;
      this.$store.commit(StoreKeys.UPDATE_ITEM, { newItem, itemId: this.itemId });
    },
    /* Adds filed from extras list to main form, then removes from extras list */
    appendNewField(fieldId) {
      Object.keys(this.schema).forEach((property) => {
        if (property === fieldId) {
          this.formData.push({
            name: property,
            description: this.schema[property].description,
            value: this.item[property],
            type: this.getInputType(this.schema[property]),
          });
        }
      });
      this.additionalFormData.forEach((elem, index) => {
        if (elem.name === fieldId) {
          this.additionalFormData.splice(index, 1);
        }
      });
    },
    /* Removes filed from main form, adds back into extras list */
    removeField(fieldId) {
      this.formData.forEach((elem, index) => {
        if (elem.name === fieldId) {
          this.formData.splice(index, 1);
          this.additionalFormData.push(elem);
        }
      });
    },
    /* For a given attribute, determine type from schema */
    getInputType(schemaItem) {
      if (schemaItem.type === 'text') {
        return 'text';
      } else if (schemaItem.type === 'number') {
        return 'number';
      }
      return 'text';
    },
    /* Clean up work, triggered when modal closed */
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$emit('closeEditMenu');
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

.edit-item-inner {
  padding: 1rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  height: 100%;
  overflow-y: auto;
  @extend .svg-button;
  h3.title {
    font-size: 1.2rem;
    margin: 0.25rem 0;
  }
  p.sub-title {
    margin: 0.25rem 0;
    font-size: 0.8rem;
    font-style: italic;
    opacity: var(--dimming-factor);
  }
  p.warning-note {
    color: var(--warning);
  }
  .row {
    display: flex;
    padding: 0.5rem 0.25rem;
    &:not(:last-child) {
      border-bottom: 1px dotted var(--config-settings-color);
    }
    .input-container {
        width: 100%;
        input.input-field {
        font-size: 1rem;
        padding: 0.35rem 0.5rem;
      }
    }
  }
  .more-fields {
    display: flex;
    flex-wrap: wrap;
    span.add-field-tag {
      margin: 0.2rem;
      padding: 0.2rem 0.5rem;;
      min-width: 2rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      text-align: center;
      border: 1px solid var(--config-settings-color);
      border-radius: var(--curve-factor);
      &:hover {
        background: var(--config-settings-color);
        color: var(--config-settings-background);
        svg {
          background: var(--config-settings-color);
          path { fill: var(--config-settings-background); }
        }
      }
      svg {
        margin-right: 0.25rem;
        border: none;
      }
    }
  }
}

</style>
