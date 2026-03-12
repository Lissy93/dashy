<template>
  <modal
    :name="modalName" @closed="modalClosed"
    :resizable="true" width="50%" height="80%"
    classes="dashy-modal edit-page-info"
  >
  <div class="edit-page-info-inner" v-if="allowViewConfig">
  <h3>{{ $t('interactive-editor.menu.edit-page-info-btn') }}</h3>
  <form @submit.prevent="saveToState" class="page-info-form">
    <Input v-model="formData.title" label="Title" layout="horizontal" />
    <Input v-model="formData.description" label="Description" layout="horizontal" />
    <Input v-model="formData.footerText" label="Footer Text" layout="horizontal" />
    <Input v-model="formData.logo" label="Logo" layout="horizontal" />
    <Button type="submit">
      {{ $t('interactive-editor.menu.save-stage-btn') }}
      <SaveIcon />
    </Button>
  </form>
  </div>
  <AccessError v-else />
  </modal>
</template>

<script>
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';
import Button from '@/components/FormElements/Button';
import Input from '@/components/FormElements/Input';
import SaveIcon from '@/assets/interface-icons/save-config.svg';
import AccessError from '@/components/Configuration/AccessError';

export default {
  name: 'EditPageInfo',
  data() {
    return {
      formData: {},
      modalName: modalNames.EDIT_PAGE_INFO,
    };
  },
  components: {
    Button,
    Input,
    SaveIcon,
    AccessError,
  },
  mounted() {
    this.formData = { ...this.pageInfo };
  },
  computed: {
    pageInfo() {
      return this.$store.getters.pageInfo;
    },
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  methods: {
    saveToState() {
      this.$store.commit(StoreKeys.SET_PAGE_INFO, this.formData);
      this.$modal.hide(this.modalName);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
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

.edit-page-info-inner {
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
  .page-info-form {
    margin-bottom: 2.5rem;
    .input-container {
      margin: 0.5rem 0;
      input.input-field {
        color: var(--interactive-editor-color);
        border-color: var(--interactive-editor-color);
        background: var(--interactive-editor-background);
      }
    }
    button {
      margin: 1rem auto;
      display: flex;
      svg { width: 1rem; height: 1rem; margin-left: 0.25rem; }
    }
  }
}
</style>
