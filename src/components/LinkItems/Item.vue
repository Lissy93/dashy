<template ref="container">
  <div :class="`item-wrapper wrap-size-${itemSize}`">
    <a @click="itemOpened"
      @mouseup.right="openContextMenu"
      @contextmenu.prevent
      :href="hyperLinkHref"
      :target="anchorTarget"
      :class="`item ${makeClassList}`"
      v-tooltip="getTooltipOptions()"
      rel="noopener noreferrer" tabindex="0"
      :id="`link-${id}`"
      :style="`--open-icon: ${getUnicodeOpeningIcon()}; color: ${color};  ${customStyles}`"
    >
      <!-- Item Text -->
      <div :class="`tile-title  ${!icon? 'bounce no-icon': ''}`" :id="`tile-${id}`" >
        <span class="text">{{ title }}</span>
        <p class="description">{{ description }}</p>
      </div>
      <!-- Item Icon -->
      <Icon :icon="icon" :url="url" :size="itemSize" :color="color"
        v-bind:style="customStyles" class="bounce" />
      <!-- Small icon, showing opening method on hover -->
      <ItemOpenMethodIcon class="opening-method-icon" :isSmall="!icon || itemSize === 'small'"
        :openingMethod="accumulatedTarget"  position="bottom right"
        :hotkey="hotkey" />
      <!-- Status indicator dot (if enabled) showing weather srevice is availible -->
      <StatusIndicator
        class="status-indicator"
        v-if="enableStatusCheck"
        :statusSuccess="statusResponse ? statusResponse.successStatus : undefined"
        :statusText="statusResponse ? statusResponse.message : undefined"
      />
      <!-- Edit icon (displayed only when in edit mode) -->
      <EditModeIcon v-if="isEditMode" class="edit-mode-item" @click="openItemSettings()" />
    </a>
    <!-- Right-click context menu -->
    <ContextMenu
      :show="contextMenuOpen && !isAddNew"
      v-click-outside="closeContextMenu"
      :posX="contextPos.posX"
      :posY="contextPos.posY"
      :id="`context-menu-${id}`"
      @launchItem="launchItem"
      @openItemSettings="openItemSettings"
      @openMoveItemMenu="openMoveItemMenu"
      @openDeleteItem="openDeleteItem"
    />
    <!-- Edit and move item menu modals -->
    <MoveItemTo v-if="isEditMode" :itemId="id" />
    <EditItem v-if="editMenuOpen" :itemId="id"
      @closeEditMenu="closeEditMenu"
      :isNew="isAddNew" :parentSectionTitle="parentSectionTitle" />
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import Icon from '@/components/LinkItems/ItemIcon.vue';
import ItemOpenMethodIcon from '@/components/LinkItems/ItemOpenMethodIcon';
import StatusIndicator from '@/components/LinkItems/StatusIndicator';
import EditItem from '@/components/InteractiveEditor/EditItem';
import MoveItemTo from '@/components/InteractiveEditor/MoveItemTo';
import ContextMenu from '@/components/LinkItems/ItemContextMenu';
import StoreKeys from '@/utils/StoreMutations';
import { targetValidator } from '@/utils/ConfigHelpers';
import EditModeIcon from '@/assets/interface-icons/interactive-editor-edit-mode.svg';
import {
  localStorageKeys,
  serviceEndpoints,
  modalNames,
  openingMethod as defaultOpeningMethod,
} from '@/utils/defaults';

export default {
  name: 'Item',
  props: {
    id: String, // The unique ID of a tile (e.g. 001)
    title: String, // The main text of tile, required
    subtitle: String, // Optional sub-text
    description: String, // Optional tooltip hover text
    icon: String, // Optional path to icon, within public/img/tile-icons
    color: String, // Optional text and icon color, specified in hex code
    backgroundColor: String, // Optional item background color
    url: String, // URL to the resource, optional but recommended
    provider: String, // Optional provider name, for external apps
    hotkey: Number, // Shortcut for quickly launching app
    target: { // Where resource will open, either 'newtab', 'sametab' or 'modal'
      type: String,
      validator: targetValidator,
    },
    itemSize: String, // Item size: small | medium | large
    enableStatusCheck: Boolean, // Should run status checks
    statusCheckHeaders: Object, // Custom status check headers
    statusCheckUrl: String, // Custom URL for status check endpoint
    statusCheckInterval: Number, // Num seconds beteween repeating checks
    statusCheckAllowInsecure: Boolean, // Status check ignore SSL certs
    statusCheckAcceptCodes: String, // Allow status checks to pass with a code other than 200
    parentSectionTitle: String, // Title of parent section (for add new)
    isAddNew: Boolean, // Only set if 'fake' item used as Add New button
  },
  components: {
    Icon,
    ItemOpenMethodIcon,
    StatusIndicator,
    ContextMenu,
    MoveItemTo,
    EditItem,
    EditModeIcon,
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
    accumulatedTarget() {
      return this.target || this.appConfig.defaultOpeningMethod || defaultOpeningMethod;
    },
    /* Based on item props, adjust class names */
    makeClassList() {
      const {
        icon, itemSize, isAddNew, isEditMode,
      } = this;
      return `size-${itemSize} ${!icon ? 'short' : ''} `
       + `${isAddNew ? 'add-new' : ''} ${isEditMode ? 'is-edit-mode' : ''}`;
    },
    /* Convert config target value, into HTML anchor target attribute */
    anchorTarget() {
      if (this.isEditMode) return '_self';
      const target = this.accumulatedTarget;
      switch (target) {
        case 'sametab': return '_self';
        case 'newtab': return '_blank';
        case 'parent': return '_parent';
        case 'top': return '_top';
        default: return undefined;
      }
    },
    /* Get href for anchor, if not in edit mode, or opening in modal/ workspace */
    hyperLinkHref() {
      const nothing = '#';
      if (this.isEditMode) return nothing;
      const noAnchorNeeded = ['modal', 'workspace', 'clipboard'];
      return noAnchorNeeded.includes(this.accumulatedTarget) ? nothing : this.url;
    },
  },
  data() {
    return {
      contextMenuOpen: false,
      getId: this.id,
      customStyles: {
        color: this.color,
        background: this.backgroundColor,
      },
      statusResponse: undefined,
      contextPos: {
        posX: undefined,
        posY: undefined,
      },
      editMenuOpen: false,
    };
  },
  methods: {
    /* Called when an item is clicked, manages the opening of modal & resets the search field */
    itemOpened(e) {
      if (this.isEditMode) {
        // If in edit mode, open settings, and don't launch app
        this.openItemSettings();
        return;
      }
      if (e.altKey || this.accumulatedTarget === 'modal') {
        e.preventDefault();
        this.$emit('triggerModal', this.url);
      } else if (this.accumulatedTarget === 'workspace') {
        router.push({ name: 'workspace', query: { url: this.url } });
      } else if (this.accumulatedTarget === 'clipboard') {
        navigator.clipboard.writeText(this.url);
        this.$toasted.show(this.$t('context-menus.item.copied-toast'));
      } else {
        this.$emit('itemClicked');
      }
      // Update the most/ last used ledger, for smart-sorting
      if (!this.appConfig.disableSmartSort) {
        this.incrementMostUsedCount(this.id);
        this.incrementLastUsedCount(this.id);
      }
    },
    /* Open custom context menu, and set position */
    openContextMenu(e) {
      this.contextMenuOpen = !this.contextMenuOpen;
      if (e && window) {
        // Calculate placement based on cursor and scroll position
        this.contextPos = {
          posX: e.clientX + window.pageXOffset,
          posY: e.clientY + window.pageYOffset,
        };
      }
    },
    /* Closes the context menu, called when user clicks literally anywhere */
    closeContextMenu() {
      this.contextMenuOpen = false;
    },
    /* Returns configuration object for the tooltip */
    getTooltipOptions() {
      if (!this.description && !this.provider) return {}; // If no description, then skip
      const description = this.description ? this.description : '';
      const providerText = this.provider ? `<b>Provider</b>: ${this.provider}` : '';
      const lb1 = description && providerText ? '<br>' : '';
      const hotkeyText = this.hotkey ? `<br>Press '${this.hotkey}' to launch` : '';
      const tooltipText = providerText + lb1 + description + hotkeyText;
      const editText = this.$t('interactive-editor.edit-section.edit-tooltip');
      return {
        content: (this.isEditMode ? editText : tooltipText),
        trigger: 'hover focus',
        hideOnTargetClick: true,
        html: true,
        placement: this.statusResponse ? 'left' : 'auto',
        delay: { show: 600, hide: 200 },
        classes: `item-description-tooltip tooltip-is-${this.itemSize}`,
      };
    },
    /* Used by certain themes (material), to show animated CSS icon */
    getUnicodeOpeningIcon() {
      switch (this.accumulatedTarget) {
        case 'newtab': return '"\\f360"';
        case 'sametab': return '"\\f24d"';
        case 'parent': return '"\\f3bf"';
        case 'top': return '"\\f102"';
        case 'modal': return '"\\f2d0"';
        case 'workspace': return '"\\f0b1"';
        case 'clipboard': return '"\\f0ea"';
        default: return '"\\f054"';
      }
    },
    /* Pulls together all user options, returns URL + Get params for ping endpoint */
    makeApiUrl() {
      const {
        url, statusCheckUrl, statusCheckHeaders, statusCheckAllowInsecure, statusCheckAcceptCodes,
      } = this;
      const encode = (str) => encodeURIComponent(str);
      this.statusResponse = undefined;
      // Find base URL, where the API is hosted
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      // Find correct URL to check, and encode
      const urlToCheck = `?&url=${encode(statusCheckUrl || url)}`;
      // Get, stringify and encode any headers
      const headers = statusCheckHeaders
        ? `&headers=${encode(JSON.stringify(statusCheckHeaders))}` : '';
      // Deterimine if user disabled security
      const enableInsecure = statusCheckAllowInsecure ? '&enableInsecure=true' : '';
      const acceptCodes = statusCheckAcceptCodes ? `&acceptCodes=${statusCheckAcceptCodes}` : '';
      // Construct the full API endpoint's URL with GET params
      return `${baseUrl}${serviceEndpoints.statusCheck}/${urlToCheck}`
        + `${headers}${enableInsecure}${acceptCodes}`;
    },
    /* Checks if a given service is currently online */
    checkWebsiteStatus() {
      const endpoint = this.makeApiUrl();
      axios.get(endpoint)
        .then((response) => {
          if (response.data) this.statusResponse = response.data;
        })
        .catch(() => { // Something went very wrong.
          this.statusResponse = {
            statusText: 'Failed to make request',
            statusSuccess: false,
          };
        });
    },
    /* Handle navigation options from the context menu */
    launchItem(method) {
      const { url } = this;
      this.contextMenuOpen = false;
      switch (method) {
        case 'newtab':
          window.open(url, '_blank');
          break;
        case 'sametab':
          window.open(url, '_self');
          break;
        case 'modal':
          this.$emit('triggerModal', url);
          break;
        case 'workspace':
          router.push({ name: 'workspace', query: { url } });
          break;
        case 'clipboard':
          navigator.clipboard.writeText(url);
          this.$toasted.show(this.$t('context-menus.item.copied-toast'));
          break;
        default: window.open(url, '_blank');
      }
    },
    /* Open the Edit Item moal form */
    openItemSettings() {
      this.editMenuOpen = true;
      this.contextMenuOpen = false;
      this.$modal.show(modalNames.EDIT_ITEM);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
    },
    /* Ensure conditional is updated, once menu closed */
    closeEditMenu() {
      this.editMenuOpen = false;
      this.$modal.hide(modalNames.EDIT_ITEM);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
    /* Used for smart-sort when sorting items by most used apps */
    incrementMostUsedCount(itemId) {
      const mostUsed = JSON.parse(localStorage.getItem(localStorageKeys.MOST_USED) || '{}');
      let counter = mostUsed[itemId] || 0;
      counter += 1;
      mostUsed[itemId] = counter;
      localStorage.setItem(localStorageKeys.MOST_USED, JSON.stringify(mostUsed));
    },
    /* Used for smart-sort when sorting by last used apps */
    incrementLastUsedCount(itemId) {
      const lastUsed = JSON.parse(localStorage.getItem(localStorageKeys.LAST_USED) || '{}');
      lastUsed[itemId] = new Date().getTime();
      localStorage.setItem(localStorageKeys.LAST_USED, JSON.stringify(lastUsed));
    },
    /* Open the modal for moving/ copying item to other section */
    openMoveItemMenu() {
      this.$modal.show(`${modalNames.MOVE_ITEM_TO}-${this.id}`);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
      this.closeContextMenu();
    },
    /* Deletes the current item from the state */
    openDeleteItem() {
      const parentSection = this.$store.getters.getParentSectionOfItem(this.id);
      const payload = { itemId: this.id, sectionName: parentSection.name };
      this.$store.commit(StoreKeys.REMOVE_ITEM, payload);
      this.closeContextMenu();
    },
  },
  mounted() {
    // If ststus checking is enabled, then check service status
    if (this.enableStatusCheck) this.checkWebsiteStatus();
    // If continious status checking is enabled, then start ever-lasting loop
    if (this.statusCheckInterval > 0) {
      setInterval(this.checkWebsiteStatus, this.statusCheckInterval * 1000);
    }
  },
};
</script>

<style lang="scss">

.item-wrapper {
  flex-grow: 1;
  flex-basis: 6rem;
  &.wrap-size-large {
    flex-basis: 12rem;
  }
}

.item {
  flex-grow: 1;
  color: var(--item-text-color);
  vertical-align: middle;
  margin: 0.5rem;
  background: var(--item-background);
  text-align: center;
  padding: 2px;
  outline: 2px solid transparent;
  border: 1px solid var(--outline-color);
  border-radius: var(--curve-factor);
  box-shadow: var(--item-shadow);
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: all 0.2s ease-in-out 0s;
  &:hover {
    box-shadow: var(--item-hover-shadow);
    background: var(--item-background-hover);
    color: var(--item-text-color-hover);
    // position: relative;
    // .tile-title span.text {
    //   white-space: pre-wrap;
    // }
  }
  &:focus {
    outline: 2px solid var(--primary);
  }
  &.short:not(.size-large) {
    height: 2rem;
  }
  &.add-new {
    border: 2px dashed var(--primary) !important;
  }
}

/* Text in tile */
.tile-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 120px;
  height: 30px;
  position: relative;
  padding: 0;
  z-index: 2;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  span.text {
    white-space: nowrap;
  }
}

/* Colored dot showing service status */
.status-indicator {
  position: absolute;
  top: 0;
  right: 0;
}

.opening-method-icon {
  display: none; // Hidden by default, visible on hover
}

/* Manage hover and focus actions */
.item:hover, .item:focus {
  /* Show opening-method icon */
  .opening-method-icon {
    display: block;
  }

  /* Trigger text-marquee for text that doesn't fit */
  .tile-title.is-overflowing{
    .overflow-dots {
      opacity: 0;
    }
    span.text {
      transform: translateX(calc(100px - 100%));
    }
  }

  /* Apply transofmation of icons on hover */
  .tile-icon, .tile-svg  {
    filter: var(--item-icon-transform-hover);
  }
}

/* Edit Mode Icon */
.item .edit-mode-item {
  width: 1rem;
  height: 1rem;
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
}

/* Specify layout for alternate sized icons */
.item {
  /* Small Tile Specific Themes */
  &.size-small {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;
    height: 2rem;
    padding-top: 4px;
    max-width: 14rem;
    div img {
      width: 2rem;
    }
    .tile-title {
      height: fit-content;
      min-height: 1.2rem;
      text-align: left;
      max-width: 12rem;
      overflow: hidden;
      span.text {
        text-align: left;
        padding-left: 10%;
      }
    }
  }
  /* Medium Tile Specific Themes */
  &.size-medium {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    div img {
      width: 2.5rem;
      margin-bottom: 0.25rem;
    }
    .tile-title {
      min-width: 100px;
      max-width: 160px;
      &.no-icon {
        text-align: left;
        width: 100%;
        max-width: inherit;
        margin-left: 0.5rem;
      }
    }
  }
  /* Large Tile Specific Themes */
  &.size-large {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    text-align: left;
    overflow: hidden;
    align-items: center;
    max-height: 6rem;
    margin: 0.2rem;
    padding: 0.5rem;
    img {
      padding: 0.1rem 0.25rem;
    }
    .tile-title {
      height: auto;
      padding: 0.1rem 0.25rem;
      span.text {
        position: relative;
        font-weight: bold;
        font-size: 1.1rem;
        width: 100%;
      }
      p.description {
        margin: 0;
        display: block;
        white-space: pre-wrap;
        text-overflow: ellipsis;
        font-size: .9em;
        line-height: 1rem;
        height: 2rem;
      }
    }
  }
  p.description {
    display: none; // By default, we don't show the description
  }
  &:before { // Certain themes (e.g. material) show css animated fas icon on hover
    display: none;
    font-family: FontAwesome;
    content: var(--open-icon, "\f054") !important;
  }
}

/* Adjust positioning of status indicator, when in edit mode */
a.item.is-edit-mode {
  &.size-medium .status-indicator { top: 1rem; }
  &.size-small .status-indicator { right: 1rem; }
  &.size-large .status-indicator { top: 1.5rem; }
}

</style>

<!-- An un-scoped style tag, since tooltip is outside this DOM tree -->
<style lang="scss">
.disabled-link {
  pointer-events: none;
}
.tooltip.item-description-tooltip {
  z-index: 7;
}
</style>
