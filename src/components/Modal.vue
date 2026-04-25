<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      ref="overlay"
      class="modal-overlay"
      @mousedown="onOverlayDown"
      @click="onOverlayClick"
    >
      <dialog
        ref="dlg"
        open
        role="dialog"
        aria-modal="true"
        :aria-label="$t('general.close-modal')"
        :class="['dashy-modal', classes, { resizable }]"
        :style="{ width, height }"
      >
        <div v-if="$slots['top-right']" class="modal-top-right">
          <slot name="top-right" />
        </div>
        <button
          v-else
          type="button"
          class="modal-close-mobile"
          :aria-label="$t('general.close-modal')"
          @click="close"
        >×</button>
        <div class="modal-body">
          <slot />
        </div>
      </dialog>
    </div>
  </teleport>
</template>

<script>
import { register, unregister } from '@/plugins/modal';
import ErrorHandler from '@/utils/logging/ErrorHandler';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default {
  name: 'Modal',
  props: {
    name: { type: String, required: true },
    width: { type: [String, Number], default: '50%' },
    height: { type: [String, Number], default: '80%' },
    resizable: { type: Boolean, default: true },
    classes: { type: String, default: '' },
  },
  emits: ['before-open', 'opened', 'closed'],
  data: () => ({ isOpen: false, mouseDownTarget: null, prevFocus: null }),
  mounted() {
    register(this.name, { open: this.open, close: this.close });
  },
  beforeUnmount() {
    unregister(this.name);
    if (this.isOpen) this.teardown();
  },
  methods: {
    open() {
      if (this.isOpen) return;
      try {
        this.prevFocus = document.activeElement;
        this.$emit('before-open');
        this.isOpen = true;
        document.addEventListener('keydown', this.onKeyDown);
        const root = document.getElementById('dashy');
        if (root) root.setAttribute('inert', '');
        this.$nextTick(() => {
          this.$refs.dlg?.querySelector(FOCUSABLE)?.focus();
          this.$emit('opened');
        });
      } catch (e) {
        ErrorHandler(`Failed to open modal '${this.name}'`, e);
      }
    },
    close() {
      if (!this.isOpen) return;
      this.teardown();
      this.$emit('closed');
    },
    teardown() {
      this.isOpen = false;
      document.removeEventListener('keydown', this.onKeyDown);
      document.getElementById('dashy')?.removeAttribute('inert');
      this.prevFocus?.focus?.();
      this.prevFocus = null;
    },
    onKeyDown(e) {
      if (e.key === 'Escape') this.close();
    },
    onOverlayDown(e) {
      this.mouseDownTarget = e.target;
    },
    onOverlayClick(e) {
      if (e.target !== this.$refs.overlay) return;
      if (this.mouseDownTarget !== this.$refs.overlay) return;
      this.close();
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/media-queries.scss';

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #00000080;
}

dialog.dashy-modal {
  position: static;
  display: block;
  padding: 0;
  margin: 0;
  min-width: 350px;
  min-height: 200px;
  max-width: 95vw;
  max-height: 95vh;
  color: inherit;
  background: var(--background-darker);
  border: none;
  border-radius: var(--curve-factor);
  box-shadow: 0 40px 70px -2px hsl(0deg 0% 0% / 60%), 1px 1px 6px var(--primary);
  overflow: auto;

  &.resizable { resize: both; }

  .modal-body { height: 100%; }

  .modal-top-right {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
  }

  .modal-close-mobile {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    font-size: 1.75rem;
    line-height: 1;
    color: var(--primary);
    background: transparent;
    border: none;
    cursor: pointer;
    &:hover, &:focus-visible {
      background: var(--primary);
      color: var(--background);
      outline: none;
    }
  }

  @include phone {
    width: 100vw !important;
    height: 100vh !important;
    min-width: 0;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    resize: none;
    .modal-close-mobile { display: inline-flex; align-items: center; justify-content: center; }
  }
}
</style>
