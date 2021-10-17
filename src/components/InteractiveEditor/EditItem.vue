<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="50%"
    height="80%"
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
        v-if="row.type === 'text' || row.type === 'number'"
        v-model="formData[index].value"
        :description="row.description"
        :label="row.name"
        :type="row.type"
        layout="horizontal"
        />
      <Radio
        v-else-if="row.type === 'boolean'"
        v-model="formData[index].value"
        :description="row.description"
        :label="row.name"
        :options="['true', 'false']"
        :initialOption="boolToStr(formData[index].value)"
      />
      <Select
        v-else-if="row.type === 'select'"
        v-model="formData[index].value"
        :options="formData[index].enum"
        :description="row.description"
        :initialOption="formData[index].value"
        :label="row.name"
      />
      <div v-else>
        {{ row.name }} cannot currently be edited through the UI.
      </div>
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
import Radio from '@/components/FormElements/Radio';
import Select from '@/components/FormElements/Select';
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
    Radio,
    Select,
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
    /* Using the schema, make data structure for the UI form fields to use */
    makeRowData(property) {
      return {
        name: property,
        description: this.schema[property].description,
        value: this.item[property],
        type: this.getInputType(this.schema[property]),
        enum: this.schema[property].enum,
      };
    },
    /* Make formatted data structure to be rendered as form elements */
    makeInitialFormData() {
      const formData = [];
      const requiredFields = ['title', 'description', 'url', 'icon', 'target'];
      Object.keys(this.schema).forEach((property) => {
        const singleRow = this.makeRowData(property);
        if (this.item[property] || requiredFields.includes(property)) {
          formData.push(singleRow);
        } else {
          this.additionalFormData.push(singleRow);
        }
      });
      return formData;
    },
    boolToStr(bool) {
      if (bool) return 'true';
      if (bool === false) return 'false';
      return undefined;
    },
    /* Some fields require a bit of extra processing before they're saved */
    formatBeforeSave(item) {
      const newItem = item;
      newItem.id = this.itemId;
      if (newItem.hotkey) newItem.hotkey = parseInt(newItem.hotkey, 10);
      const strToTags = (str) => {
        const tagArr = str.split(',');
        return tagArr.map((tag) => tag.trim().toLowerCase().replace(/[^a-z]+/, ''));
      };
      const strToBool = (str) => {
        if (str === undefined) return undefined;
        return str === 'true';
      };
      if (newItem.tags) newItem.tags = strToTags(newItem.tags);
      if (newItem.statusCheck) newItem.statusCheck = strToBool(newItem.statusCheck);
      return newItem;
    },
    /* Saves the updated item to VueX Store */
    saveItem() {
      // Convert form data back into section.item data structure
      const structured = {};
      this.formData.forEach((row) => { structured[row.name] = row.value; });
      // Some attributes need a little extra formatting
      const newItem = this.formatBeforeSave(structured);
      // Update the data store, with new item data
      this.$store.commit(StoreKeys.UPDATE_ITEM, { newItem, itemId: this.itemId });
      // If we're not already in edit mode, enable it now
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
      // Close edit menu
      this.$emit('closeEditMenu');
    },
    /* Adds filed from extras list to main form, then removes from extras list */
    appendNewField(fieldId) {
      Object.keys(this.schema).forEach((property) => {
        if (property === fieldId) {
          this.formData.push(this.makeRowData(property));
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
      const definedType = schemaItem.type;
      // console.log(definedType);
      if (definedType === 'text') {
        return 'text';
      } else if (definedType === 'number') {
        return 'number';
      } else if (definedType === 'boolean') {
        return 'boolean';
      } else if (schemaItem.enum) {
        return 'select';
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
    font-size: 1.5rem;
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
    .input-container, .select-container {
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

  /* Override form input colors, to use local CSS variables */
  .input-container input.input-field,
  .radio-container div.radio-wrapper,
  .form-dropdown div.vs__dropdown-toggle {
    color: var(--config-settings-color);
    background: var(--config-settings-background);
    border-color: var(--config-settings-color);
  }
}
</style>
