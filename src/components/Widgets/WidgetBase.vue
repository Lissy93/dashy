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
      <Clock
        v-if="widgetType === 'clock'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <CryptoPriceChart
        v-else-if="widgetType === 'crypto-price-chart'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <CryptoWatchList
        v-else-if="widgetType === 'crypto-watch-list'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <CodeStats
        v-else-if="widgetType === 'code-stats'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <EmbedWidget
        v-else-if="widgetType === 'embed'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <ExchangeRates
        v-else-if="widgetType === 'exchange-rates'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <Flights
        v-else-if="widgetType === 'flight-data'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <IframeWidget
        v-else-if="widgetType === 'iframe'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <Jokes
        v-else-if="widgetType === 'joke'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <NdCpuHistory
        v-else-if="widgetType === 'nd-cpu-history'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <NdLoadHistory
        v-else-if="widgetType === 'nd-load-history'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <NdRamHistory
        v-else-if="widgetType === 'nd-ram-history'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <PublicHolidays
        v-else-if="widgetType === 'public-holidays'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <RssFeed
        v-else-if="widgetType === 'rss-feed'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <StockPriceChart
        v-else-if="widgetType === 'stock-price-chart'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <SystemInfo
        v-else-if="widgetType === 'system-info'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <TflStatus
        v-else-if="widgetType === 'tfl-status'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <XkcdComic
        v-else-if="widgetType === 'xkcd-comic'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <Weather
        v-else-if="widgetType === 'weather'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <WeatherForecast
        v-else-if="widgetType === 'weather-forecast'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <!-- No widget type specified -->
      <div v-else>{{ handleError('Widget type was not found') }}</div>
    </div>
  </div>
</template>

<script>
// Import form elements, icons and utils
import ErrorHandler from '@/utils/ErrorHandler';
import Button from '@/components/FormElements/Button';
import UpdateIcon from '@/assets/interface-icons/widget-update.svg';
import OpenIcon from '@/assets/interface-icons/open-new-tab.svg';
import LoadingAnimation from '@/assets/interface-icons/loader.svg';

// Import available widgets (add new widgets alphabetically)
import Clock from '@/components/Widgets/Clock.vue';
import CryptoPriceChart from '@/components/Widgets/CryptoPriceChart.vue';
import CryptoWatchList from '@/components/Widgets/CryptoWatchList.vue';
import CodeStats from '@/components/Widgets/CodeStats.vue';
import EmbedWidget from '@/components/Widgets/EmbedWidget.vue';
import ExchangeRates from '@/components/Widgets/ExchangeRates.vue';
import Flights from '@/components/Widgets/Flights.vue';
import IframeWidget from '@/components/Widgets/IframeWidget.vue';
import Jokes from '@/components/Widgets/Jokes.vue';
import NdCpuHistory from '@/components/Widgets/NdCpuHistory.vue';
import NdLoadHistory from '@/components/Widgets/NdLoadHistory.vue';
import NdRamHistory from '@/components/Widgets/NdRamHistory.vue';
import PublicHolidays from '@/components/Widgets/PublicHolidays.vue';
import RssFeed from '@/components/Widgets/RssFeed.vue';
import StockPriceChart from '@/components/Widgets/StockPriceChart.vue';
import SystemInfo from '@/components/Widgets/SystemInfo.vue';
import TflStatus from '@/components/Widgets/TflStatus.vue';
import Weather from '@/components/Widgets/Weather.vue';
import WeatherForecast from '@/components/Widgets/WeatherForecast.vue';
import XkcdComic from '@/components/Widgets/XkcdComic.vue';

export default {
  name: 'Widget',
  components: {
    // Register form elements
    Button,
    UpdateIcon,
    OpenIcon,
    LoadingAnimation,
    // Register widget components
    Clock,
    CodeStats,
    CryptoPriceChart,
    CryptoWatchList,
    EmbedWidget,
    ExchangeRates,
    Flights,
    IframeWidget,
    Jokes,
    NdCpuHistory,
    NdLoadHistory,
    NdRamHistory,
    PublicHolidays,
    RssFeed,
    StockPriceChart,
    SystemInfo,
    TflStatus,
    Weather,
    WeatherForecast,
    XkcdComic,
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
