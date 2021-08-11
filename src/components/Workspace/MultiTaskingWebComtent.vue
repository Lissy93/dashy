<template>
  <div class="web-content" ref="container">
    <button @click="launchApp">Click Me</button>
  </div>
</template>

<script>
import Vue from 'vue';
import WebContent from '@/components/Workspace/WebContent';

export default {
  name: 'WebContent',
  props: {
    url: String,
    currentApp: String,
  },
  data: () => ({
    openApps: [],
    activeApp: '',
  }),
  methods: {
    launchApp() {
      if (this.openApps.includes(this.url)) {
        this.openExistingApp();
      } else {
        this.openApps.push(this.url);
        this.appendNewApp();
      }
    },
    appendNewApp() {
      const ComponentClass = Vue.extend(WebContent);
      const instance = new ComponentClass({
        propsData: { url: this.url },
      });
      instance.$mount(); // pass nothing
      this.$refs.container.appendChild(instance.$el);
    },
    openExistingApp() {
      console.log('Already Exists', this.url);
      // TODO: Find open frame, and set visibility
    },
  },
};
</script>

<style lang="scss" scoped>

iframe {
  position: absolute;
  left: var(--side-bar-width);
  height: calc(100% - var(--header-height));
  width: calc(100% - var(--side-bar-width));
  border: none;
  background: white;
}

</style>
