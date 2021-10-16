<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="50%"
    height="50%"
    classes="dashy-modal edit-item"
    @closed="modalClosed"
  >
  <h3>Edit Item</h3>
  <form>
    <div class="row" v-for="row in formData" :key="row.name">
      <Input
        :label="row.name"
        :value="row.value"
        :description="row.description"
        layout="horizontal"
        />
    </div>
  </form>
  </modal>
</template>

<script>
import Input from '@/components/FormElements/Input';
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
      item: {},
    };
  },
  props: {
    itemId: String,
  },
  computed: {},
  components: {
    Input,
  },
  mounted() {
    this.item = this.getItemFromState(this.itemId);
    this.formData = this.makeInitialFormData();
    this.$modal.show(modalNames.EDIT_ITEM);
  },
  methods: {
    makeInitialFormData() {
      const formData = [];
      Object.keys(this.schema).forEach((property) => {
        if (this.item[property]) {
          formData.push({
            name: property,
            description: this.schema[property].description,
            value: this.item[property] || '',
          });
        }
      });
      return formData;
    },
    getItemFromState(id) {
      return this.$store.getters.getItemById(id);
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
  .row {
    padding: 0.5rem 0.25rem;
    &:not(:last-child) {
      border-bottom: 1px dotted var(--config-settings-color);
    }
  }
}

</style>
