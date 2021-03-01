<template>
    <el-tooltip placement="bottom" effect="dark" :content="description" :disabled="!description">
        <a :href="url"  :class="`item ${!icon && !svg? 'short': ''}`"
            tabindex="0" target="_blank" rel="noopener noreferrer">
            <div class="tile-title" :id="`tile-${id}`">
                <span class="text">{{ title }}</span>
                <div class="overflow-dots">...</div>
            </div>
            <img
                v-if="icon"
                :src="`/img/tile-icons/${icon}.png`"
                class="tile-icon"
            />
            <img
                v-else-if="svg"
                :src="`/img/tile-svgs/${svg}.svg`"
                class="tile-svg"
            />
        </a>
    </el-tooltip>
</template>

<script>

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
    return { getId: this.id };
  },
  mounted() {
    // Detects overflowing text, and allows is to marguee on hover
    // The below code is horifically bad, it is embarassing that I wrote it...
    const tileElem = document.getElementById(`tile-${this.getId}`);
    if (tileElem) {
      const isOverflowing = tileElem.scrollHeight > tileElem.clientHeight
            || tileElem.scrollWidth > tileElem.clientWidth;
      if (isOverflowing) {
        tileElem.className += ' is-overflowing';
      }
    } // Not from present me to past me: WTF?!
  },
};
</script>

<style scoped lang="scss">
@import '../../src/styles/color-pallet.scss';

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
    border-radius: 10px;
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
        border-radius: 30px;
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
}

.item:hover {
    .tile-svg {
        filter:
            invert(70%)
            sepia(52%)
            saturate(5390%)
            hue-rotate(198deg)
            brightness(101%)
            contrast(88%);
    }
    .tile-icon {
        filter: hue-rotate(45deg);
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
