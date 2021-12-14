<template>
<div class="html-widget">
  <div :id="elementId" />
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  computed: {
    html() {
      return this.options.html || '';
    },
    css() {
      return this.options.css || '';
    },
    script() {
      return this.options.script || '';
    },
    scriptSrc() {
      return this.options.scriptSrc || '';
    },
    elementId() {
      return `elem-${Math.round(Math.random() * 10000)}`;
    },
  },
  mounted() {
    this.initiate();
  },
  beforeDestroy() {
    if (this.eventListener) {
      document.removeEventListener(this.eventListener);
    }
  },
  data: () => ({
    eventListener: null,
  }),
  methods: {
    /* Injects users content */
    injectHtml() {
      if (this.html) {
        const element = document.getElementById(this.elementId);
        element.innerHTML = this.html;
      }
      if (this.css) {
        const styleElem = document.createElement('style');
        styleElem.textContent = this.css;
        document.head.append(styleElem);
      }
      if (this.script) {
        const scriptElem = document.createElement('script');
        scriptElem.text = this.script;
        document.head.append(scriptElem);
      }
      if (this.scriptSrc) {
        const scriptElem = document.createElement('script');
        scriptElem.src = this.scriptSrc;
        document.head.append(scriptElem);
      }
    },
    /* What for the DOM to finish loading, before proceeding */
    initiate() {
      if (document.readyState === 'complete' || document.readyState === 'loaded') {
        this.injectHtml();
      } else {
        this.eventListener = document.addEventListener('DOMContentLoaded', () => {
          this.injectHtml();
        });
      }
    },
    update() {
      this.injectHtml();
    },
  },
};
</script>

<style scoped lang="scss">
.html-widget {
  width: 100%;
  min-height: 240px;
}

</style>
