<template>
    <el-tooltip placement="bottom" effect="dark" :content="description" :disabled="!description">
        <a :href="url"  :class="`item ${!icon? 'short': ''}`" v-on:click="$emit('itemClicked')"
            tabindex="0" target="_blank" rel="noopener noreferrer">
            <div class="tile-title" :id="`tile-${id}`">
                <span class="text">{{ title }}</span>
                <div class="overflow-dots">...</div>
            </div>
            <img
                v-if="icon"
                :src="getAppropriateImgPath(icon)"
                class="tile-icon"
            />
            <!-- <img
                v-else-if="iconType === 'svg' && icon"
                :src="`/img/item-icons/tile-svgs/${icon}.svg`"
                class="tile-svg"
            /> -->
            <!-- <img
                v-else-if="fontAwesome"
                :src="`/img/tile-svgs/${svg}.svg`"
                class="tile-svg"
            /> -->
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
    return {
      getId: this.id,
    };
  },
  methods: {
    /* Returns true if a string is in URL format. Used to identify tile icon source */
    isUrl(str) {
      const pattern = new RegExp(/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/);
      return pattern.test(str);
    },
    /* Checks if the icon is from a local image, remote URL, SVG or font-awesome */
    getAppropriateImgPath(img) {
      const imageType = this.determineImageType(img);
      switch (imageType) {
        case 'url':
          return img;
        case 'img':
          return `/img/item-icons/tile-icons/${img}`;
        case 'svg':
          return img;
        case 'fas':
          return img;
        default:
          return '';
      }
    },
    /* Checks if the icon is from a local image, remote URL, SVG or font-awesome */
    determineImageType(img) {
      const fileExtRegex = /(?:\.([^.]+))?$/;
      const validImgExtensions = ['png', 'jpg'];
      let imgType = '';
      if (this.isUrl(img)) {
        imgType = 'url';
      } else if (validImgExtensions.includes(fileExtRegex.exec(img)[1])) {
        imgType = 'img';
      } else if (fileExtRegex.exec(img)[1] === 'svg') {
        imgType = 'svg';
      } else if (img.include('fas')) {
        imgType = 'fas';
      } else {
        imgType = 'none';
      }
      return imgType;
    },
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
