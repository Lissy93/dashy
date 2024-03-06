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
    <!-- Widget Label -->
    <div class="widget-label" v-if="widgetOptions.label">{{ widgetOptions.label }}</div>
    <!-- Widget -->
    <div :class="`widget-wrap ${ error ? 'has-error' : '' }`">
      <component
        v-bind:is="component"
        :options="widgetOptions"
        @loading="setLoaderState"
        @error="handleError"
        :ref="widgetRef"
      />
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

const COMPAT = {
  'adguard-dns-info': 'AdGuardDnsInfo',
  'adguard-filter-status': 'AdGuardFilterStatus',
  'adguard-stats': 'AdGuardStats',
  'adguard-top-domains': 'AdGuardTopDomains',
  anonaddy: 'AnonAddy',
  apod: 'Apod',
  'blacklist-check': 'BlacklistCheck',
  clock: 'Clock',
  'crypto-price-chart': 'CryptoPriceChart',
  'crypto-watch-list': 'CryptoWatchList',
  'custom-search': 'CustomSearch',
  'cve-vulnerabilities': 'CveVulnerabilities',
  'domain-monitor': 'DomainMonitor',
  'code-stats': 'CodeStats',
  'covid-stats': 'CovidStats',
  'drone-ci': 'DroneCi',
  embed: 'EmbedWidget',
  'eth-gas-prices': 'EthGasPrices',
  'exchange-rates': 'ExchangeRates',
  'flight-data': 'Flights',
  'github-profile-stats': 'GitHubProfile',
  'github-trending-repos': 'GitHubTrending',
  'gl-alerts': 'GlAlerts',
  'gl-current-cores': 'GlCpuCores',
  'gl-current-cpu': 'GlCpuGauge',
  'gl-cpu-speedometer': 'GlCpuSpeedometer',
  'gl-cpu-history': 'GlCpuHistory',
  'gl-disk-io': 'GlDiskIo',
  'gl-disk-space': 'GlDiskSpace',
  'gl-ip-address': 'GlIpAddress',
  'gl-load-history': 'GlLoadHistory',
  'gl-current-mem': 'GlMemGauge',
  'gl-mem-speedometer': 'GlMemSpeedometer',
  'gl-mem-history': 'GlMemHistory',
  'gl-network-interfaces': 'GlNetworkInterfaces',
  'gl-network-traffic': 'GlNetworkTraffic',
  'gl-system-load': 'GlSystemLoad',
  'gl-cpu-temp': 'GlCpuTemp',
  'health-checks': 'HealthChecks',
  'hackernews-trending': 'HackernewsTrending',
  'gluetun-status': 'GluetunStatus',
  iframe: 'IframeWidget',
  image: 'ImageWidget',
  joke: 'Jokes',
  'mullvad-status': 'MullvadStatus',
  mvg: 'Mvg',
  linkding: 'Linkding',
  'mvg-connection': 'MvgConnection',
  'nd-cpu-history': 'NdCpuHistory',
  'nd-load-history': 'NdLoadHistory',
  'nd-ram-history': 'NdRamHistory',
  'news-headlines': 'NewsHeadlines',
  'nextcloud-notifications': 'NextcloudNotifications',
  'nextcloud-php-opcache': 'NextcloudPhpOpcache',
  'nextcloud-stats': 'NextcloudStats',
  'nextcloud-system': 'NextcloudSystem',
  'nextcloud-user': 'NextcloudUser',
  'nextcloud-user-status': 'NextcloudUserStatus',
  'pi-hole-stats': 'PiHoleStats',
  'pi-hole-top-queries': 'PiHoleTopQueries',
  'pi-hole-traffic': 'PiHoleTraffic',
  'proxmox-lists': 'Proxmox',
  'public-holidays': 'PublicHolidays',
  'public-ip': 'PublicIp',
  'rescue-time': 'RescueTime',
  'rss-feed': 'RssFeed',
  sabnzbd: 'Sabnzbd',
  'sports-scores': 'SportsScores',
  'stat-ping': 'StatPing',
  'stock-price-chart': 'StockPriceChart',
  'synology-download': 'SynologyDownload',
  'system-info': 'SystemInfo',
  'tfl-status': 'TflStatus',
  'uptime-kuma': 'UptimeKuma',
  'wallet-balance': 'WalletBalance',
  weather: 'Weather',
  'weather-forecast': 'WeatherForecast',
  'xkcd-comic': 'XkcdComic',
};

export default {
  name: 'Widget',
  components: {
    // Register form elements
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
      const ignoreErrors = this.widget.ignoreErrors || false;
      const label = this.widget.label || null;
      const useProxy = this.appConfig.widgetsAlwaysUseProxy || !!this.widget.useProxy;
      const updateInterval = this.widget.updateInterval !== undefined
        ? this.widget.updateInterval : null;
      return {
        timeout, ignoreErrors, label, useProxy, updateInterval, ...options,
      };
    },
    /* A unique string to reference the widget by */
    widgetRef() {
      return `widget-${this.widgetType}-${this.index}`;
    },
    hideControls() {
      return this.widget.hideControls;
    },
    component() {
      const type = COMPAT[this.widgetType] || this.widget.type;
      if (!type) {
        ErrorHandler('Widget type was not found');
        return null;
      }
      // eslint-disable-next-line prefer-template
      return () => import('@/components/Widgets/' + type + '.vue').catch(() => import('@/components/Widgets/Blank.vue'));
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
@import "@/styles/media-queries.scss";

.widget-base {
  position: relative;
  padding: 0.75rem 0.5rem 0.5rem 0.5rem;
  background: var(--widget-base-background);
  box-shadow: var(--widget-base-shadow, none);

  // Refresh and full-page action buttons
  button.action-btn {
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

  // Optional widget label
  .widget-label {
    color: var(--widget-text-color);
  }

  // Actual widget container
  .widget-wrap {
    &.has-error {
      cursor: not-allowed;
      opacity: 0.5;
      border-radius: var(--curve-factor);
      background: #ffff0040;

      &:hover { background: none; }
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
