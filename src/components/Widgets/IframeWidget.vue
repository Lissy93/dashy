<template>
<div class="iframe-widget">
  <iframe
    v-if="frameUrl"
    :src="frameUrl"
    :id="frameId"
    title="Iframe Widget"
    :style="frameHeight ? `height: ${frameHeight}px` : ''"
  />
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  computed: {
    /* Gets users specified URL to load into the iframe */
    frameUrl() {
      const usersChoice = this.options.url;
      if (!usersChoice || typeof usersChoice !== 'string') {
        this.error('Iframe widget expects a URL');
        return null;
      }
      return usersChoice;
    },
    frameHeight() {
      return this.options.frameHeight;
    },
    /* Generates an ID for the iframe */
    frameId() {
      return `iframe-${btoa(this.frameUrl || 'empty').substring(0, 16)}`;
    },
  },
  methods: {
    /* Refreshes iframe contents, called by parent */
    update() {
      this.startLoading();
      (document.getElementById(this.frameId) || {}).src = this.frameUrl;
      this.finishLoading();
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
