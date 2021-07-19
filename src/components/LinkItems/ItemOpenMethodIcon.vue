<template>
  <div>
    <div :class="makeClass(position, isSmall, isTransparent)">
      <NewTabOpenIcon v-if="openingMethod === 'newtab'" />
      <SameTabOpenIcon v-else-if="openingMethod === 'sametab'" />
      <IframeOpenIcon v-else-if="openingMethod === 'modal'" />
      <WorkspaceOpenIcon v-else-if="openingMethod === 'workspace'" />
    </div>
    <div v-if="hotkey" :class="`hotkey-denominator ${makeClass(position, isSmall, isTransparent)}`">
      {{ hotkey }}
    </div>
  </div>
</template>

<script>
/* This component displays a small icon, indicating opening method */

// Import Icons
import NewTabOpenIcon from '@/assets/interface-icons/open-new-tab.svg';
import SameTabOpenIcon from '@/assets/interface-icons/open-current-tab.svg';
import IframeOpenIcon from '@/assets/interface-icons/open-iframe.svg';
import WorkspaceOpenIcon from '@/assets/interface-icons/open-workspace.svg';

export default {
  name: 'ItemOpenMethodIcon',
  props: {
    openingMethod: String, // newtab | sametab | modal | workspace
    isSmall: Boolean, // If true, will apply small class
    position: String, // Position classes: top, bottom, left, right
    isTransparent: Boolean, // If true, will apply opacity
    hotkey: Number, // Optional hotkey to also display
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
    WorkspaceOpenIcon,
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
      fill: currentColor;
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

div.hotkey-denominator {
  position: absolute;
  font-size: 0.8rem;
  margin: 2px;
  bottom: 2px;
  color: currentColor;
  border-radius: 18px;
  border: 1px solid currentColor;
  padding: 0.1rem 0.4rem 0.2rem 0.4rem;
  &.top { right: 0; } // Position opposite of opening method icon
  &.bottom { left: 0; }
}

</style>
