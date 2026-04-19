<template>
  <router-link to="/" class="page-titles" :disabled="isEditMode">
    <!-- Optional page logo image -->
    <img v-if="logo" :src="logo" class="site-logo" />
    <!-- Page heading and sub-heading -->
    <div class="text">
      <h1>{{ title }}</h1>
      <span class="subtitle">{{ description }}</span>
    </div>
    <!-- When in edit mode, show Edit Title button -->
    <EditModeIcon v-if="isEditMode" @click="editTitle()"
      class="edit-icon" v-tooltip="tooltip()" />
  </router-link>
</template>

<script>
import EditModeIcon from '@/assets/interface-icons/interactive-editor-edit-mode.svg';
import StoreKeys from '@/utils/StoreMutations';
import { modalNames } from '@/utils/config/defaults';

export default {
  name: 'PageTitle',
  props: {
    title: String,
    description: String,
    logo: String,
  },
  components: {
    EditModeIcon,
  },
  computed: {
    isEditMode() {
      return this.$store.state.editMode;
    },
  },
  methods: {
    /* On edit button click, open the edit pageInfo modal */
    editTitle() {
      this.$modal.show(modalNames.EDIT_PAGE_INFO);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    /* Edit button tooltip */
    tooltip() {
      const content = this.$t('interactive-editor.menu.edit-page-info-btn');
      return { content };
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

.page-titles {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  text-decoration: none;
  position: relative;
  .text { min-width: 0; }
  h1 {
    color: var(--heading-text-color);
    font-size: clamp(1.4rem, 0.5rem + 3vw, 2.5rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }
  span.subtitle {
    color: var(--heading-text-color);
    font-style: italic;
    text-shadow: 1px 1px 2px #130f2347;
    opacity: var(--dimming-factor);
  }
  img.site-logo {
    margin: 0.2rem 0.5rem 0.2rem 0;
    max-width: 3.5rem;
    height: fit-content;
  }
  @include phone {
    flex-direction: column;
    text-align: center;
    padding: 0.25rem 0;
  }
  &[disabled] {
    cursor: default;
  }
  svg.edit-icon {
    width: 1rem;
    height: 1rem;
    right: 1rem;
    top: 0.5rem;
    padding: 0.25rem;
    margin: 0.25rem;
    cursor: pointer;
    color: var(--primary);
    border: 1px solid var(--background-darker);
    border-radius: var(--curve-factor);
    &:hover { border: 1px solid var(--primary); }
  }
}
</style>
