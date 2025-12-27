<template>
<div class="iframe-widget">
  <iframe
    v-if="frameUrl"
    :src="frameUrl"
    :id="frameId"
    title="Iframe Widget"
    allow="fullscreen; clipboard-write"
    :style="frameHeight ? `height: ${frameHeight}px` : ''"
  />
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
    /* Gets users specified URL to load into the iframe */
    frameUrl() {
      const usersChoice = this.options.url;
      if (!usersChoice || typeof usersChoice !== 'string') {
        this.error('Iframe widget expects a URL');
        return null;
      }
      return `${usersChoice}${this.updatePathParam}`;
    },
    frameHeight() {
      return this.options.frameHeight;
    },
    /* Generates an ID for the iframe */
    frameId() {
      return `iframe-${btoa(this.frameUrl || 'empty').substring(0, 16)}`;
    },
    /* Generate a URL param, to be updated in order to re-fetch image */
    updatePathParam() {
      return this.updateCount ? `#dashy-update-${this.updateCount}` : '';
    },
  },
  methods: {
    /* Refreshes iframe contents, called by parent */
    update() {
      this.startLoading();
      const iframe = document.getElementById(this.frameId);
      if (iframe.contentWindow) {
        try {
          iframe.contentWindow.location.href = this.frameUrl;
          iframe.contentWindow.location.reload(true);
        } catch (e) {
          this.error('Failed to refresh iframe', e, true);
        }
      } else {
        this.error('Couldn\'t find iframe', null, true);
      }
      this.finishLoading();
    },
  },
};
</script>

<style scoped lang="scss">
.iframe-widget {
  iframe {
    width: 100%;
    min-height: 80px;
    border: 0;
  }
}

</style>
