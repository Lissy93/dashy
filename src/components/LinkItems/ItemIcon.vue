<template>
  <div>
    <i v-if="iconType === 'font-awesome'" :class="`${icon} ${size}`" ></i>
    <img v-else-if="icon" :src="iconPath" @error="imageNotFound"
      :class="`tile-icon ${size} ${broken ? 'broken' : ''}`"
    />
    <BrokenImage v-if="broken" class="missing-image" />
  </div>
</template>

<script>
import BrokenImage from '@/assets/interface-icons/broken-icon.svg';
import ErrorHandler from '@/utils/ErrorHandler';
import { iconOptions } from '@/utils/defaults';

export default {
  name: 'Icon',
  props: {
    icon: String, // Path to icon asset
    url: String, // Used for fetching the favicon
    size: String, // Either small, medium or large
  },
  components: {
    BrokenImage,
  },
  computed: {
    iconType: function iconType() {
      return this.determineImageType(this.icon);
    },
    iconPath: function iconPath() {
      return this.getIconPath(this.icon, this.url);
    },
  },
  inject: ['config'],
  data() {
    return {
      broken: false,
    };
  },
  methods: {
    /* Check if a string is in a URL format. Used to identify tile icon source */
    isUrl(str) {
      const pattern = new RegExp(/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/);
      return pattern.test(str);
    },
    /* Returns true if the input is a path to an image file */
    isImage(img) {
      const fileExtRegex = /(?:\.([^.]+))?$/;
      const validImgExtensions = ['png', 'jpg'];
      const splitPath = fileExtRegex.exec(img);
      if (splitPath.length >= 1) return validImgExtensions.includes(splitPath[1]);
      return false;
    },
    /* Get favicon URL, for items which use the favicon as their icon */
    getFavicon(fullUrl) {
      const userHatesGoogle = this.config.appConfig // User specified don't use Google favicon API
        ? !!this.config.appConfig.forceRootFavicon : iconOptions.forceRootFavicon;
      const isLocalIP = /(127\.)|(192\.168\.)|(10\.)|(172\.1[6-9]\.)|(172\.2[0-9]\.)|(172\.3[0-1]\.)|(::1$)|([fF][cCdD])|(localhost)/;
      if (isLocalIP.test(fullUrl) || userHatesGoogle) { // If using local service, or hates google
        const favicon = this.config.appConfig // Favicon name (usually /favicon.ico)
          ? this.config.appConfig.itemFaviconLocation : iconOptions.itemFaviconLocation;
        const urlParts = fullUrl.split('/');
        // For locally running services, use the default path for favicon
        if (urlParts.length >= 2) return `${urlParts[0]}/${urlParts[1]}/${urlParts[2]}/${favicon}`;
      } else if (fullUrl.includes('http')) {
        // For publicly accessible sites, a more reliable method is using Google's API
        return `https://s2.googleusercontent.com/s2/favicons?domain=${fullUrl}`;
      }
      return '';
    },
    getLocalImagePath(img) {
      return `/item-icons/${img}`;
    },
    /* Checks if the icon is from a local image, remote URL, SVG or font-awesome */
    getIconPath(img, url) {
      switch (this.determineImageType(img)) {
        case 'url': return img;
        case 'img': return this.getLocalImagePath(img);
        case 'favicon': return this.getFavicon(url);
        case 'svg': return img;
        default: return '';
      }
    },
    /* Checks if the icon is from a local image, remote URL, SVG or font-awesome */
    determineImageType(img) {
      let imgType = '';
      if (!img) imgType = 'none';
      else if (img.endsWith('.svg')) imgType = 'svg';
      else if (this.isUrl(img)) imgType = 'url';
      else if (this.isImage(img)) imgType = 'img';
      else if (img.includes('fa-')) imgType = 'font-awesome';
      else if (img === 'favicon') imgType = 'favicon';
      else imgType = 'none';
      return imgType;
    },
    /* Called when the path to the image cannot be resolved */
    imageNotFound() {
      this.broken = true;
      ErrorHandler(`The path to '${this.icon}' could not be resolved`);
    },
  },
};
</script>

<style lang="scss">
  .tile-icon {
      width: 60px;
      // filter: var(--item-icon-transform);
      &.broken { display: none; }
  }
  i.fas, i.fab, i.far, i.fal, i.fad {
    font-size: 2rem;
    color: currentColor;
    margin: 1px auto 4px;
    &.small {
      font-size: 1.5rem;
    }
    &.large {
      font-size: 3rem;
    }
  }
  object.tile-icon {
    width: 55px;
    height: 55px;
    svg, svg g, svg g path {
      fill: currentColor;
    }
  }

  .missing-image {
    width: 3.5rem;
    path {
      fill: currentColor;
    }
  }
</style>
