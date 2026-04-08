<template>
  <div class="work-space">
    <SideBar
      :sections="sections"
      @launch-app="launchApp"
      @launch-widget="launchWidget"
      :initUrl="getInitialUrl()"
    />
    <WebContent :url="url" v-if="!isMultiTaskingEnabled" />
    <MultiTaskingWebComtent :url="url" v-else />
    <WidgetView :widgets="widgets" v-if="widgets" />
  </div>
</template>

<script>
import HomeMixin from '@/mixins/HomeMixin';
import SideBar from '@/components/Workspace/SideBar';
import WebContent from '@/components/Workspace/WebContent';
import WidgetView from '@/components/Workspace/WidgetView';
import MultiTaskingWebComtent from '@/components/Workspace/MultiTaskingWebComtent';
import Defaults from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';

export default {
  name: 'Workspace',
  mixins: [HomeMixin],
  data: () => ({
    url: '',
    widgets: null,
  }),
  computed: {
    sections() {
      return this.$store.getters.sections;
    },
    appConfig() {
      return this.$store.getters.appConfig;
    },
    isMultiTaskingEnabled() {
      return this.appConfig.enableMultiTasking || false;
    },
  },
  components: {
    SideBar,
    WebContent,
    WidgetView,
    MultiTaskingWebComtent,
  },
  methods: {
    launchApp(options) {
      if (options.target === 'newtab') {
        window.open(options.url, '_blank');
      } else if (options.target === 'newwindow') {
        const { width, height } = window.screen;
        window.open(options.url, '_blank', `width=${width},height=${height},noopener,noreferrer`);
      } else if (options.target === 'clipboard') {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(options.url);
          this.$toasted.show(this.$t('context-menus.item.copied-toast'), { className: 'toast-success' });
        } else {
          ErrorHandler('Clipboard access requires HTTPS. See: https://bit.ly/3N5WuAA');
          this.$toasted.show('Unable to copy, see log', { className: 'toast-error' });
        }
        return;
      } else {
        this.url = options.url;
      }
      this.widgets = null;
    },
    launchWidget(widgets) {
      this.url = '';
      this.widgets = widgets;
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
    this.initiateFontAwesome();
    this.initiateMaterialDesignIcons();
    this.setTheme();
    this.url = this.getInitialUrl();
  },
};

</script>

<style scoped lang="scss">
.work-space {
  min-height: fit-content;
}
:global(footer) {
  display: none;
}
</style>
