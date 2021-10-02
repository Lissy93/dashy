<template>
  <div class="work-space">
    <SideBar :sections="sections" @launch-app="launchApp" :initUrl="getInitialUrl()" />
    <WebContent :url="url" v-if="!isMultiTaskingEnabled" />
    <MultiTaskingWebComtent :url="url" v-else />
  </div>
</template>

<script>

import SideBar from '@/components/Workspace/SideBar';
import WebContent from '@/components/Workspace/WebContent';
import MultiTaskingWebComtent from '@/components/Workspace/MultiTaskingWebComtent';
import Defaults from '@/utils/defaults';
import { GetTheme, ApplyLocalTheme, ApplyCustomVariables } from '@/utils/ThemeHelper';

export default {
  name: 'Workspace',
  props: {
    sections: Array,
    appConfig: Object,
  },
  data: () => ({
    url: '',
    GetTheme,
    ApplyLocalTheme,
    ApplyCustomVariables,
  }),
  computed: {
    isMultiTaskingEnabled() {
      return this.appConfig.enableMultiTasking || false;
    },
  },
  components: {
    SideBar,
    WebContent,
    MultiTaskingWebComtent,
  },
  methods: {
    launchApp(options) {
      if (options.target === 'newtab') {
        window.open(options.url, '_blank');
      } else {
        this.url = options.url;
      }
    },
    setTheme() {
      const theme = this.GetTheme();
      this.ApplyLocalTheme(theme);
      this.ApplyCustomVariables(theme);
    },
    initiateFontAwesome() {
      const fontAwesomeScript = document.createElement('script');
      const faKey = this.appConfig.fontAwesomeKey || Defaults.fontAwesomeKey;
      fontAwesomeScript.setAttribute('src', `https://kit.fontawesome.com/${faKey}.js`);
      document.head.appendChild(fontAwesomeScript);
    },
    /* Returns a service URL, if set as a URL param, or if user has specified landing URL */
    getInitialUrl() {
      const route = this.$route;
      if (route.query && route.query.url) {
        return decodeURI(route.query.url);
      } else if (this.appConfig.workspaceLandingUrl) {
        return this.appConfig.workspaceLandingUrl;
      }
      return undefined;
    },
  },
  mounted() {
    this.setTheme();
    this.initiateFontAwesome();
    this.url = this.getInitialUrl();
  },
};

</script>

<style scoped lang="scss">
.work-space {
  min-height: calc(100vh - var(--footer-height));
}
</style>
