<template>
  <div v-if="icon" :class="`item-icon wrapper-${size}`">
    <!-- Font-Awesome Icon -->
    <i v-if="iconType === 'font-awesome'" :class="`${icon} ${size}`" ></i>
    <!-- Emoji Icon -->
    <i v-else-if="iconType === 'emoji'" :class="`emoji-icon ${size}`" >{{getEmoji(iconPath)}}</i>
    <!-- Material Design Icon -->
    <span v-else-if="iconType === 'mdi'" :class=" `mdi ${icon} ${size}`"></span>
    <!-- Simple-Icons -->
    <svg v-else-if="iconType === 'si' && !broken" :class="`simple-icons ${size}`"
      role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path :d="getSimpleIcon(icon)" />
    </svg>
    <!-- Standard image asset icon -->
    <img v-else-if="icon" :src="iconPath" @error="imageNotFound"
      :class="`tile-icon ${size} ${broken ? 'broken' : ''}`"
    />
    <!-- Icon could not load/ broken url -->
    <BrokenImage v-if="broken" :class="`missing-image ${size}`" />
  </div>
</template>

<script>
import simpleIcons from 'simple-icons';
import BrokenImage from '@/assets/interface-icons/broken-icon.svg';
import ErrorHandler from '@/utils/ErrorHandler';
import EmojiUnicodeRegex from '@/utils/EmojiUnicodeRegex';
import emojiLookup from '@/utils/emojis.json';
import { asciiHash } from '@/utils/MiscHelpers';
import { faviconApi as defaultFaviconApi, faviconApiEndpoints, iconCdns } from '@/utils/defaults';

export default {
  name: 'Icon',
  props: {
    icon: String, // Path to icon asset
    url: String, // Used for fetching the favicon
    size: String, // Either small, medium or large
  },
  components: {
    BrokenImage, // Used when the desired image returns a 404
  },
  computed: {
    /* Get appConfig from store */
    appConfig() {
      return this.$store.getters.appConfig;
    },
    /* Determines the type of icon */
    iconType() {
      return this.determineImageType(this.icon);
    },
    /* Gets the icon path, dependent on icon type */
    iconPath() {
      if (this.broken) return this.getFallbackIcon();
      return this.getIconPath(this.icon, this.url);
    },
  },
  data() {
    return {
      broken: false, // If true, was unable to resolve icon
      attemptedFallback: false,
    };
  },
  methods: {
    /* Determine icon type, e.g. local or remote asset, SVG, favicon, font-awesome, etc */
    determineImageType(img) {
      let imgType = '';
      if (!img) imgType = 'none';
      else if (this.isUrl(img)) imgType = 'url';
      else if (this.isImage(img)) imgType = 'img';
      else if (img.includes('fa-')) imgType = 'font-awesome';
      else if (img.includes('mdi-')) imgType = 'mdi';
      else if (img.includes('si-')) imgType = 'si';
      else if (img.includes('hl-')) imgType = 'home-lab-icons';
      else if (img.includes('favicon-')) imgType = 'custom-favicon';
      else if (img === 'favicon') imgType = 'favicon';
      else if (img === 'generative') imgType = 'generative';
      else if (this.isEmoji(img).isEmoji) imgType = 'emoji';
      else imgType = 'none';
      return imgType;
    },
    /* Return the path to icon asset, depending on icon type */
    getIconPath(img, url) {
      switch (this.determineImageType(img)) {
        case 'url': return img;
        case 'img': return this.getLocalImagePath(img);
        case 'favicon': return this.getFavicon(url);
        case 'custom-favicon': return this.getCustomFavicon(url, img);
        case 'generative': return this.getGenerativeIcon(url);
        case 'mdi': return img; // Material design icons
        case 'simple-icons': return this.getSimpleIcon(img);
        case 'home-lab-icons': return this.getHomeLabIcon(img);
        case 'svg': return img; // Local SVG icon
        case 'emoji': return img; // Emoji/ unicode
        default: return '';
      }
    },
    /* Check if a string is in a URL format. Used to identify tile icon source */
    isUrl(str) {
      const pattern = new RegExp(/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-/]))?/);
      return pattern.test(str);
    },
    /* Returns true if the input is a path to an image file */
    isImage(img) {
      const fileExtRegex = /(?:\.([^.]+))?$/;
      const validImgExtensions = ['svg', 'png', 'jpg'];
      const splitPath = fileExtRegex.exec(img);
      if (splitPath.length >= 1) return validImgExtensions.includes(splitPath[1]);
      return false;
    },
    /* Determines if a given string is an emoji, and if so what type it is */
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
    /* Returns the corresponding emoji for a shortcode, or shows error if not found */
    getShortCodeEmoji(emojiCode) {
      if (emojiLookup[emojiCode]) {
        return emojiLookup[emojiCode];
      } else {
        // this.imageNotFound(`No emoji found with name '${emojiCode}'`);
        return null;
      }
    },
    /* Formats and gets emoji from either unicode, shortcode or glyph */
    getEmoji(emojiCode) {
      const { emojiType } = this.isEmoji(emojiCode);
      if (emojiType === 'shortcode') { // Short code emoji
        return this.getShortCodeEmoji(emojiCode);
      } else if (emojiType === 'unicode') { // Unicode emoji
        return String.fromCodePoint(parseInt(emojiCode.substr(2), 16));
      } else if (emojiType === 'glyph') { // Emoji is a glyph
        return emojiCode;
      }
      this.imageNotFound(`Unrecognized emoji: '${emojiCode}'`);
      return null;
    },
    /* Get favicon URL, for items which use the favicon as their icon */
    getFavicon(fullUrl, specificApi) {
      const fullUrlTrue = fullUrl || '';
      const faviconApi = specificApi || this.appConfig.faviconApi || defaultFaviconApi;
      if (this.shouldUseDefaultFavicon(fullUrlTrue) || faviconApi === 'local') { // Check if we should use local icon
        const urlParts = fullUrlTrue.split('/');
        if (urlParts.length >= 2) return `${urlParts[0]}/${urlParts[1]}/${urlParts[2]}/${iconCdns.faviconName}`;
      } else if (fullUrlTrue.includes('http')) { // Service is running publicly
        const host = this.getHostName(fullUrlTrue);
        const endpoint = faviconApiEndpoints[faviconApi];
        return endpoint.replace('$URL', host);
      }
      return '';
    },
    /* Get the URL for a favicon, but using the non-default favicon API */
    getCustomFavicon(fullUrl, faviconIdentifier) {
      let errorMsg = '';
      const faviconApi = faviconIdentifier.split('favicon-')[1];
      if (!faviconApi) {
        errorMsg = 'Favicon API not specified';
      } else if (!Object.keys(faviconApiEndpoints).includes(faviconApi) && faviconApi !== 'local') {
        errorMsg = `The specified favicon API, '${faviconApi}' cannot be found.`;
      } else {
        return this.getFavicon(fullUrl, faviconApi);
      }
      // Error encountered, favicon service not found
      this.imageNotFound(errorMsg);
      return undefined;
    },
    /* If using favicon for icon, and if service is running locally (determined by local IP) */
    /* or if user prefers local favicon, then return true */
    shouldUseDefaultFavicon(fullUrl) {
      const isLocalIP = /(127\.)|(192\.168\.)|(10\.)|(172\.1[6-9]\.)|(172\.2[0-9]\.)|(172\.3[0-1]\.)|(::1$)|([fF][cCdD])|(localhost)/;
      return (isLocalIP.test(fullUrl) || this.appConfig.faviconApi === 'local');
    },
    /* Fetches the path of local images, from Docker container */
    getLocalImagePath(img) {
      return `/${iconCdns.localPath}/${img}`;
    },
    /* Formats the URL for fetching the generative icons */
    getGenerativeIcon(url, cdn) {
      const host = encodeURI(url) || Math.random().toString();
      return (cdn || iconCdns.generative).replace('{icon}', asciiHash(host));
    },
    /* Returns the SVG path content  */
    getSimpleIcon(img) {
      const imageName = img.replace('si-', '');
      const icon = simpleIcons.Get(imageName);
      if (!icon) {
        this.imageNotFound(`No icon was found for '${imageName}' in Simple Icons`);
        return null;
      }
      return icon.path;
    },
    /* Gets home-lab icon from GitHub */
    getHomeLabIcon(img, cdn) {
      const imageName = img.replace('hl-', '').toLocaleLowerCase();
      return (cdn || iconCdns.homeLabIcons).replace('{icon}', imageName);
    },
    /* For a given URL, return the hostname only. Used for favicon and generative icons */
    getHostName(url) {
      try {
        return new URL(url).hostname;
      } catch (e) {
        ErrorHandler('Unable to format URL');
        return url;
      }
    },
    /* Called when the path to the image cannot be resolved */
    imageNotFound(errorMsg) {
      let outputMessage = '';
      if (errorMsg && typeof errorMsg === 'string') {
        outputMessage = errorMsg;
      } else if (!this.icon) {
        outputMessage = 'Icon not specified';
      } else {
        outputMessage = `The path to '${this.icon}' could not be resolved`;
      }
      ErrorHandler(outputMessage);
      this.broken = true;
    },
    /* Called when initial icon has resulted in 404. Attempts to find new icon */
    getFallbackIcon() {
      if (this.attemptedFallback) return undefined; // If this is second attempt, then give up
      const iconType = this.iconType || '';
      const markAsAttempted = () => { this.broken = false; this.attemptedFallback = true; };
      if (iconType.includes('favicon')) { // Specify fallback for favicon-based icons
        markAsAttempted();
        return this.getFavicon(this.url, 'local');
      } else if (iconType === 'generative') {
        markAsAttempted();
        return this.getGenerativeIcon(this.url, iconCdns.generativeFallback);
      } else if (iconType === 'home-lab-icons') {
        markAsAttempted();
        return this.getHomeLabIcon(this.icon, iconCdns.homeLabIconsFallback);
      }
      return undefined;
    },
  },
};
</script>

<style lang="scss">

/* Icon wraper */
.item-icon {
  &.wrapper-medium {
    min-height: 2.5rem;
  }
  &.wrapper-large {
    min-width: 3.5rem;
    text-align: center;
  }
}

  /* Default Image Icon */
  .tile-icon {
      min-width: 1rem;
      max-width: 2rem;
      min-height: 1rem;
      max-height: 2rem;
      object-fit: cover;
      filter: var(--item-icon-transform);
      border-radius: var(--curve-factor);
      &.small {
        max-width: 1.5rem;
        max-height: 1.5rem;
      }
      &.large {
        max-width: 3rem;
        max-height: 3rem;
      }
      &.broken {
        display: none;
      }
  }
  /* Font-Awesome and Material Design Icons */
  i.fas, i.fab, i.far, i.fal, i.fad, span.mdi {
    font-size: 2rem;
    color: currentColor;
    margin: 1px 4px;
    &.small {
      font-size: 1.5rem;
    }
    &.large {
      font-size: 2.5rem;
    }
  }
  span.mdi {
    font-size: 2.5rem;
  }
  object.tile-icon {
    width: 55px;
    height: 55px;
    svg, svg g, svg g path {
      fill: currentColor;
    }
  }
  /* Simple Icons */
  .item-icon .simple-icons {
    width: 2rem;
    &.small { width: 1.5rem; }
    &.large { width: 2.5rem; }
  }

  .item-icon .simple-icons path {
    fill: currentColor;
  }
  /* Emoji Icons */
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
  /* Icon Not Found */
  .missing-image {
    width: 2rem;
    &.small {
      width: 1.5rem !important;
    }
    &.large {
      width: 2.5rem;
    }
    path {
      fill: currentColor;
    }
  }
</style>
