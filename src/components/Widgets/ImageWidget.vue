<template>
<div class="image-widget">
  <img :src="imagePath" :style="imageDimensions" class="embedded-image" />
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  data: () => ({
    updateCount: 0,
  }),
  computed: {
    /* The path to image to render */
    imagePath() {
      if (!this.options.imagePath) this.error('You must specify an imagePath');
      return `${this.options.imagePath}${this.updatePathParam}`;
    },
    /* If set, apply users specified image dimensions */
    imageDimensions() {
      // Skip if neither set
      if (!this.options.imageWidth && !this.options.imageHeight) return null;
      // Apply correct units to input val, if needed
      const makeDimensionsUnit = (userVal) => {
        if (!userVal) { // Nothing set, use auto
          return 'auto';
        } else if (!Number.isNaN(Number(userVal))) { // Number set, add px
          return `${userVal}px`;
        } else { // Value is string, likely already includes units
          return userVal;
        }
      };
      // Return CSS values for width and height
      return `
        width: ${makeDimensionsUnit(this.options.imageWidth)};
        height: ${makeDimensionsUnit(this.options.imageHeight)};
      `;
    },
    /* Generate a URL param, to be updated in order to re-fetch image */
    updatePathParam() {
      return this.updateCount ? `#dashy-update-${this.updateCount}` : '';
    },
  },
  methods: {
    /* In order to re-fetch the image, we much update the URL with an arbitrary hash */
    update() {
      this.startLoading();
      this.updateCount += 1;
      this.finishLoading();
    },
  },
};
</script>

<style scoped lang="scss">
.image-widget {
  img.embedded-image {
    max-width: 100%;
    margin: 0.2rem auto;
  }
}
</style>
