<template>
  <a :href="url"  :class="`item ${!icon? 'short': ''}`" v-on:click="$emit('itemClicked')"
  tabindex="0" target="_blank" rel="noopener noreferrer" v-tooltip="getTooltipOptions()">
    <!-- Item Text -->
    <div class="tile-title" :id="`tile-${id}`">
      <span class="text">{{ title }}</span>
      <div class="overflow-dots">...</div>
    </div>
    <!-- Item Icon -->
    <Icon :icon="icon" :url="url" />
  </a>
</template>

<script>
import Icon from '@/components/ItemIcon.vue';

export default {
  name: 'Item',
  props: {
    id: String, // The unique ID of a tile (e.g. 001)
    title: String, // The main text of tile, required
    subtitle: String, // Optional sub-text
    description: String, // Optional tooltip hover text
    icon: String, // Optional path to icon, within public/img/tile-icons
    svg: String, // Optional vector graphic, that is then dynamically filled
    color: String, // Optional background color, specified in hex code
    url: String, // URL to the resource, optional but recommended
    openingMethod: { // Where resource will open, either 'newtab', 'sametab' or 'iframe'
      type: String,
      default: 'newtab',
      validator: (value) => ['newtab', 'sametab', 'iframe'].indexOf(value) !== -1,
    },
  },
  data() {
    return {
      getId: this.id,
    };
  },
  components: {
    Icon,
  },
  methods: {
    /* Called when an item is opened, so that search field can be reset */
    itemOpened() {
      this.$emit('itemClicked');
    },
    /**
     * Detects overflowing text, shows ellipse, and allows is to marguee on hover
     * The below code is horifically bad, it is embarassing that I wrote it...
     */
    manageTitleEllipse() {
      const tileElem = document.getElementById(`tile-${this.getId}`);
      if (tileElem) {
        const isOverflowing = tileElem.scrollHeight > tileElem.clientHeight
              || tileElem.scrollWidth > tileElem.clientWidth;
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
        delay: { show: 350, hide: 200 },
      };
    },
  },
  mounted() {
    this.manageTitleEllipse();
  },
};
</script>

<style scoped lang="scss">
@import '../../src/styles/color-pallet.scss';
@import '../../src/styles/constants.scss';

.item {
    flex-grow: 1;
    height: 100px;
    color: $ascent;
    vertical-align: middle;
    margin: 0.5rem;
    background: #607d8b33;
    text-align: center;
    padding: 2px;
    border: 2px solid transparent;
    border-radius: $curve-factor;
    box-shadow: 1px 1px 2px #373737;
    cursor: pointer;
    &:hover {
        box-shadow: 1px 2px 4px #373737;
        background: #607d8b4d;
    }
    &:focus {
        border: 2px solid $ascent;
        outline: none;
    }
    &.short {
        height: 18px;
    }
}
.tile-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 120px;
    height: 30px;
    overflow: hidden;
    position: relative;
    padding: 0;

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
}

.tile-title.is-overflowing {
    span.text {
        overflow: hidden;
    }
    .overflow-dots {
        display: block;
        opacity: 1;
        background: $overflow-ellipse;
        position: absolute;
        z-index: 5;
        right: 0;
        transition: opacity 0.1s ease-in;
    }
}

.item:hover .tile-title.is-overflowing{
    .overflow-dots {
        opacity: 0;
    }
    span.text {
        transform: translateX(calc(120px - 100%));
    }
}

.tile-icon {
    width: 60px;
    filter: drop-shadow(2px 4px 6px $transparent-black) saturate(0.65);
}

.item:hover {
    .tile-svg {
        filter: drop-shadow(4px 8px 3px $transparent-black);
    }
    .tile-icon {
        filter:
            drop-shadow(4px 8px 3px $transparent-black)
            saturate(2);
    }
}

.tile-svg {
    width: 56px;
     filter:
        invert(69%)
        sepia(40%)
        saturate(4686%)
        hue-rotate(142deg)
        brightness(96%)
        contrast(102%);
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

</style>
