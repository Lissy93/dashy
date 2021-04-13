<template>
  <div :class="`opening-method-icon  ${isSmall? 'short': ''}`">
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
    openingMethod: String,
    isSmall: Boolean,
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
    right: 0;
    top: 0;
    path {
      fill: var(--primary-transparent);
    }
  }
  &.short svg {
    width: 0.5rem;
    margin: 0;
  }
}

</style>
