<template>
  <button
    @click="click ? click() : () => null"
    :class="disallow ? 'disallowed': ''"
    :type="type || 'button'"
    :disabled="disabled || disallow"
    v-tooltip="hoverText"
    :title="tooltip"
  >
    <slot></slot>
    <slot name="text"></slot>
    <slot name="icon"></slot>
  </button>
</template>

<script>

export default {
  name: 'Button',
  props: {
    text: String, // The text to be displayed in the button
    click: Function, // Function to call when clicked
    disabled: Boolean, // If true, button cannot be clicked
    disallow: Boolean, // Show not-allowed cursor when true
    type: String, // The html button type attribute
    tooltip: String, // Text to be displayed on hover
  },
  computed: {
    /* If tooltip prop specified, then return config for v-tooltip */
    hoverText() {
      const content = this.tooltip;
      const trigger = 'hover focus';
      const delay = { show: 350, hide: 100 };
      return (content) ? { content, trigger, delay } : undefined;
    },
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
  &.disallowed {
    cursor: not-allowed !important;
  }
}

/* Default visual settings, can be overridden when needed */
button {
  color: var(--primary);
  background: var(--background);
  border: 1px solid var(--primary);
  border-radius: var(--curve-factor);
  &:hover:not(:disabled):not(.disallowed) {
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
