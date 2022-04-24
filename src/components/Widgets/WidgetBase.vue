<template>
  <div :class="`widget-base ${ loading ? 'is-loading' : '' }`">
    <!-- Update and Full-Page Action Buttons  -->
    <Button :click="update" class="action-btn update-btn" v-if="!hideControls && !loading">
      <UpdateIcon />
    </Button>
    <Button :click="fullScreenWidget"
      class="action-btn open-btn" v-if="!hideControls && !error && !loading">
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
      <p class="retry-link" @click="update">Retry</p>
    </div>
    <!-- Widget -->
    <div :class="`widget-wrap ${ error ? 'has-error' : '' }`">
      <AnonAddy
        v-if="widgetType === 'anonaddy'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <Apod
        v-else-if="widgetType === 'apod'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <BlacklistCheck
        v-else-if="widgetType === 'blacklist-check'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <Clock
        v-else-if="widgetType === 'clock'"
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
      <CveVulnerabilities
        v-else-if="widgetType === 'cve-vulnerabilities'"
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
      <CovidStats
        v-else-if="widgetType === 'covid-stats'"
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
      <EthGasPrices
        v-else-if="widgetType === 'eth-gas-prices'"
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
      <GitHubProfile
        v-else-if="widgetType === 'github-profile-stats'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GitHubTrending
        v-else-if="widgetType === 'github-trending-repos'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlAlerts
        v-else-if="widgetType === 'gl-alerts'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlCpuCores
        v-else-if="widgetType === 'gl-current-cores'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlCpuGauge
        v-else-if="widgetType === 'gl-current-cpu'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlCpuHistory
        v-else-if="widgetType === 'gl-cpu-history'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlDiskIo
        v-else-if="widgetType === 'gl-disk-io'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlDiskSpace
        v-else-if="widgetType === 'gl-disk-space'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlIpAddress
        v-else-if="widgetType === 'gl-ip-address'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlLoadHistory
        v-else-if="widgetType === 'gl-load-history'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlMemGauge
        v-else-if="widgetType === 'gl-current-mem'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlMemHistory
        v-else-if="widgetType === 'gl-mem-history'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlNetworkInterfaces
        v-else-if="widgetType === 'gl-network-interfaces'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlNetworkTraffic
        v-else-if="widgetType === 'gl-network-traffic'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlSystemLoad
        v-else-if="widgetType === 'gl-system-load'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <GlCpuTemp
        v-else-if="widgetType === 'gl-cpu-temp'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <HealthChecks
        v-else-if="widgetType === 'health-checks'"
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
      <ImageWidget
        v-else-if="widgetType === 'image'"
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
      <MullvadStatus
        v-else-if="widgetType === 'mullvad-status'"
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
      <NewsHeadlines
        v-else-if="widgetType === 'news-headlines'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <PiHoleStats
        v-else-if="widgetType === 'pi-hole-stats'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <PiHoleTopQueries
        v-else-if="widgetType === 'pi-hole-top-queries'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <PiHoleTraffic
        v-else-if="widgetType === 'pi-hole-traffic'"
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
      <PublicIp
        v-else-if="widgetType === 'public-ip'"
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
      <SportsScores
        v-else-if="widgetType === 'sports-scores'"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
      <StatPing
        v-else-if="widgetType === 'stat-ping'"
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
      <SynologyDownload
        v-else-if="widgetType === 'synology-download'"
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
      <WalletBalance
        v-else-if="widgetType === 'wallet-balance'"
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
      <XkcdComic
        v-else-if="widgetType === 'xkcd-comic'"
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

export default {
  name: 'Widget',
  components: {
    // Register form elements
    Button,
    UpdateIcon,
    OpenIcon,
    LoadingAnimation,
    // Register widget components
    AnonAddy: () => import('@/components/Widgets/AnonAddy.vue'),
    Apod: () => import('@/components/Widgets/Apod.vue'),
    BlacklistCheck: () => import('@/components/Widgets/BlacklistCheck.vue'),
    Clock: () => import('@/components/Widgets/Clock.vue'),
    CodeStats: () => import('@/components/Widgets/CodeStats.vue'),
    CovidStats: () => import('@/components/Widgets/CovidStats.vue'),
    CryptoPriceChart: () => import('@/components/Widgets/CryptoPriceChart.vue'),
    CryptoWatchList: () => import('@/components/Widgets/CryptoWatchList.vue'),
    CveVulnerabilities: () => import('@/components/Widgets/CveVulnerabilities.vue'),
    EmbedWidget: () => import('@/components/Widgets/EmbedWidget.vue'),
    EthGasPrices: () => import('@/components/Widgets/EthGasPrices.vue'),
    ExchangeRates: () => import('@/components/Widgets/ExchangeRates.vue'),
    Flights: () => import('@/components/Widgets/Flights.vue'),
    GitHubTrending: () => import('@/components/Widgets/GitHubTrending.vue'),
    GitHubProfile: () => import('@/components/Widgets/GitHubProfile.vue'),
    GlAlerts: () => import('@/components/Widgets/GlAlerts.vue'),
    GlCpuCores: () => import('@/components/Widgets/GlCpuCores.vue'),
    GlCpuGauge: () => import('@/components/Widgets/GlCpuGauge.vue'),
    GlCpuHistory: () => import('@/components/Widgets/GlCpuHistory.vue'),
    GlDiskIo: () => import('@/components/Widgets/GlDiskIo.vue'),
    GlDiskSpace: () => import('@/components/Widgets/GlDiskSpace.vue'),
    GlIpAddress: () => import('@/components/Widgets/GlIpAddress.vue'),
    GlLoadHistory: () => import('@/components/Widgets/GlLoadHistory.vue'),
    GlMemGauge: () => import('@/components/Widgets/GlMemGauge.vue'),
    GlMemHistory: () => import('@/components/Widgets/GlMemHistory.vue'),
    GlNetworkInterfaces: () => import('@/components/Widgets/GlNetworkInterfaces.vue'),
    GlNetworkTraffic: () => import('@/components/Widgets/GlNetworkTraffic.vue'),
    GlSystemLoad: () => import('@/components/Widgets/GlSystemLoad.vue'),
    GlCpuTemp: () => import('@/components/Widgets/GlCpuTemp.vue'),
    HealthChecks: () => import('@/components/Widgets/HealthChecks.vue'),
    IframeWidget: () => import('@/components/Widgets/IframeWidget.vue'),
    ImageWidget: () => import('@/components/Widgets/ImageWidget.vue'),
    Jokes: () => import('@/components/Widgets/Jokes.vue'),
    MullvadStatus: () => import('@/components/Widgets/MullvadStatus.vue'),
    NdCpuHistory: () => import('@/components/Widgets/NdCpuHistory.vue'),
    NdLoadHistory: () => import('@/components/Widgets/NdLoadHistory.vue'),
    NdRamHistory: () => import('@/components/Widgets/NdRamHistory.vue'),
    NewsHeadlines: () => import('@/components/Widgets/NewsHeadlines.vue'),
    PiHoleStats: () => import('@/components/Widgets/PiHoleStats.vue'),
    PiHoleTopQueries: () => import('@/components/Widgets/PiHoleTopQueries.vue'),
    PiHoleTraffic: () => import('@/components/Widgets/PiHoleTraffic.vue'),
    PublicHolidays: () => import('@/components/Widgets/PublicHolidays.vue'),
    PublicIp: () => import('@/components/Widgets/PublicIp.vue'),
    RssFeed: () => import('@/components/Widgets/RssFeed.vue'),
    SportsScores: () => import('@/components/Widgets/SportsScores.vue'),
    StatPing: () => import('@/components/Widgets/StatPing.vue'),
    StockPriceChart: () => import('@/components/Widgets/StockPriceChart.vue'),
    SynologyDownload: () => import('@/components/Widgets/SynologyDownload.vue'),
    SystemInfo: () => import('@/components/Widgets/SystemInfo.vue'),
    TflStatus: () => import('@/components/Widgets/TflStatus.vue'),
    WalletBalance: () => import('@/components/Widgets/WalletBalance.vue'),
    Weather: () => import('@/components/Widgets/Weather.vue'),
    WeatherForecast: () => import('@/components/Widgets/WeatherForecast.vue'),
    XkcdComic: () => import('@/components/Widgets/XkcdComic.vue'),
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
    appConfig() {
      return this.$store.getters.appConfig;
    },
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
      const options = this.widget.options || {};
      const timeout = this.widget.timeout || null;
      const useProxy = this.appConfig.widgetsAlwaysUseProxy || !!this.widget.useProxy;
      const updateInterval = this.widget.updateInterval !== undefined
        ? this.widget.updateInterval : null;
      return {
        timeout, useProxy, updateInterval, ...options,
      };
    },
    /* A unique string to reference the widget by */
    widgetRef() {
      return `widget-${this.widgetType}-${this.index}`;
    },
    hideControls() {
      return this.widget.hideControls;
    },
  },
  methods: {
    /* Calls update data method on widget */
    update() {
      this.error = false;
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
  padding: 0.75rem 0.5rem 0.5rem 0.5rem;
  background: var(--widget-base-background);
  box-shadow: var(--widget-base-shadow, none);
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

  .widget-wrap {
    &.has-error {
      cursor: not-allowed;
      opacity: 0.5;
      border-radius: var(--curve-factor);
      background: #ffff0080;
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
    p.retry-link {
      cursor: pointer;
      text-decoration: underline;
      color: var(--widget-text-color);
      font-size: 0.85rem;
      margin: 0;
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
