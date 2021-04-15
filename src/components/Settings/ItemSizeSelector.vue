<template>
  <div>
    <span class="options-label">Icon Size</span>
    <div class="display-options">
      <IconSmall @click="updateIconSize('small')" v-tooltip="tooltip('Small')"
        :class="`layout-icon ${iconSize === 'small' ? 'selected' : ''}`" tabindex="2" />
      <IconMedium @click="updateIconSize('medium')" v-tooltip="tooltip('Medium')"
        :class="`layout-icon ${iconSize === 'medium' ? 'selected' : ''}`" tabindex="2" />
      <IconLarge @click="updateIconSize('large')" v-tooltip="tooltip('Large')"
        :class="`layout-icon ${iconSize === 'large' ? 'selected' : ''}`" tabindex="2" />
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
