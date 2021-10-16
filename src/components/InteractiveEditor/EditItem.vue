<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="50%"
    height="50%"
    classes="dashy-modal edit-item"
    @closed="modalClosed"
  >
    <h3 class="title">Edit Item</h3>
    <p class="sub-title">Editing {{item.title}} (ID: {{itemId}})</p>
    <div class="row" v-for="(row, index) in formData" :key="row.name">
      <Input
        v-model="formData[index].value"
        :description="row.description"
        :label="row.name"
        :type="row.type"
        layout="horizontal"
        />
    </div>
    <div class="add-more-inputs">
      <h4>More Fields</h4>
      <div class="more-fields">
        <span
          v-for="row in additionalFormData"
          :key="row.name"
          @click="() => appendNewField(row.name)"
          class="add-field-tag">
          ➕ {{ row.name }}
        </span>
      </div>
    </div>
    <Button :click="saveItem">Save</Button>
  </modal>
</template>

<script>
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
      formData: [],
      additionalFormData: [],
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
  },
  mounted() {
    this.item = this.getItemFromState(this.itemId);
    this.formData = this.makeInitialFormData();
    this.$modal.show(modalNames.EDIT_ITEM);
  },
  methods: {
    makeInitialFormData() {
      const formData = [];
      const requiredFields = ['title', 'description', 'url', 'icon', 'target', 'hotkey', 'provider', 'tags'];
      const acceptedTypes = ['text', 'number'];
      const getType = (origType) => (acceptedTypes.includes(origType) ? origType : 'text');
      Object.keys(this.schema).forEach((property) => {
        const singleRow = {
          name: property,
          description: this.schema[property].description,
          value: this.item[property] || '',
          type: getType(this.schema[property].type),
        };
        if (this.item[property] || requiredFields.includes(property)) {
          formData.push(singleRow);
        } else {
          this.additionalFormData.push(singleRow);
        }
      });
      return formData;
    },
    getItemFromState(id) {
      return this.$store.getters.getItemById(id);
    },
    saveItem() {
      const newItem = {};
      this.formData.forEach((row) => {
        newItem[row.name] = row.value;
      });
      newItem.id = this.itemId;
      this.$store.commit(StoreKeys.UPDATE_ITEM, { newItem, itemId: this.itemId });
    },
    appendNewField(filedId) {
      Object.keys(this.schema).forEach((property) => {
        if (property === filedId) {
          this.formData.push({
            name: property,
            description: this.schema[property].description,
            value: this.item[property] || '',
            type: 'text',
          });
        }
      });
    },
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

.edit-item {
  padding: 1rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  height: 100%;
  overflow-y: auto;
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
  .row {
    padding: 0.5rem 0.25rem;
    &:not(:last-child) {
      border-bottom: 1px dotted var(--config-settings-color);
    }
    .input-container input.input-field {
      font-size: 1rem;
      padding: 0.35rem 0.5rem;
    }
  }
  .more-fields {
    display: flex;
    flex-wrap: wrap;
    .add-field-tag {
      margin: 0.2rem;
      padding: 0.2rem 0.5rem;;
      min-width: 2rem;
      cursor: pointer;
      text-align: center;
      border: 1px solid var(--config-settings-color);
      border-radius: var(--curve-factor);
      &:hover {
        background: var(--config-settings-color);
        color: var(--config-settings-background);
      }
    }
  }
}

</style>
