<template>
  <modal
    :name="modalName" @closed="modalClosed"
    :resizable="true" width="50%" height="80%"
    classes="dashy-modal edit-multi-pages"
  >
  <div class="edit-multi-pages-inner" v-if="allowViewConfig">
  <h3>{{ $t('interactive-editor.menu.edit-pages-btn') }}</h3>
  <div class="pages-list">
    <div v-for="(page, index) in formData" :key="index" class="page-entry">
      <div class="page-fields">
        <Input v-model="page.name" label="Name" layout="horizontal" />
        <Input v-model="page.path" label="Path" layout="horizontal" />
        <Radio
          :options="boolOptions"
          :initialOption="String(!!getHideForGuests(page))"
          label="Hide for Guests"
          @update:modelValue="(val) => setHideForGuests(page, val === 'true')"
        />
      </div>
      <div class="page-actions">
        <button @click="movePage(index, -1)" :disabled="index === 0" class="action-btn">▲</button>
        <button @click="movePage(index, 1)" :disabled="index === formData.length - 1" class="action-btn">▼</button>
        <button @click="removePage(index)" class="action-btn delete-btn">✕</button>
      </div>
    </div>
  </div>
  <button @click="addPage" class="add-page-btn">+ Add Page</button>
  <SaveCancelButtons :saveClick="saveToState" :cancelClick="cancelEditing" />
  </div>
  <AccessError v-else />
  </modal>
</template>

<script>
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';
import Input from '@/components/FormElements/Input';
import Radio from '@/components/FormElements/Radio';
import SaveCancelButtons from '@/components/InteractiveEditor/SaveCancelButtons';
import AccessError from '@/components/Configuration/AccessError';

export default {
  name: 'EditMultiPages',
  data() {
    return {
      formData: [],
      modalName: modalNames.EDIT_MULTI_PAGES,
      boolOptions: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    };
  },
  components: {
    Input,
    Radio,
    SaveCancelButtons,
    AccessError,
  },
  mounted() {
    const pages = this.$store.getters.pages;
    this.formData = pages ? pages.map(p => ({
      ...p,
      displayData: { ...(p.displayData || {}) },
    })) : [];
  },
  computed: {
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  methods: {
    getHideForGuests(page) {
      return page.displayData && page.displayData.hideForGuests;
    },
    setHideForGuests(page, value) {
      if (!page.displayData) page.displayData = {};
      page.displayData.hideForGuests = value;
    },
    addPage() {
      this.formData.push({ name: '', path: '', displayData: {} });
    },
    removePage(index) {
      this.formData.splice(index, 1);
    },
    movePage(index, direction) {
      const target = index + direction;
      const item = this.formData.splice(index, 1)[0];
      this.formData.splice(target, 0, item);
    },
    saveToState() {
      this.$store.commit(StoreKeys.SET_PAGES, this.formData);
      this.$modal.hide(this.modalName);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
    },
    cancelEditing() {
      this.$modal.hide(this.modalName);
    },
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

.edit-multi-pages-inner {
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
  .pages-list {
    margin-bottom: 1rem;
    .page-entry {
      display: flex;
      align-items: flex-start;
      padding: 0.75rem;
      margin: 0.5rem 0;
      border: 1px solid var(--interactive-editor-color);
      border-radius: var(--curve-factor);
      .page-fields {
        flex: 1;
        .input-container {
          margin: 0.25rem 0;
          input.input-field {
            color: var(--interactive-editor-color);
            border-color: var(--interactive-editor-color);
            background: var(--interactive-editor-background);
          }
        }
        .radio-container {
          color: var(--interactive-editor-color);
        }
      }
      .page-actions {
        display: flex;
        flex-direction: column;
        margin-left: 0.5rem;
        gap: 0.25rem;
        .action-btn {
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          color: var(--interactive-editor-color);
          background: var(--interactive-editor-background);
          border: 1px solid var(--interactive-editor-color);
          border-radius: var(--curve-factor);
          &:hover:not(:disabled) {
            color: var(--interactive-editor-background);
            background: var(--interactive-editor-color);
          }
          &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          &.delete-btn:hover:not(:disabled) {
            background: var(--danger);
            border-color: var(--danger);
          }
        }
      }
    }
  }
  .add-page-btn {
    min-width: 15rem;
    padding: 0.5rem 0.75rem;
    margin: 0.5rem 0;
    font-size: 1rem;
    cursor: pointer;
    color: var(--interactive-editor-color);
    background: var(--interactive-editor-background);
    border: 1px solid var(--interactive-editor-color);
    border-radius: var(--curve-factor);
    &:hover {
      color: var(--interactive-editor-background);
      background: var(--interactive-editor-color);
    }
  }
}
</style>
