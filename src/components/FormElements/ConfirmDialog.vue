<template>
  <dialog
    ref="dlg"
    class="confirm-dialog"
    :class="{ danger }"
    @close="onNativeClose"
    @cancel.prevent="cancel"
    @keydown.enter.prevent="confirm"
  >
    <h3 v-if="title" class="title">{{ title }}</h3>
    <div class="body">
      <p v-if="message" class="message">{{ message }}</p>
      <slot />
    </div>
    <div class="actions">
      <button ref="cancelBtn" type="button" class="btn cancel" @click="cancel">
        {{ cancelText || $t('general.cancel') }}
      </button>
      <button type="button" class="btn confirm" @click="confirm">
        {{ confirmText || $t('general.confirm') }}
      </button>
    </div>
  </dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    confirmText: { type: String, default: '' },
    cancelText: { type: String, default: '' },
    danger: { type: Boolean, default: false },
  },
  emits: ['update:open', 'confirm', 'cancel'],
  watch: {
    open: {
      immediate: true,
      handler(v) { this.$nextTick(() => (v ? this.show() : this.hide())); },
    },
  },
  beforeUnmount() { this.hide(); },
  methods: {
    show() {
      const d = this.$refs.dlg;
      if (!d || d.open) return;
      d.showModal();
      this.$nextTick(() => this.$refs.cancelBtn?.focus());
    },
    hide() {
      const d = this.$refs.dlg;
      if (d?.open) d.close();
    },
    confirm() {
      this.$emit('confirm');
      this.$emit('update:open', false);
    },
    cancel() {
      this.$emit('cancel');
      this.$emit('update:open', false);
    },
    onNativeClose() {
      if (this.open) this.$emit('update:open', false);
    },
  },
};
</script>

<style scoped lang="scss">
.confirm-dialog {
  padding: 0;
  width: min(28rem, calc(100vw - 2rem));
  color: var(--config-settings-color);
  background: var(--config-settings-background);
  border: 1px solid var(--primary);
  border-radius: var(--curve-factor);
  box-shadow: 0 20px 50px -10px hsl(0deg 0% 0% / 60%);

  &::backdrop {
    background: #00000080;
  }

  .title {
    margin: 0;
    padding: 1rem 1.25rem;
    font-size: 1.2rem;
    color: var(--primary);
    border-bottom: 1px solid var(--primary);
  }

  .body {
    padding: 1rem 1.25rem;
    .message {
      margin: 0;
      white-space: pre-line;
      line-height: 1.4;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem 1rem;

    .btn {
      padding: 0.4rem 0.9rem;
      font-size: 1rem;
      cursor: pointer;
      color: var(--primary);
      background: transparent;
      border: 1px solid var(--primary);
      border-radius: var(--curve-factor);

      &:hover, &:focus-visible {
        color: var(--background);
        background: var(--primary);
        outline: none;
      }
    }

    .cancel {
      opacity: var(--dimming-factor);
      &:hover, &:focus-visible { opacity: 1; }
    }
  }

  &.danger .actions .confirm {
    color: var(--danger);
    border-color: var(--danger);
    &:hover, &:focus-visible {
      color: var(--background);
      background: var(--danger);
      border-color: var(--danger);
    }
  }
}
</style>
