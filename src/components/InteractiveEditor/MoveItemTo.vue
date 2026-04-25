<template>
  <modal
    :name="modalName" @closed="close"
    :resizable="true" width="40%" height="40%" classes="dashy-modal">
    <div class="move-menu-inner" v-if="allowViewConfig">
    <!-- Title and item ID -->
      <h3 class="move-title">Move or Copy Item</h3>
      <p class="item-id">Editing {{ itemId }}</p>
      <!-- Radio, for move or copy -->
      <Radio
        v-model="operation"
        :options="operationRadioOptions"
        label="Operation Type"
        :initialOption="operation"
      />
      <!-- Select destionation section -->
      <Select
        v-model="selectedSection"
        :options="sectionList"
        :initialOption="selectedSection"
        label="Destination"
      />
      <!-- Radio, for choosing append to beginning or end -->
      <Radio
        v-model="appendTo"
        :options="appendToRadioOptions"
        label="Append To"
        :initialOption="appendTo"
      />
      <!-- Save and cancel buttons -->
      <SaveCancelButtons :saveClick="save" :cancelClick="close" />
    </div>
    <AccessError v-else />
  </modal>
</template>

<script>
import Select from '@/components/FormElements/Select';
import Radio from '@/components/FormElements/Radio';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';
import AccessError from '@/components/Configuration/AccessError';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/config/defaults';
import ErrorHandler, { InfoHandler, InfoKeys } from '@/utils/logging/ErrorHandler';

export default {
  name: 'MoveItemTo',
  components: {
    Select,
    Radio,
    AccessError,
    SaveCancelButtons,
  },
  props: {
    itemId: { type: String, required: true }, // Unique ID for item
    initialSection: { type: String, default: '' }, // The current section
  },
  data() {
    return {
      selectedSection: '',
      operation: 'move',
      appendTo: 'end',
      modalName: `${modalNames.MOVE_ITEM_TO}-${this.itemId}`,
      operationRadioOptions: [
        { label: 'Move', value: 'move' },
        { label: 'Copy', value: 'copy' },
      ],
      appendToRadioOptions: [
        { label: 'Beginning', value: 'beginning' },
        { label: 'End', value: 'end' },
      ],
    };
  },
  computed: {
    sections() {
      return this.$store.getters.sections;
    },
    sectionList() {
      return this.sections.map((section) => section.name);
    },
    currentSection() {
      let sectionName = '';
      this.sections.forEach((section) => {
        (section.items || []).forEach((item) => {
          if (item.id === this.itemId) sectionName = section.name;
        });
      });
      return sectionName;
    },
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  mounted() {
    this.selectedSection = this.currentSection;
  },
  methods: {
    save() {
      try {
        const item = this.$store.getters.getItemById(this.itemId);
        if (!item) throw new Error(`Item '${this.itemId}' not found`);
        // Copy item to new section
        this.$store.commit(StoreKeys.COPY_ITEM, {
          item, toSection: this.selectedSection, appendTo: this.appendTo,
        });
        // Remove item from previous section if moving
        if (this.operation === 'move') {
          this.$store.commit(StoreKeys.REMOVE_ITEM, {
            itemId: this.itemId, sectionName: this.currentSection,
          });
        }
        InfoHandler(
          `${this.operation === 'move' ? 'Moved' : 'Copied'} '${item.title}' `
            + `from '${this.currentSection}' to '${this.selectedSection}'`,
          InfoKeys.EDITOR,
        );
        this.close();
      } catch (e) {
        ErrorHandler(`Failed to ${this.operation} item`, e);
        this.$toast.error('Error. See Logs.');
      }
    },
    close() {
      this.$modal.hide(this.modalName);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
  },
};
</script>

<style scoped lang="scss">
.move-menu-inner {
  padding: 1rem;
  background: var(--interactive-editor-background);
  color: var(--interactive-editor-color);
  height: 100%;
  overflow-y: auto;
  h3.move-title {
    margin: 0.25rem 0;
  }
  p.item-id {
    font-size: 1rem;
    font-style: italic;
    margin: 0.25rem 0;
    opacity: var(--dimming-factor);
  }
  .button-wrapper {
    display: flex;
    width: fit-content;
    margin: 1.5rem auto;
    button {
      margin: 0 0.5rem;
    }
  }
}
</style>
