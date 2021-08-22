<template ref="container">
  <div class="item-wrapper">
    <a @click="itemOpened"
      @mouseup.right="openContextMenu"
      @contextmenu.prevent
      :href="(target !== 'modal' && target !== 'workspace') ? url : '#'"
      :target="target === 'newtab' ? '_blank' : ''"
      :class="`item ${!icon? 'short': ''} size-${itemSize}`"
      v-tooltip="getTooltipOptions()"
      rel="noopener noreferrer" tabindex="0"
      :id="`link-${id}`"
      :style="`--open-icon: ${getUnicodeOpeningIcon()}; ${customStyles}`"
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
        :openingMethod="target"  :position="itemSize === 'medium'? 'bottom right' : 'top right'"
        :hotkey="hotkey" />
      <!-- Status indicator dot (if enabled) showing weather srevice is availible -->
      <StatusIndicator
        class="status-indicator"
        v-if="enableStatusCheck"
        :statusSuccess="statusResponse ? statusResponse.successStatus : undefined"
        :statusText="statusResponse ? statusResponse.message : undefined"
      />
    </a>
    <ContextMenu
      :show="contextMenuOpen"
      v-click-outside="closeContextMenu"
      :posX="contextPos.posX"
      :posY="contextPos.posY"
      :id="`context-menu-${id}`"
      @contextItemClick="contextItemClick"
    />
  </div>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import Icon from '@/components/LinkItems/ItemIcon.vue';
import ItemOpenMethodIcon from '@/components/LinkItems/ItemOpenMethodIcon';
import StatusIndicator from '@/components/LinkItems/StatusIndicator';
import ContextMenu from '@/components/LinkItems/ContextMenu';

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
    hotkey: Number, // Shortcut for quickly launching app
    target: { // Where resource will open, either 'newtab', 'sametab' or 'modal'
      type: String,
      default: 'newtab',
      validator: (value) => ['newtab', 'sametab', 'modal', 'workspace'].indexOf(value) !== -1,
    },
    itemSize: String,
    enableStatusCheck: Boolean,
    statusCheckHeaders: Object,
    statusCheckUrl: String,
    statusCheckInterval: Number,
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
    };
  },
  components: {
    Icon,
    ItemOpenMethodIcon,
    StatusIndicator,
    ContextMenu,
  },
  methods: {
    /* Called when an item is clicked, manages the opening of modal & resets the search field */
    itemOpened(e) {
      if (e.altKey || this.target === 'modal') {
        e.preventDefault();
        this.$emit('triggerModal', this.url);
      } else if (this.target === 'workspace') {
        router.push({ name: 'workspace', query: { url: this.url } });
      } else {
        this.$emit('itemClicked');
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
      const hotkeyText = this.hotkey ? `\nPress '${this.hotkey}' to launch` : '';
      return {
        disabled: !this.description,
        content: this.description + hotkeyText,
        trigger: 'hover focus',
        hideOnTargetClick: true,
        html: false,
        placement: this.statusResponse ? 'left' : 'auto',
        delay: { show: 600, hide: 200 },
        classes: 'item-description-tooltip',
      };
    },
    /* Used by certain themes, which display an icon with animated CSS */
    getUnicodeOpeningIcon() {
      switch (this.target) {
        case 'newtab': return '"\\f360"';
        case 'sametab': return '"\\f24d"';
        case 'modal': return '"\\f2d0"';
        default: return '"\\f054"';
      }
    },
    /* Checks if a given service is currently online */
    checkWebsiteStatus() {
      this.statusResponse = undefined;
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      const urlToCheck = this.statusCheckUrl || this.url;
      const headers = this.statusCheckHeaders || {};
      const endpoint = `${baseUrl}/ping?url=${urlToCheck}`;
      axios.get(endpoint, { headers })
        .then((response) => {
          if (response.data) this.statusResponse = response.data;
        })
        .catch(() => {
          this.statusResponse = {
            statusText: 'Failed to make request',
            statusSuccess: false,
          };
        });
    },
    /* Handle navigation options from the context menu */
    contextItemClick(method) {
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
        default: window.open(url, '_blank');
      }
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
    position: relative;
    .tile-title span.text {
      white-space: pre-wrap;
    }
  }
  &:focus {
    outline: 2px solid var(--primary);
  }
  &.short {
    height: 18px;
  }
}

/* Text in tile */
.tile-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 120px;
  height: 30px;
  position: relative;
  padding: 0;
  z-index: 2;
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
    div img, div svg.missing-image {
      width: 2rem;
    }
    .tile-title {
      height: fit-content;
      min-height: 1.2rem;
      text-align: left;
      max-width:140px;
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
    div img, div svg.missing-image {
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
        display: block;
        margin: 0;
        white-space: pre-wrap;
        font-size: .9em;
        text-overflow: ellipsis;
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

</style>

<!-- An un-scoped style tag, since tooltip is outside this DOM tree -->
<style lang="scss">
.tooltip {
  padding: 0.2rem 0.5rem;
  background: #0b1021cc;
  border: 1px solid #0b1021;
  border-radius: 3px;
  color: #fff;
  max-width: 250px;
}
.tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent!important;
  border-right-color: transparent!important;
  border-bottom-color: transparent!important;
  bottom: -11px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: #0b1021cc;
  z-index: 3;
}

.disabled-link {
  pointer-events: none;
}

</style>
