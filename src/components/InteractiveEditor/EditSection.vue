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
    <form @submit.prevent="saveSection" class="edit-section-form">
      <Input v-model="sectionData.name" label="Section Name" layout="horizontal" />
      <Input v-model="sectionData.icon" label="Section Icon" layout="horizontal" />
      <Select
        :options="sortByOptions"
        :initialOption="displayData.sortBy"
        label="Sort By"
        @update:modelValue="(val) => setDisplayData('sortBy', val)"
      />
      <Input
        :modelValue="displayData.rows"
        @update:modelValue="(val) => setDisplayData('rows', Number(val))"
        label="Rows" type="number" layout="horizontal"
      />
      <Input
        :modelValue="displayData.cols"
        @update:modelValue="(val) => setDisplayData('cols', Number(val))"
        label="Cols" type="number" layout="horizontal"
      />
      <Radio
        :options="boolOptions"
        :initialOption="String(!!displayData.collapsed)"
        label="Collapsed"
        @update:modelValue="(val) => setDisplayData('collapsed', val === 'true')"
      />
      <Radio
        :options="boolOptions"
        :initialOption="String(!!displayData.hideForGuests)"
        label="Hide for Guests"
        @update:modelValue="(val) => setDisplayData('hideForGuests', val === 'true')"
      />
    </form>
    <SaveCancelButtons
      :saveClick="saveSection"
      :cancelClick="modalClosed"
    />
    </div>
    <AccessError v-else />
  </modal>
</template>

<script>
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';
import Input from '@/components/FormElements/Input';
import Select from '@/components/FormElements/Select';
import Radio from '@/components/FormElements/Radio';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';
import AccessError from '@/components/Configuration/AccessError';

export default {
  name: 'EditSection',
  props: {
    sectionIndex: Number,
    isAddNew: Boolean,
  },
  components: {
    Input,
    Select,
    Radio,
    SaveCancelButtons,
    AccessError,
  },
  data() {
    return {
      modalName: modalNames.EDIT_SECTION,
      sectionData: {},
      sortByOptions: [
        'default', 'most-used', 'last-used',
        'alphabetical', 'reverse-alphabetical', 'random',
      ],
      boolOptions: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    };
  },
  computed: {
    displayData() {
      return this.sectionData.displayData || {};
    },
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  mounted() {
    const section = this.$store.getters.getSectionByIndex(this.sectionIndex);
    this.sectionData = section ? { ...section, displayData: { ...(section.displayData || {}) } } : {};
    this.$modal.show(modalNames.EDIT_SECTION);
  },
  methods: {
    setDisplayData(key, value) {
      if (!this.sectionData.displayData) {
        this.sectionData.displayData = {};
      }
      this.sectionData.displayData[key] = value;
    },
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$emit('closeEditSection');
    },
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
    margin-bottom: 2.5rem;
    .input-container {
      margin: 0.5rem 0;
      input.input-field {
        color: var(--interactive-editor-color);
        border-color: var(--interactive-editor-color);
        background: var(--interactive-editor-background);
      }
    }
    .select-container, .radio-container {
      margin: 0.5rem 0;
      color: var(--interactive-editor-color);
    }
  }
}
</style>
