<template>
<div class="image-widget">
  <img :src="imagePath" class="embedded-image" />
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  computed: {
    imagePath() {
      if (!this.options.imagePath) this.error('You must specify an imagePath');
      return this.options.imagePath;
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
