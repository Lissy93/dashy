/**
 * Mixin that all pre-built and custom widgets extend from.
 * Manages loading state, error handling, data updates and user options
 */
import axios from 'axios';
import { Progress } from 'rsup-progress';
import ErrorHandler from '@/utils/ErrorHandler';
import { serviceEndpoints } from '@/utils/defaults';

const WidgetMixin = {
  props: {
    options: {
      type: Object,
      default: {},
    },
  },
  data: () => ({
    progress: new Progress({ color: 'var(--progress-bar)' }),
    overrideProxyChoice: false,
    overrideUpdateInterval: null,
    disableLoader: false, // Prevent ever showing the loader
    updater: null, // Stores interval
    defaultTimeout: 10000,
  }),
  /* When component mounted, fetch initial data */
  mounted() {
    this.fetchData();
    if (this.updateInterval) {
      this.continuousUpdates();
      this.disableLoader = true;
    }
  },
  beforeDestroy() {
    if (this.updater) {
      clearInterval(this.updater);
    }
  },
  computed: {
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
    useProxy() {
      return this.options.useProxy || this.overrideProxyChoice;
    },
    /* Returns either a number in ms to continuously update widget data. Or 0 for no updates */
    updateInterval() {
      const usersInterval = this.options.updateInterval;
      if (usersInterval === null && this.overrideUpdateInterval) {
        return this.overrideUpdateInterval * 1000;
      }
      if (!usersInterval) return 0;
      // If set to `true`, then default to 30 seconds
      if (typeof usersInterval === 'boolean') return 30 * 1000;
      // If set to a number, and within valid range, return user choice
      if (typeof usersInterval === 'number'
        && usersInterval >= 2
        && usersInterval <= 7200) {
        return usersInterval * 1000;
      }
      return 0;
    },
  },
  methods: {
    /* Re-fetches external data, called by parent. Usually overridden by widget */
    update() {
      this.startLoading();
      this.fetchData();
    },
    /* If continuous updates enabled, create interval */
    continuousUpdates() {
      this.updater = setInterval(() => { this.update(); }, this.updateInterval);
    },
    /* Called when an error occurs. Logs to handler, and passes to parent component */
    error(msg, stackTrace) {
      ErrorHandler(msg, stackTrace);
      this.$emit('error', msg);
    },
    /* When a data request update starts, show loader */
    startLoading() {
      if (!this.disableLoader) {
        this.$emit('loading', true);
        this.progress.start();
      }
    },
    /* When a data request finishes, hide loader */
    finishLoading() {
      this.$emit('loading', false);
      setTimeout(() => { this.progress.end(); }, 500);
    },
    /* Overridden by child component. Will make network request, then end loader */
    fetchData() {
      this.finishLoading();
    },
    /* Used as v-tooltip, pass text content in, and will show on hover */
    tooltip(content, html = false) {
      return {
        content, html, trigger: 'hover focus', delay: 250,
      };
    },
    /* Makes data request, returns promise */
    makeRequest(endpoint, options, protocol, body) {
      // Request Options
      const method = protocol || 'GET';
      const url = this.useProxy ? this.proxyReqEndpoint : endpoint;
      const data = JSON.stringify(body || {});
      const CustomHeaders = options || null;
      const headers = this.useProxy
        ? { 'Target-URL': endpoint, CustomHeaders: JSON.stringify(CustomHeaders) } : CustomHeaders;
      const timeout = this.options.timeout || this.defaultTimeout;
      const requestConfig = {
        method, url, headers, data, timeout,
      };
      // Make request
      return new Promise((resolve, reject) => {
        axios.request(requestConfig)
          .then((response) => {
            if (response.data.success === false) {
              this.error('Proxy returned error from target server', response.data.message);
            }
            resolve(response.data);
          })
          .catch((dataFetchError) => {
            this.error('Unable to fetch data', dataFetchError);
            reject(dataFetchError);
          })
          .finally(() => {
            this.finishLoading();
          });
      });
    },
  },
};

export default WidgetMixin;
