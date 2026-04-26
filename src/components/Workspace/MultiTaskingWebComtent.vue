<template>
  <div class="multi-taking-view" ref="container"></div>
</template>

<script>
/* eslint-disable vue/one-component-per-file -- intentional: dynamically-mounted inline component */
import { createApp, h } from 'vue';
import WebContent from '@/components/Workspace/WebContent';

export default {
  name: 'WebContent',
  props: {
    url: { type: String, default: '' }, // The URL of currently visible app
  },
  data: () => ({
    openApps: [], // List of all currently open apps
    appInstances: [], // Track mounted app instances for cleanup
  }),
  watch: {
    /* Update the currently open app, when URL changes */
    url() { this.launchApp(); },
  },
  beforeUnmount() {
    this.appInstances.forEach(instance => instance.unmount());
  },
  methods: {
    /* Check if app already open or not, and call appropriate opener */
    launchApp() {
      if (this.openApps.includes(this.url)) {
        this.openExistingApp();
      } else {
        this.openApps.push(this.url);
        this.appendNewApp();
      }
    },
    /* Opens a new app */
    appendNewApp() {
      const wrapper = document.createElement('div');
      this.$refs.container.appendChild(wrapper);
      const appUrl = this.url;
      const instance = createApp({
        render() { return h(WebContent, { url: appUrl, id: btoa(appUrl) }); },
      });
      instance.mount(wrapper);
      this.appInstances.push(instance);
    },
    /* Switches visibility to an already open app */
    openExistingApp() {
      Array.from(document.getElementsByClassName('web-content')).forEach((frame) => {
        frame.classList.add('hide');
      });
      const el = document.getElementById(btoa(this.url));
      if (el) el.classList.remove('hide');
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
