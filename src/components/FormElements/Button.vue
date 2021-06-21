<template>
  <button @click="click()" :disabled="disabled">
    <slot></slot>
    <slot name="text"></slot>
    <slot name="icon"></slot>
  </button>
</template>

<script>

export default {
  name: 'Button',
  props: {
    text: String,
    click: Function,
    disabled: Boolean,
  },
};
</script>

<style scoped lang="scss">

/* Layout settings */
button {
  display: flex;
  justify-content: center;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin: 0.5rem auto;
  font-size: 1.2rem;
  min-width: 10rem;
  cursor: pointer;
  svg {
    width: 1.2rem;
    margin: 0 0.5rem;
    path, g {
      fill: currentColor;
    }
  }
}

/* Default visual settings, can be overridden when needed */
button {
  color: var(--primary);
  background: var(--background);
  border: 1px solid var(--primary);
  border-radius: var(--curve-factor);
  &:hover:not(:disabled) {
    color: var(--background);
    background: var(--primary);
    border-color: var(--background);
  }
  &:disabled {
    cursor: progress;
    opacity: var(--dimming-factor);
  }
}
</style>
