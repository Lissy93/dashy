<template>
  <transition name="slide">
    <div class="context-menu" v-if="show"
      :style="posX && posY ? `top:${posY}px;left:${posX}px;` : ''">
      <ul>
        <li><SameTabOpenIcon /> Open in Current Tab</li>
        <li><NewTabOpenIcon /> Open in New Tab</li>
        <li><IframeOpenIcon /> Open in Pop-Up Modal</li>
        <li><WorkspaceOpenIcon /> Open in Workspace View </li>
      </ul>
    </div>
  </transition>
</template>

<script>
// Import icons for each element
import SameTabOpenIcon from '@/assets/interface-icons/open-current-tab.svg';
import NewTabOpenIcon from '@/assets/interface-icons/open-new-tab.svg';
import IframeOpenIcon from '@/assets/interface-icons/open-iframe.svg';
import WorkspaceOpenIcon from '@/assets/interface-icons/open-workspace.svg';

export default {
  name: 'ContextMenu',
  inject: ['config'],
  components: {
    SameTabOpenIcon,
    NewTabOpenIcon,
    IframeOpenIcon,
    WorkspaceOpenIcon,
  },
  props: {
    posX: Number,
    posY: Number,
    show: Boolean,
  },
};
</script>

<style lang="scss">

div.context-menu {
  position: absolute;
  margin: 0;
  padding: 0;
  z-index: 8;
  background: var(--context-menu-background);
  color: var(--context-menu-color);
  border: 1px solid var(--context-menu-secondary-color);
  border-radius: var(--curve-factor);
  box-shadow: var(--context-menu-shadow);
  opacity: 0.98;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    li {
      cursor: pointer;
      padding: 0.5rem 1rem;
      display: flex;
      flex-direction: row;
      font-size: 1rem;
      &:not(:last-child) {
        border-bottom: 1px solid var(--context-menu-secondary-color);
      }
      &:hover {
        background: var(--context-menu-secondary-color);
      }
      svg {
        width: 1rem;
         margin-right: 0.5rem;
          path { fill: currentColor; }
      }
    }
  }
}

// Define enter and leave transitions
.slide-enter-active { animation: slide-in .1s; }
.slide-leave-active { animation: slide-in .1s reverse; }
@keyframes slide-in {
  0% { transform: scaleY(0.5) scaleX(0.8) translateY(-50px); }
  100% { transform: scaleY(1) translateY(0) translateY(0); }
}
</style>
