<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="50%"
    height="80%"
    classes="dashy-modal edit-page-info"
    @closed="modalClosed"
  >
  <div class="edit-page-info-inner">
  <h3>{{ $t('interactive-editor.menu.edit-page-info-btn') }}</h3>
  <FormSchema
    :schema="schema"
    v-model="formData"
    @submit.prevent="saveToState"
    class="page-info-form"
    name="pageInfoForm"
  >
    <Button type="submit">
      {{ $t('interactive-editor.menu.save-stage-btn') }}
      <SaveIcon />
    </button>
  </FormSchema>
  </div>
  </modal>
</template>

<script>
import FormSchema from '@formschema/native';
import DashySchema from '@/utils/ConfigSchema';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';
import Button from '@/components/FormElements/Button';
import SaveIcon from '@/assets/interface-icons/save-config.svg';

export default {
  name: 'EditPageInfo',
  data() {
    return {
      formData: {},
      schema: DashySchema.properties.pageInfo,
      modalName: modalNames.EDIT_PAGE_INFO,
    };
  },
  props: {},
  components: {
    FormSchema,
    Button,
    SaveIcon,
  },
  mounted() {
    this.formData = this.pageInfo;
  },
  computed: {
    pageInfo() {
      return this.$store.getters.pageInfo;
    },
  },
  methods: {
    /* When form submitteed, update VueX store with new pageInfo, and close modal */
    saveToState() {
      this.$store.commit(StoreKeys.UPDATE_PAGE_INFO, this.formData);
      this.$modal.hide(this.modalName);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, true);
    },
    /* Called when modal manually closed, updates state to allow searching again */
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';
@import '@/styles/schema-editor.scss';

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
    @extend .schema-form;
    margin-bottom: 2.5rem;
  }
}

</style>
