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
      <div class="error-header">
        <span :class="`error-type-badge ${getErrorBadgeClass(parsedError?.type)}`">
          {{ getErrorTypeLabel(parsedError?.type) }}
        </span>
      </div>
      <p class="error-msg" v-if="!parsedError?.details?.suggestUseProxy">
        {{ getMainErrorMessage() }}
      </p>
      <div v-else class="error-with-suggestion">
        <p class="error-msg">{{ getMainErrorMessage() }}</p>
        <p class="suggestion">
          💡 <strong>Suggestion:</strong> Try enabling <code>useProxy: true</code> in your widget configuration.
        </p>
      </div>
      <div class="error-details" v-if="showErrorDetails">
        <p class="error-detail-title">Error Details:</p>
        <pre class="error-detail-content">{{ getErrorDetails() }}</pre>
        <button class="toggle-details-btn" @click="toggleErrorDetails">
          {{ showErrorDetails ? 'Hide Details' : 'Show Details' }}
        </button>
      </div>
      <div v-else class="error-details-collapsed">
        <button class="toggle-details-btn" @click="toggleErrorDetails">
          Show Details
        </button>
      </div>
      <p class="retry-link" @click="update">
        <span class="retry-icon">↻</span> Retry
      </p>
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
  anonaddy: 'addy.io',
  apod: 'Apod',
  'blacklist-check': 'BlacklistCheck',
  chucknorris: 'ChuckNorris',
  clock: 'Clock',
  'code-stats': 'CodeStats',
  'covid-stats': 'CovidStats',
  'crypto-price-chart': 'CryptoPriceChart',
  'crypto-watch-list': 'CryptoWatchList',
  'custom-search': 'CustomSearch',
  'custom-list': 'CustomList',
  'cve-vulnerabilities': 'CveVulnerabilities',
  'domain-monitor': 'DomainMonitor',
  'drone-ci': 'DroneCi',
  embed: 'EmbedWidget',
  'eth-gas-prices': 'EthGasPrices',
  'exchange-rates': 'ExchangeRates',
  filebrowser: 'Filebrowser',
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
  'gl-uptime': 'GlancesUptime',
  'gl-cpu-temp': 'GlCpuTemp',
  'gluetun-status': 'GluetunStatus',
  'health-checks': 'HealthChecks',
  'hackernews-trending': 'HackernewsTrending',
  iframe: 'IframeWidget',
  image: 'ImageWidget',
  joke: 'Jokes',
  linkding: 'Linkding',
  'minecraft-status': 'MinecraftStatus',
  'mullvad-status': 'MullvadStatus',
  mvg: 'Mvg',
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
  'pi-hole-stats-v6': 'PiHoleStatsV6',
  'pi-hole-top-queries': 'PiHoleTopQueries',
  'pi-hole-top-queries-v6': 'PiHoleTopQueriesV6',
  'pi-hole-traffic': 'PiHoleTraffic',
  'pi-hole-traffic-v6': 'PiHoleTrafficV6',
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
  trmm: 'TacticalRMM',
  'uptime-kuma': 'UptimeKuma',
  'uptime-kuma-status-page': 'UptimeKumaStatusPage',
  'wallet-balance': 'WalletBalance',
  weather: 'Weather',
  'weather-forecast': 'WeatherForecast',
  'xkcd-comic': 'XkcdComic',
  'gl-compact-metrics': 'GlCompactMetrics',
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
    parsedError: null,
    showErrorDetails: false,
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
      this.showErrorDetails = false;
      this.$refs[this.widgetRef].update();
    },
    /* Shows message when error occurred */
    handleError(msg) {
      this.error = true;
      this.errorMsg = msg;
      this.showErrorDetails = false;
      if (typeof msg === 'object' && msg !== null) {
        this.parsedError = msg;
      } else {
        this.parsedError = { message: msg, type: 'UNKNOWN_ERROR' };
      }
    },
    /* Get user-friendly error type label */
    getErrorTypeLabel(type) {
      if (!type) return 'Error';
      
      const typeLabels = {
        'NETWORK_ERROR': 'Network Error',
        'HTTP_ERROR': 'HTTP Error',
        'HTTP_400': 'Bad Request',
        'HTTP_401': 'Unauthorized',
        'HTTP_403': 'Forbidden',
        'HTTP_404': 'Not Found',
        'HTTP_429': 'Rate Limited',
        'HTTP_500': 'Server Error',
        'HTTP_502': 'Bad Gateway',
        'HTTP_503': 'Service Unavailable',
        'TIMEOUT_ERROR': 'Timeout',
        'CORS_ERROR': 'CORS Error',
        'JSON_PARSE_ERROR': 'JSON Parse Error',
        'EMPTY_DATA': 'Empty Data',
        'PROXY_ERROR': 'Proxy Error',
        'TARGET_ERROR': 'Target Error',
        'UNKNOWN_ERROR': 'Unknown Error',
      };
      
      return typeLabels[type] || typeLabels[type.split('_').slice(0, -1).join('_')] || type;
    },
    /* Get CSS class for error badge based on type */
    getErrorBadgeClass(type) {
      if (!type) return 'badge-error';
      
      if (type.startsWith('HTTP_')) {
        const status = parseInt(type.split('_')[1] || 0);
        if (status === 401 || status === 403) return 'badge-auth';
        if (status === 404) return 'badge-not-found';
        if (status === 429) return 'badge-rate-limit';
        if (status >= 500) return 'badge-server';
        return 'badge-http';
      }
      
      const badgeClasses = {
        'NETWORK_ERROR': 'badge-network',
        'TIMEOUT_ERROR': 'badge-timeout',
        'CORS_ERROR': 'badge-cors',
        'JSON_PARSE_ERROR': 'badge-parse',
        'EMPTY_DATA': 'badge-empty',
        'PROXY_ERROR': 'badge-proxy',
        'TARGET_ERROR': 'badge-target',
      };
      
      return badgeClasses[type] || 'badge-error';
    },
    /* Get main error message to display */
    getMainErrorMessage() {
      if (this.parsedError && this.parsedError.message) {
        return this.parsedError.message;
      }
      if (typeof this.errorMsg === 'string') {
        return this.errorMsg;
      }
      return 'An error occurred. Click "Show Details" for more information.';
    },
    /* Get formatted error details */
    getErrorDetails() {
      if (!this.parsedError) {
        return typeof this.errorMsg === 'string' 
          ? this.errorMsg 
          : JSON.stringify(this.errorMsg, null, 2);
      }
      
      const details = {
        type: this.parsedError.type,
        message: this.parsedError.message,
        ...this.parsedError.details,
      };
      
      if (this.parsedError.rawError) {
        details.rawErrorSummary = this.safeStringify(this.parsedError.rawError);
      }
      
      return JSON.stringify(details, null, 2);
    },
    /* Safely stringify objects that might have circular references */
    safeStringify(obj) {
      try {
        return JSON.stringify(obj, null, 2);
      } catch (e) {
        try {
          const simpleObj = {};
          Object.keys(obj).forEach(key => {
            const val = obj[key];
            if (typeof val !== 'object' || val === null) {
              simpleObj[key] = val;
            } else if (Array.isArray(val)) {
              simpleObj[key] = `[Array (${val.length} items)]`;
            } else {
              simpleObj[key] = `[Object]`;
            }
          });
          return JSON.stringify(simpleObj, null, 2);
        } catch (e2) {
          return String(obj);
        }
      }
    },
    /* Toggle error details visibility */
    toggleErrorDetails() {
      this.showErrorDetails = !this.showErrorDetails;
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
    text-align: left;
    
    .error-header {
      margin-bottom: 0.5rem;
    }
    
    .error-type-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      &.badge-network {
        background: #ff6b6b;
        color: white;
      }
      
      &.badge-http, &.badge-error {
        background: #ffa502;
        color: white;
      }
      
      &.badge-auth {
        background: #ff4757;
        color: white;
      }
      
      &.badge-not-found {
        background: #747d8c;
        color: white;
      }
      
      &.badge-rate-limit {
        background: #ffa502;
        color: white;
      }
      
      &.badge-server {
        background: #ff4757;
        color: white;
      }
      
      &.badge-timeout {
        background: #ffa502;
        color: white;
      }
      
      &.badge-cors {
        background: #9b59b6;
        color: white;
      }
      
      &.badge-parse {
        background: #e74c3c;
        color: white;
      }
      
      &.badge-empty {
        background: #95a5a6;
        color: white;
      }
      
      &.badge-proxy {
        background: #3498db;
        color: white;
      }
      
      &.badge-target {
        background: #e67e22;
        color: white;
      }
    }
    
    p.error-msg {
      color: var(--widget-text-color);
      font-weight: 500;
      font-size: 0.9rem;
      margin: 0.5rem 0;
      line-height: 1.4;
    }
    
    .error-with-suggestion {
      margin: 0.5rem 0;
      
      .suggestion {
        background: rgba(52, 152, 219, 0.1);
        border-left: 3px solid #3498db;
        padding: 0.5rem;
        margin: 0.5rem 0;
        font-size: 0.8rem;
        color: var(--widget-text-color);
        
        code {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          font-family: var(--font-monospace);
        }
      }
    }
    
    .error-details {
      margin: 0.75rem 0;
      
      .error-detail-title {
        font-size: 0.75rem;
        font-weight: bold;
        color: var(--widget-text-color);
        opacity: 0.8;
        margin-bottom: 0.25rem;
      }
      
      .error-detail-content {
        background: rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
        border-radius: 4px;
        font-family: var(--font-monospace);
        font-size: 0.7rem;
        color: var(--widget-text-color);
        white-space: pre-wrap;
        word-break: break-all;
        max-height: 200px;
        overflow-y: auto;
        margin: 0.25rem 0;
      }
    }
    
    .error-details-collapsed {
      margin: 0.5rem 0;
    }
    
    .toggle-details-btn {
      background: none;
      border: 1px solid rgba(128, 128, 128, 0.3);
      color: var(--widget-text-color);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      cursor: pointer;
      opacity: 0.8;
      
      &:hover {
        opacity: 1;
        background: rgba(128, 128, 128, 0.1);
      }
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
      margin: 0.5rem 0 0 0;
      
      .retry-icon {
        margin-right: 0.25rem;
      }
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
