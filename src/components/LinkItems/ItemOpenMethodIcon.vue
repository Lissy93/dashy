<template>
  <div :class="makeClass(position, isSmall, isTransparent)">
    <NewTabOpenIcon v-if="openingMethod === 'newtab'" />
    <SameTabOpenIcon v-else-if="openingMethod === 'sametab'" />
    <IframeOpenIcon v-else-if="openingMethod === 'iframe'" />
  </div>
</template>

<script>
import NewTabOpenIcon from '@/assets/icons/open-new-tab.svg';
import SameTabOpenIcon from '@/assets/icons/open-current-tab.svg';
import IframeOpenIcon from '@/assets/icons/open-iframe.svg';

export default {
  name: 'ItemOpenMethodIcon',
  props: {
    openingMethod: String, // newtab | sametab | iframe
    isSmall: Boolean, // If true, will apply small class
    position: String, // Position classes: top, bottom, left, right
    isTransparent: Boolean, // If true, will apply opacity
  },
  methods: {
    /* Returns custom class string, from optional props */
    makeClass(position = 'top right', isSmall = false, transparent = false) {
      return `opening-method-icon
      ${position || 'top right'}
      ${isSmall ? 'short' : ''}
      ${transparent ? 'transparent' : ''}`;
    },
  },
  components: {
    NewTabOpenIcon,
    SameTabOpenIcon,
    IframeOpenIcon,
  },
};
</script>

<style scoped lang="scss">
.opening-method-icon {
  svg {
    position: absolute;
    width: 1rem;
    margin: 2px;
    path {
      fill: var(--primary);
    }
  }
  &.top svg { top: 0; }
  &.bottom svg { bottom: 0; }
  &.left svg { left: 0; }
  &.right svg { right: 0; }

  &.short svg {
    width: 0.8rem;
    margin: 0;
  }

  &.transparent svg {
    opacity: 0.5;
  }
}

</style>
