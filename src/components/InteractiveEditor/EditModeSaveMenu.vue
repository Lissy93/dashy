<template>
  <div class="edit-mode-bottom-banner">
    <div class="edit-banner-section intro-container">
      <p class="edit-mode-intro l-1">You are in Edit Mode</p>
      <p class="edit-mode-intro l-2">
        This means you can make modifications to your config,
        and preview the results, but until you save, none of your changes will be preserved.
      </p>
    </div>
    <div class="edit-banner-section"></div>
    <div class="edit-banner-section save-buttons-container">
      <Button :click="reset">Reset</Button>
      <Button>Export Config</Button>
      <Button>Save Locally</Button>
      <Button>Save to Disk</Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/FormElements/Button';
import StoreKeys from '@/utils/StoreMutations';

export default {
  name: 'EditModeSaveMenu',
  components: {
    Button,
  },
  methods: {
    reset() {
      this.$store.dispatch(StoreKeys.INITIALIZE_CONFIG);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

div.edit-mode-bottom-banner {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  vertical-align: middle;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-top: 2px solid var(--primary);
  background: var(--background);
  z-index: 5;
  box-shadow: 0 -5px 7px var(--transparent-50);
  .edit-banner-section {
    padding: 0.5rem;
  }
  .edit-banner-section.intro-container {
    max-width: 35%;
    p.edit-mode-intro {
      color: var(--primary);
      cursor: default;
      margin: 0;
      &.l-1 {
        font-weight: bold;
      }
    }
  }
  .edit-banner-section.save-buttons-container {
    display: flex;
    place-self: center;
    button {
      margin: 0.25rem;
      height: fit-content;
    }
  }
  @include tablet-down {
    flex-direction: column;
    .edit-banner-section,
    .edit-banner-section.intro-container {
      max-width: 90%;
      width: 100%;
      margin: 0.2rem auto;
      flex-direction: column;
    }
  }
}
</style>
