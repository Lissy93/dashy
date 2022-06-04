<template>
  <div class="save-cancel-btn-container">
    <Button class="save-app-config-btn" :click="saveClick">
      {{ $t('interactive-editor.menu.save-stage-btn') }}
      <SaveIcon />
    </Button>
    <Button class="save-app-config-btn" :click="cancelClick">
      {{ $t('interactive-editor.menu.cancel-stage-btn') }}
      <CancelIcon />
    </Button>
  </div>
</template>

<script>

import Button from '@/components/FormElements/Button';
import SaveIcon from '@/assets/interface-icons/save-config.svg';
import CancelIcon from '@/assets/interface-icons/config-close.svg';

export default {
  name: 'SaveCancelButton',
  props: {
    saveClick: Function,
    cancelClick: Function,
  },
  components: {
    Button,
    SaveIcon,
    CancelIcon,
  },
};
</script>

<style scoped lang="scss">
.save-cancel-btn-container {
  display: flex;
  margin: 0.5rem 0;
  justify-content: center;
  border-top: 1px dashed var(--interactive-editor-color);
    button {
    margin: 1rem 0.5rem;
    color: var(--interactive-editor-color);
    border-color: var(--interactive-editor-color);
    background: var(--interactive-editor-background);
    svg {
      border: none;
      width: 1.2rem;
      height: 1.2rem;
    }
    &:hover {
      color: var(--interactive-editor-background);
      border-color: var(--interactive-editor-color);
      background: var(--interactive-editor-color);
      svg {
        background: var(--interactive-editor-color);
        path { fill: var(--interactive-editor-background); }
      }
    }
    &:focus {
      box-shadow: 1px 1px 6px var(--interactive-editor-color);
    }
  }
}
</style>
