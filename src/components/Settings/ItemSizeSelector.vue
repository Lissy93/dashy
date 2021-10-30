<template>
  <div>
    <span class="options-label">{{ $t('settings.item-size-label') }}</span>
    <div class="display-options">
      <IconSmall
        @click="updateIconSize('small')"
        v-tooltip="tooltip($t('settings.item-size-small'))"
        :class="`layout-icon ${iconSize === 'small' ? 'selected' : ''}`"
        tabindex="-2"
      />
      <IconMedium
        @click="updateIconSize('medium')"
        v-tooltip="tooltip($t('settings.item-size-medium'))"
        :class="`layout-icon ${iconSize === 'medium' ? 'selected' : ''}`"
        tabindex="-2"
      />
      <IconLarge
        @click="updateIconSize('large')"
        v-tooltip="tooltip($t('settings.item-size-large'))"
        :class="`layout-icon ${iconSize === 'large' ? 'selected' : ''}`"
        tabindex="-2"
      />
    </div>
  </div>
</template>

<script>
import StoreKeys from '@/utils/StoreMutations';
import IconSmall from '@/assets/interface-icons/icon-size-small.svg';
import IconMedium from '@/assets/interface-icons/icon-size-medium.svg';
import IconLarge from '@/assets/interface-icons/icon-size-large.svg';

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
      this.$store.commit(StoreKeys.SET_ITEM_SIZE, iconSize);
    },
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
    },
  },
};
</script>

<style scoped lang="scss">

span.options-label {
  color: var(--settings-text-color);
}

.display-options {
  color: var(--settings-text-color);
  svg {
    path {
      fill: var(--settings-text-color);
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
      background: var(--settings-text-color);
      path { fill: var(--background); }
    }
  }
}

</style>
