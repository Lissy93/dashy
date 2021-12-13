<template>
<div class="iframe-widget">
  <iframe v-if="frameUrl" :src="frameUrl" />
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import ErrorHandler from '@/utils/ErrorHandler';

export default {
  mixins: [WidgetMixin],
  computed: {
    frameUrl() {
      const usersChoice = this.options.url;
      if (!usersChoice || typeof usersChoice !== 'string') {
        ErrorHandler('Iframe widget expects a URL');
        return null;
      }
      return usersChoice;
    },
  },
};
</script>

<style scoped lang="scss">
.iframe-widget {
  iframe {
    width: 100%;
    min-height: 240px;
    border: 0;
  }
}

</style>
