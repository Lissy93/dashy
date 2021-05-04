<template ref="container">
    <a @click="itemOpened"
      :href="target !== 'iframe' ? url : '#'"
      :target="target === 'newtab' ? '_blank' : ''"
      :class="`item ${!icon? 'short': ''} size-${itemSize}`"
      v-tooltip="getTooltipOptions()"
      v-bind:style="customStyles"
      rel="noopener noreferrer" tabindex="0"
      :id="`link-${id}`"
    >
      <!-- Item Text -->
      <div class="tile-title" :id="`tile-${id}`" >
        <span class="text">{{ title }}</span>
        <div class="overflow-dots">...</div>
      </div>
      <!-- Item Icon -->
      <Icon :icon="icon" :url="url" :size="itemSize" :color="color" v-bind:style="customStyles" />
      <!-- Small icon, showing opening method on hover -->
      <ItemOpenMethodIcon class="opening-method-icon" :isSmall="!icon" :openingMethod="target"
        :position="itemSize === 'medium'? 'bottom right' : 'top right'"/>
    </a>
</template>

<script>
import Icon from '@/components/LinkItems/ItemIcon.vue';
import ItemOpenMethodIcon from '@/components/LinkItems/ItemOpenMethodIcon';

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
    target: { // Where resource will open, either 'newtab', 'sametab' or 'iframe'
      type: String,
      default: 'newtab',
      validator: (value) => ['newtab', 'sametab', 'iframe'].indexOf(value) !== -1,
    },
    itemSize: String,
  },
  data() {
    return {
      getId: this.id,
      customStyles: {
        color: this.color,
        background: this.backgroundColor,
      },
    };
  },
  components: {
    Icon,
    ItemOpenMethodIcon,
  },
  methods: {
    /* Called when an item is clicked, manages the opening of iframe & resets the search field */
    itemOpened(e) {
      if (e.altKey || this.target === 'iframe') {
        e.preventDefault();
        this.$emit('triggerModal', this.url);
      } else {
        this.$emit('itemClicked');
      }
    },
    /**
     * Detects overflowing text, shows ellipse, and allows is to marguee on hover
     * The below code is horifically bad, it is embarassing that I wrote it...
     */
    manageTitleEllipse() {
      const tileElem = document.getElementById(`tile-${this.getId}`);
      if (tileElem) {
        const isOverflowing = (tileElem.scrollHeight > tileElem.clientHeight
              || tileElem.scrollWidth > tileElem.clientWidth) && this.title.length > 12;
        if (isOverflowing) tileElem.className += ' is-overflowing';
      } // Note from present me to past me: WTF?!
    },
    /* Returns configuration object for the tooltip */
    getTooltipOptions() {
      return {
        disabled: !this.description,
        content: this.description,
        trigger: 'hover focus',
        hideOnTargetClick: true,
        html: false,
        delay: { show: 600, hide: 200 },
      };
    },
  },
  mounted() {
    this.manageTitleEllipse();
  },
};
</script>

<style lang="scss">

.item {
  flex-grow: 1;
  position: relative;
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
  &:hover {
    box-shadow: var(--item-hover-shadow);
    background: var(--item-background-hover);
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
  overflow: hidden;
  position: relative;
  padding: 0;
  z-index: 2;
  span.text {
    position: absolute;
    white-space: nowrap;
    transition: 1s;
    float: left;
    left: 0;
  }
  &:not(.is-overflowing) span.text{
    width: 100%;
  }
  .overflow-dots {
    opacity: 0;
  }
  &.is-overflowing {
    span.text {
      overflow: hidden;
    }
    .overflow-dots {
      display: block;
      opacity: 1;
      background: var(--item-background);
      position: absolute;
      z-index: 5;
      right: 0;
      transition: opacity 0.1s ease-in;
    }
  }
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
  &.size-small {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    align-items: center;
    height: 2rem;
    div img, div svg.missing-image {
      width: 2rem;
    }
    .tile-title {
      height: fit-content;
      min-height: 1rem;
      span.text {
        text-align: left;
        padding-left: 10%;
      }
    }
  }
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
    }
  }
  &.size-large {
    height: 100px;
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
