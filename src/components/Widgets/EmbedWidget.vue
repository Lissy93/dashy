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
    /* Optional HTML markup to be rendered */
    html() {
      return this.options.html || '';
    },
    /* Optional CSS styles to be applied */
    css() {
      return this.options.css || '';
    },
    /* Optional raw JavaScript to be executed */
    script() {
      return this.options.script || '';
    },
    /* Optional path to JS script to be fetched */
    scriptSrc() {
      return this.options.scriptSrc || '';
    },
    /* Unique element ID */
    elementId() {
      return `elem-${Math.round(Math.random() * 10000)}`;
    },
  },
  mounted() {
    this.initiate();
  },
  beforeDestroy() {
    window.removeEventListener('load', this.injectHtml);
  },
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
        window.addEventListener('load', this.injectHtml);
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
