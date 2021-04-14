<template>
  <div>
    <span class="options-label">Layout</span>
    <div class="display-options">
      <IconDeafault @click="updateDisplayLayout('default')" v-tooltip="tooltip('Auto')"
        :class="`layout-icon ${displayLayout === 'default' ? 'selected' : ''}`" tabindex="2" />
      <IconHorizontal @click="updateDisplayLayout('horizontal')" v-tooltip="tooltip('Horizontal')"
        :class="`layout-icon ${displayLayout === 'horizontal' ? 'selected' : ''}`" tabindex="2" />
      <IconVertical @click="updateDisplayLayout('vertical')" v-tooltip="tooltip('Vertical')"
        :class="`layout-icon ${displayLayout === 'vertical' ? 'selected' : ''}`" tabindex="2" />
    </div>
  </div>
</template>

<script>
import IconDeafault from '@/assets/icons/layout-default.svg';
import IconHorizontal from '@/assets/icons/layout-horizontal.svg';
import IconVertical from '@/assets/icons/layout-vertical.svg';

export default {
  name: 'LayoutSelector',
  data() {
    return {
      input: '',
    };
  },
  props: {
    displayLayout: String,
  },
  components: {
    IconDeafault,
    IconHorizontal,
    IconVertical,
  },
  methods: {
    updateDisplayLayout(layout) {
      this.$emit('layoutUpdated', layout);
    },
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
    },
  },
};
</script>

<style scoped lang="scss">

span.options-label {
  color: var(--primary);
}

.display-options {
  color: var(--primary);
  svg {
    path {
      fill: var(--primary);
    }
    width: 1rem;
    height: 1rem;
    margin: 0.2rem;
    padding: 0.2rem;
    text-align: center;
    background: var(--background);
    border: 1px solid currentColor;
    border-radius: var(--curve-factor);
    cursor: pointer;
    &:hover, &.selected {
      background: var(--primary);
      path { fill: var(--background); }
    }
  }
}

</style>
