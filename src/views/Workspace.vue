<template>
  <div class="work-space">
    <SideBar :sections="sections" @launch-app="launchApp" />
    <WebContent :url="url" />
  </div>
</template>

<script>

import SideBar from '@/components/Workspace/SideBar';
import WebContent from '@/components/Workspace/WebContent';
import {
  localStorageKeys,
  theme as defaultTheme,
  fontAwesomeKey as defaultFontAwesomeKey,
} from '@/utils/defaults';

export default {
  name: 'Workspace',
  props: {
    sections: Array,
    appConfig: Object,
  },
  data: () => ({
    url: '', // this.$route.query.url || '',
  }),
  components: {
    SideBar,
    WebContent,
  },
  methods: {
    launchApp(url) {
      this.url = url;
    },
    setTheme() {
      const theme = localStorage[localStorageKeys.THEME] || this.confTheme || defaultTheme;
      const htmlTag = document.getElementsByTagName('html')[0];
      if (htmlTag.hasAttribute('data-theme')) htmlTag.removeAttribute('data-theme');
      htmlTag.setAttribute('data-theme', theme);
    },
    initiateFontAwesome() {
      const fontAwesomeScript = document.createElement('script');
      const faKey = this.appConfig.fontAwesomeKey || defaultFontAwesomeKey;
      fontAwesomeScript.setAttribute('src', `https://kit.fontawesome.com/${faKey}.js`);
      document.head.appendChild(fontAwesomeScript);
    },
    repositionFooter() {
      document.getElementsByTagName('footer')[0].style.position = 'fixed';
    },
  },
  mounted() {
    const route = this.$route;
    if (route.query && route.query.url) this.url = decodeURI(route.query.url);
    this.setTheme();
    this.initiateFontAwesome();
    // this.repositionFooter();
  },
};

</script>

<style scoped lang="scss">
.work-space {
  min-height: calc(100vh - var(--footer-height));
}
</style>
