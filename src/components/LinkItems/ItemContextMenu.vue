<template>
  <transition name="slide">
    <div class="context-menu" v-if="show && !isMenuDisabled"
      :style="posX && posY ? `top:${posY}px;left:${posX}px;` : ''">
      <!-- Open Options -->
      <ul class="menu-section">
        <li class="section-title">
          {{ $t('context-menus.item.open-section-title') }}
        </li>
        <li @click="launch('sametab')">
          <SameTabOpenIcon />
          <span>{{ $t('context-menus.item.sametab') }}</span>
        </li>
        <li @click="launch('newtab')">
          <NewTabOpenIcon />
          <span>{{ $t('context-menus.item.newtab') }}</span>
        </li>
        <li @click="launch('modal')">
          <IframeOpenIcon />
          <span>{{ $t('context-menus.item.modal') }}</span>
        </li>
        <li @click="launch('workspace')">
          <WorkspaceOpenIcon />
          <span>{{ $t('context-menus.item.workspace') }}</span>
        </li>
        <li @click="launch('clipboard')">
          <ClipboardOpenIcon />
          <span>{{ $t('context-menus.item.clipboard') }}</span>
        </li>
      </ul>
      <!-- Edit Options -->
      <ul class="menu-section" v-bind:class="{ disabled: !isEditAllowed }">
        <li class="section-title">
          {{ $t('context-menus.item.options-section-title') }}
        </li>
        <li @click="openSettings()">
          <EditIcon />
          <span>{{ $t('context-menus.item.edit-item') }}</span>
        </li>
        <li v-if="isEditMode" @click="openMoveMenu()">
          <MoveIcon />
          <span>{{ $t('context-menus.item.move-item') }}</span>
        </li>
        <li v-if="isEditMode" @click="openDeleteItem()">
          <BinIcon />
          <span>{{ $t('context-menus.item.remove-item') }}</span>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
// Import icons for each element
import EditIcon from '@/assets/interface-icons/config-edit-json.svg';
import BinIcon from '@/assets/interface-icons/interactive-editor-remove.svg';
import MoveIcon from '@/assets/interface-icons/interactive-editor-move-to.svg';
import SameTabOpenIcon from '@/assets/interface-icons/open-current-tab.svg';
import NewTabOpenIcon from '@/assets/interface-icons/open-new-tab.svg';
import IframeOpenIcon from '@/assets/interface-icons/open-iframe.svg';
import WorkspaceOpenIcon from '@/assets/interface-icons/open-workspace.svg';
import ClipboardOpenIcon from '@/assets/interface-icons/open-clipboard.svg';

export default {
  name: 'ContextMenu',
  components: {
    EditIcon,
    MoveIcon,
    BinIcon,
    SameTabOpenIcon,
    NewTabOpenIcon,
    IframeOpenIcon,
    WorkspaceOpenIcon,
    ClipboardOpenIcon,
  },
  props: {
    posX: Number, // The X coordinate for positioning
    posY: Number, // The Y coordinate for positioning
    show: Boolean, // Should show or hide the menu
    disableEdit: Boolean, // Disable editing for certain items
  },
  computed: {
    isMenuDisabled() {
      return !!this.$store.getters.appConfig.disableContextMenu;
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
    isEditAllowed() {
      if (this.disableEdit) return false;
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  methods: {
    /* Called on item click, emits an event up to Item */
    /* in order to launch the current app to a given target */
    launch(target) {
      this.$emit('launchItem', target);
    },
    openSettings() {
      if (this.isEditAllowed) {
        this.$emit('openItemSettings');
      }
    },
    openMoveMenu() {
      if (this.isEditAllowed) {
        this.$emit('openMoveItemMenu');
      }
    },
    openDeleteItem() {
      if (this.isEditAllowed) {
        this.$emit('openDeleteItem');
      }
    },
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

  ul.menu-section {
    list-style-type: none;
    margin: 0;
    padding: 0;
    &:not(:last-child) {
      border-bottom: 1px solid var(--context-menu-color);
    }
    li {
      cursor: pointer;
      padding: 0.5rem 1rem;
      display: flex;
      flex-direction: row;
      font-size: 1rem;
      &:not(:last-child) {
        border-bottom: 1px solid var(--context-menu-secondary-color);
      }
      &:hover:not(.section-title) {
        background: var(--context-menu-secondary-color);
      }
      &.section-title {
        cursor: default;
        font-weight: bold;
        justify-content: center;
      }
      svg {
        width: 1rem;
         margin-right: 0.5rem;
          path { fill: currentColor; }
      }
    }
    &.disabled li:not(.section-title) {
      cursor: not-allowed;
      opacity: var(--dimming-factor);
      &:hover {
        background: var(--context-menu-background);
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
