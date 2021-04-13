<template>
  <div>
    <span class="options-label">Icon Size</span>
    <div class="display-options">
      <IconSmall @click="updateIconSize('default')"
        :class="`layout-icon ${iconSize === 'small' ? 'selected' : ''}`" />
      <IconMedium class="layout-icon" @click="updateIconSize('horizontal')"
        :class="`layout-icon ${iconSize === 'medium' ? 'selected' : ''}`" />
      <IconLarge class="layout-icon" @click="updateIconSize('vertical')"
        :class="`layout-icon ${iconSize === 'large' ? 'selected' : ''}`" />
    </div>
  </div>
</template>

<script>
import IconSmall from '@/assets/icons/icon-size-small.svg';
import IconMedium from '@/assets/icons/icon-size-medium.svg';
import IconLarge from '@/assets/icons/icon-size-large.svg';

export default {
  name: 'IconSizeSelector',
  data() {
    return {
      input: '',
    };
  },
  props: {
    iconSize: String,
  },
  components: {
    IconSmall,
    IconMedium,
    IconLarge,
  },
  methods: {
    updateIconSize(iconSize) {
      this.$emit('iconSizeUpdated', iconSize);
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
    opacity: 0.8;
    cursor: pointer;
    &:hover, &.selected {
      background: var(--primary-transparent);
      path { fill: var(--background); }
    }
  }
}

</style>
