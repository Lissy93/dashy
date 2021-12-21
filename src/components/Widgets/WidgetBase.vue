<template>
  <div :class="`widget-base ${ loading ? 'is-loading' : '' }`">
    <!-- Update and Full-Page Action Buttons  -->
    <Button :click="update" class="action-btn update-btn" v-if="!error && !loading">
      <UpdateIcon />
    </Button>
    <Button :click="fullScreenWidget" class="action-btn open-btn" v-if="!error && !loading">
      <OpenIcon />
    </Button>
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading">
      <LoadingAnimation v-if="loading" class="loader" />
    </div>
    <!-- Error Message Display -->
    <div v-if="error" class="widget-error">
      <p class="error-msg">An error occurred, see the logs for more info.</p>
      <p class="error-output">{{ errorMsg }}</p>
    </div>
    <!-- Widget -->
    <div v-else class="widget-wrap">
      <WidgetComponent
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import ErrorHandler from '@/utils/ErrorHandler';
import Button from '@/components/FormElements/Button';
import UpdateIcon from '@/assets/interface-icons/widget-update.svg';
import OpenIcon from '@/assets/interface-icons/open-new-tab.svg';
import LoadingAnimation from '@/assets/interface-icons/loader.svg';

export default {
  name: 'Widget',
  components: {
    Button,
    UpdateIcon,
    OpenIcon,
    LoadingAnimation,
  },
  props: {
    widget: Object,
    index: Number,
  },
  data: () => ({
    loading: false,
    error: false,
    errorMsg: null,
  }),
  computed: {
    /* Returns the widget type, shows error if not specified */
    widgetType() {
      if (!this.widget.type) {
        ErrorHandler('Missing type attribute for widget');
        return null;
      }
      return this.widget.type.toLowerCase();
    },
    /* Returns users specified widget options, or empty object */
    widgetOptions() {
      return this.widget.options || {};
    },
    /* A unique string to reference the widget by */
    widgetRef() {
      return `widget-${this.widgetType}-${this.index}`;
    },
  },
  methods: {
    /* Calls update data method on widget */
    update() {
      this.$refs[this.widgetRef].update();
    },
    /* Shows message when error occurred */
    handleError(msg) {
      this.error = true;
      this.errorMsg = msg;
    },
    /* Opens current widget in full-page */
    fullScreenWidget() {
      this.$emit('navigateToSection');
    },
    /* Toggles loading state */
    setLoaderState(loading) {
      this.loading = loading;
    },
    getComponent() {
      /* eslint-disable global-require, max-len */
      const widgetType = this.widget.type;
      if (!widgetType) { // widget type not specified
        this.handleError('Widget type was not specified');
        return () => require('@/components/Widgets/Blank.vue').default;
      }
      switch (widgetType) {
        case ('apod'): return () => require('@/components/Widgets/Apod.vue').default;
        case ('clock'): return () => require('@/components/Widgets/Clock.vue').default;
        case ('code-stats'): return () => require('@/components/Widgets/CodeStats.vue').default;
        case ('crypto-price-chart'): return () => require('@/components/Widgets/CryptoPriceChart.vue').default;
        case ('crypto-watch-list'): return () => require('@/components/Widgets/CryptoWatchList.vue').default;
        case ('embed'): return () => require('@/components/Widgets/EmbedWidget.vue').default;
        case ('exchange-rates'): return () => require('@/components/Widgets/ExchangeRates.vue').default;
        case ('flight-data'): return () => require('@/components/Widgets/Flights.vue').default;
        case ('github-trending-repos'): return () => require('@/components/Widgets/GitHubTrending.vue').default;
        case ('github-profile-stats'): return () => require('@/components/Widgets/GitHubProfile.vue').default;
        case ('health-checks'): return () => require('@/components/Widgets/HealthChecks.vue').default;
        case ('iframe'): return () => require('@/components/Widgets/IframeWidget.vue').default;
        case ('joke'): return () => require('@/components/Widgets/Jokes.vue').default;
        case ('nd-cpu-history'): return () => require('@/components/Widgets/NdCpuHistory.vue').default;
        case ('nd-load-history'): return () => require('@/components/Widgets/NdLoadHistory.vue').default;
        case ('nd-ram-history'): return () => require('@/components/Widgets/NdRamHistory.vue').default;
        case ('news-headlines'): return () => require('@/components/Widgets/NewsHeadlines.vue').default;
        case ('pi-hole-stats'): return () => require('@/components/Widgets/PiHoleStats.vue').default;
        case ('pi-hole-top-queries'): return () => require('@/components/Widgets/PiHoleTopQueries.vue').default;
        case ('pi-hole-traffic'): return () => require('@/components/Widgets/PiHoleTraffic.vue').default;
        case ('public-holidays'): return () => require('@/components/Widgets/PublicHolidays.vue').default;
        case ('public-ip'): return () => require('@/components/Widgets/PublicIp.vue').default;
        case ('rss-feed'): return () => require('@/components/Widgets/RssFeed.vue').default;
        case ('stat-ping'): return () => require('@/components/Widgets/StatPing.vue').default;
        case ('stock-price-chart'): return () => require('@/components/Widgets/StockPriceChart.vue').default;
        case ('system-info'): return () => require('@/components/Widgets/SystemInfo.vue').default;
        case ('tfl-status'): return () => require('@/components/Widgets/TflStatus.vue').default;
        case ('xkcd-comic'): return () => require('@/components/Widgets/XkcdComic.vue').default;
        case ('weather'): return () => require('@/components/Widgets/Weather.vue').default;
        case ('weather-forecast'): return () => require('@/components/Widgets/WeatherForecast.vue').default;
        default: { // No widget found for specified type
          this.handleError(`Widget not found: ${widgetType}`);
          return () => require('@/components/Widgets/Blank.vue').default;
        }
      }
      /* eslint-enable global-require, max-len */
    },
  },
  beforeMount() {
    const WidgetComponent = this.getComponent();
    Vue.component('WidgetComponent', WidgetComponent());
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';
.widget-base {
  position: relative;
  padding-top: 0.75rem;
  // Refresh and full-page action buttons
  button.action-btn  {
    height: 1rem;
    min-width: auto;
    width: 1.75rem;
    margin: 0;
    padding: 0.1rem 0;
    position: absolute;
    top: 0;
    border: none;
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
    &:hover {
      opacity: 1;
      color: var(--widget-background-color);
    }
    &.update-btn {
      right: -0.25rem;
    }
    &.open-btn {
      right: 1.75rem;
    }
  }
  // Error message output
  .widget-error {
    p.error-msg {
      color: var(--warning);
      font-weight: bold;
      font-size: 1rem;
      margin: 0 auto 0.5rem auto;
    }
    p.error-output {
      font-family: var(--font-monospace);
      color: var(--widget-text-color);
      font-size: 0.85rem;
      margin: 0.5rem auto;
    }
  }
  // Loading spinner
  .loading {
    margin: 0.2rem auto;
    text-align: center;
    svg.loader {
      width: 100px;
    }
  }
  // Hide widget contents while loading
  &.is-loading {
    .widget-wrap {
      display: none;
    }
  }
}

</style>
