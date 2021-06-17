<template>
  <div class="work-space">
    <SideBar :sections="sections" @launch="launchService" />
    <WebContent :url="url" />
  </div>
</template>

<script>

import SideBar from '@/components/Workspace/SideBar';
import WebContent from '@/components/Workspace/WebContent';
import Defaults, { localStorageKeys } from '@/utils/defaults';

export default {
  name: 'Workspace',
  props: {
    sections: Array,
    appConfig: Object,
  },
  data: () => ({
    url: '',
  }),
  components: {
    SideBar,
    WebContent,
  },
  methods: {
    launchService(url) {
      this.url = url;
    },
    setTheme() {
      const theme = localStorage[localStorageKeys.THEME] || this.confTheme || Defaults.theme;
      const htmlTag = document.getElementsByTagName('html')[0];
      if (htmlTag.hasAttribute('data-theme')) htmlTag.removeAttribute('data-theme');
      htmlTag.setAttribute('data-theme', theme);
    },
    initiateFontAwesome() {
      const fontAwesomeScript = document.createElement('script');
      const faKey = this.appConfig.fontAwesomeKey || Defaults.fontAwesomeKey;
      fontAwesomeScript.setAttribute('src', `https://kit.fontawesome.com/${faKey}.js`);
      document.head.appendChild(fontAwesomeScript);
    },
  },
  mounted() {
    this.setTheme();
    this.initiateFontAwesome();
  },
};

</script>

<style scoped lang="scss">

</style>
