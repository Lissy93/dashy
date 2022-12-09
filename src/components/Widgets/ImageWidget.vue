<template>
<div class="image-widget">
  <img :src="imagePath" class="embedded-image" />
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
    /* Generate a URL param, to be updated in order to re-fetch image */
    updatePathParam() {
      return this.updateCount ? `#dashy-update-${this.updateCount}` : '';
    },
  },
  methods: {
    /* In order to re-fetch the image, we much update the URL with an arbitrary hash */
    update() {
      this.updateCount += 1;
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
