<template>
  <modal
    :name="modalName"
    :resizable="true"
    width="55%"
    height="80%"
    classes="dashy-modal edit-item"
    @closed="modalClosed"
  >
  <span>Item Editor</span>
  <input />
  </modal>
</template>

<script>
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';

export default {
  name: 'EditItem',
  data() {
    return {
      modalName: modalNames.EDIT_ITEM,
    };
  },
  props: {},
  computed: {},
  components: {},
  mounted() {
    this.$modal.show(modalNames.EDIT_ITEM);
  },
  methods: {
    modalClosed() {
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

</style>
