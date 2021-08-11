<template>
  <div class="work-space">
    <SideBar :sections="sections" @launch-app="launchApp" />
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
    url: '', // this.$route.query.url || '',
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
    launchApp(url) {
      this.url = url;
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
