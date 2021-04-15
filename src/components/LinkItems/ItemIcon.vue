<template>
  <img
      v-if="icon"
      :src="getAppropriateImgPath(icon, url)"
      class="tile-icon"
  />
</template>

<script>

export default {
  name: 'Item',
  props: {
    icon: String,
    url: String,
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
      const isLocalIP = /(127\.)|(192\.168\.)|(10\.)|(172\.1[6-9]\.)|(172\.2[0-9]\.)|(172\.3[0-1]\.)|(::1$)|([fF][cCdD])|(localhost)/;
      if (isLocalIP.test(fullUrl)) { // Check if using a local IP format or localhost
        const urlParts = fullUrl.split('/');
        // For locally running services, use the default path for favicon
        if (urlParts.length >= 2) return `${urlParts[0]}/${urlParts[1]}/${urlParts[2]}/favicon.ico`;
      } else if (fullUrl.includes('http')) {
        // For publicly accessible sites, a more reliable method is using Google's API
        return `https://s2.googleusercontent.com/s2/favicons?domain=${fullUrl}`;
      }
      return '';
    },
    /* Checks if the icon is from a local image, remote URL, SVG or font-awesome */
    getAppropriateImgPath(img, url) {
      const imageType = this.determineImageType(img);
      switch (imageType) {
        case 'url':
          return img;
        case 'img':
          return `/img/item-icons/tile-icons/${img}`;
        case 'favicon':
          return this.getFavicon(url);
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
      let imgType = '';
      if (this.isUrl(img)) {
        imgType = 'url';
      } else if (this.isImage(img)) {
        imgType = 'img';
      // } else if (fileExtRegex.exec(img)[1] === 'svg') {
      //   imgType = 'svg';
      } else if (img.includes('fas')) {
        imgType = 'fas';
      } else if (img === 'favicon') {
        imgType = 'favicon';
      } else {
        imgType = 'none';
      }
      return imgType;
    },
  },
};
</script>

<style scoped lang="scss">

.tile-icon {
    width: 60px;
    filter: var(--item-icon-transform);
}
</style>
