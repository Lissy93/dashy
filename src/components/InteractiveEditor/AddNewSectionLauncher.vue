<!-- Main homepage for default view -->
<template>
  <div class="add-section">
  <!-- When in edit mode, show Add New Section button -->
  <div v-if="isEditMode" @click="openAddNewSectionMenu()" class="add-new-section">
    <p>➕ {{ $t('interactive-editor.edit-section.add-section-title') }}</p>
  </div>
  <!-- Add new section form -->
  <EditSectionMenu
    v-if="isEditMode && addNewSectionOpen"
    :isAddNew="true"
    @closeEditSection="closeEditSection"
  />
  </div>
</template>

<script>

import EditSectionMenu from '@/components/InteractiveEditor/EditSection.vue';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/defaults';

export default {
  name: 'add-section-container',
  components: {
    EditSectionMenu,
  },
  data: () => ({
    addNewSectionOpen: false,
  }),
  computed: {
    isEditMode() {
      return this.$store.state.editMode;
    },
  },
  methods: {
    openAddNewSectionMenu() {
      this.addNewSectionOpen = true;
      this.$modal.show(modalNames.EDIT_SECTION);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    closeEditSection() {
      this.addNewSectionOpen = false;
      this.$modal.hide(modalNames.EDIT_SECTION);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
  },
};
</script>

<style lang="scss" scoped>

.add-new-section {
  border: 2px dashed var(--primary);
  border-radius: var(--curve-factor);
  padding: var(--item-group-padding);
  background: var(--item-group-background);
  color: var(--primary);
  font-size: 1.2rem;
  cursor: pointer;
  text-align: center;
  height: fit-content;
  margin: 10px;
  min-width: 250px;
}

</style>
