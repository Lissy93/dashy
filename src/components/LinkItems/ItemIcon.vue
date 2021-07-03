<template>
  <div class="item-icon">
    <i v-if="iconType === 'font-awesome'" :class="`${icon} ${size}`" ></i>
    <i v-else-if="iconType === 'emoji'" :class="`emoji-icon ${size}`" >{{getEmoji(iconPath)}}</i>
    <img v-else-if="icon" :src="iconPath" @error="imageNotFound"
      :class="`tile-icon ${size} ${broken ? 'broken' : ''}`"
    />
    <BrokenImage v-if="broken" class="missing-image" />
  </div>
</template>

<script>
import BrokenImage from '@/assets/interface-icons/broken-icon.svg';
import ErrorHandler from '@/utils/ErrorHandler';
import { faviconApi as defaultFaviconApi, faviconApiEndpoints } from '@/utils/defaults';
import EmojiUnicodeRegex from '@/utils/EmojiUnicodeRegex';
import emojiLookup from '@/utils/emojis.json';

export default {
  name: 'Icon',
  inject: ['config'],
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
  data() {
    return {
      broken: false,
      // faviconApi: this.config.appConfig.faviconApi || defaultFaviconApi,
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
    /* Determins if a given string is an emoji, and if so what type it is */
    isEmoji(img) {
      if (EmojiUnicodeRegex.test(img) && img.match(/./gu).length) { // Is a unicode emoji
        return { isEmoji: true, emojiType: 'glyph' };
      } else if (new RegExp(/^:.*:$/).test(img)) { // Is a shortcode emoji
        return { isEmoji: true, emojiType: 'shortcode' };
      } else if (img.substring(0, 2) === 'U+' && img.length === 7) {
        return { isEmoji: true, emojiType: 'unicode' };
      }
      return { isEmoji: false, emojiType: '' };
    },
    /* Formats and gets emoji from unicode or shortcode */
    getEmoji(emojiCode) {
      const { emojiType } = this.isEmoji(emojiCode);
      if (emojiType === 'shortcode') {
        if (emojiLookup[emojiCode]) return emojiLookup[emojiCode];
      } else if (emojiType === 'unicode') {
        return String.fromCodePoint(parseInt(emojiCode.substr(2), 16));
      }
      return emojiCode; // Emoji is a glyph already, just return
    },
    /* Get favicon URL, for items which use the favicon as their icon */
    getFavicon(fullUrl) {
      if (this.shouldUseDefaultFavicon(fullUrl)) { // Check if we should use local icon
        const urlParts = fullUrl.split('/');
        if (urlParts.length >= 2) return `${urlParts[0]}/${urlParts[1]}/${urlParts[2]}/favicon.ico`;
      } else if (fullUrl.includes('http')) { // Service is running publicly
        const host = this.getHostName(fullUrl);
        const faviconApi = this.config.appConfig.faviconApi || defaultFaviconApi;
        const endpoint = faviconApiEndpoints[faviconApi];
        return endpoint.replace('$URL', host);
      }
      return '';
    },
    /* If using favicon for icon, and if service is running locally (determined by local IP) */
    /* or if user prefers local favicon, then return true */
    shouldUseDefaultFavicon(fullUrl) {
      const isLocalIP = /(127\.)|(192\.168\.)|(10\.)|(172\.1[6-9]\.)|(172\.2[0-9]\.)|(172\.3[0-1]\.)|(::1$)|([fF][cCdD])|(localhost)/;
      return (isLocalIP.test(fullUrl) || this.config.appConfig.faviconApi === 'local');
    },
    getLocalImagePath(img) {
      return `/item-icons/${img}`;
    },
    getGenerativeIcon(url) {
      return `https://ipsicon.io/${this.getHostName(url)}.svg`;
    },
    /* Checks if the icon is from a local image, remote URL, SVG or font-awesome */
    getIconPath(img, url) {
      switch (this.determineImageType(img)) {
        case 'url': return img;
        case 'img': return this.getLocalImagePath(img);
        case 'favicon': return this.getFavicon(url);
        case 'generative': return this.getGenerativeIcon(url);
        case 'svg': return img;
        case 'emoji': return img;
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
      else if (img === 'generative') imgType = 'generative';
      else if (this.isEmoji(img).isEmoji) imgType = 'emoji';
      else imgType = 'none';
      return imgType;
    },
    getHostName(url) {
      try { return new URL(url).hostname; } catch (e) { return url; }
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
      width: 2rem;
      // filter: var(--item-icon-transform);
      border-radius: var(--curve-factor);
      &.broken { display: none; }
      &.small {
        width: 1.5rem;
      }
      &.large {
        width: 3rem;
      }
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
  i.emoji-icon {
    font-style: normal;
    font-size: 2rem;
    margin: 0.2rem;
    &.small {
      font-size: 1.5rem;
    }
    &.large {
      font-size: 2.5rem;
    }
  }
  .missing-image {
    width: 3.5rem;
    path {
      fill: currentColor;
    }
  }
</style>
