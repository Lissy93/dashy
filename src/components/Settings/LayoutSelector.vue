<template>
  <div>
    <span class="options-label">Layout</span>
    <div class="display-options">
      <IconDeafault @click="updateDisplayLayout('default')"
        :class="`layout-icon ${displayLayout === 'default' ? 'selected' : ''}`" />
      <IconHorizontal class="layout-icon" @click="updateDisplayLayout('horizontal')"
        :class="`layout-icon ${displayLayout === 'horizontal' ? 'selected' : ''}`" />
      <IconVertical class="layout-icon" @click="updateDisplayLayout('vertical')"
        :class="`layout-icon ${displayLayout === 'vertical' ? 'selected' : ''}`" />
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
  },
};
</script>

<style scoped lang="scss">

span.options-label {
  color: var(--primary);
}

.display-options {
  color: var(--primary-transparent);
  svg {
    path {
      fill: var(--primary-transparent);
    }
    width: 1rem;
    height: 1rem;
    margin: 0.2rem;
    padding: 0.2rem;
    text-align: center;
    background: var(--background);
    border: 1px solid currentColor;
    border-radius: 4px;
    cursor: pointer;
    &:hover, &.selected {
      background: var(--primary-transparent);
      path { fill: var(--background); }
    }
  }
}

</style>
