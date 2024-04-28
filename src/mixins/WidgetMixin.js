/**
 * Mixin that all pre-built and custom widgets extend from.
 * Manages loading state, error handling, data updates and user options
 */
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
    defaultTimeout: 50000,
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
      if (!this.options.ignoreErrors) {
        this.$emit('error', msg);
      }
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

      const CustomHeaders = options || {};
      const headers = new Headers();

      // If using a proxy, set the 'Target-URL' header
      if (this.useProxy) {
        headers.append('Target-URL', endpoint);
      }
      // Apply widget-specific custom headers
      Object.entries(CustomHeaders).forEach(([key, value]) => {
        headers.append(key, value);
      });

      // If the request is a GET, delete the body
      const bodyContent = method.toUpperCase() === 'GET' ? undefined : data;

      const timeout = this.options.timeout || this.defaultTimeout;

      // Setup Fetch request configuration
      const requestConfig = {
        method,
        headers,
        body: bodyContent,
        signal: undefined, // This will be set below
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      requestConfig.signal = controller.signal;

      // Make request using Fetch API
      return new Promise((resolve, reject) => {
        fetch(url, requestConfig)
          .then(async response => {
            const responseData = await response.json();
            if (responseData.error) {
              this.error('Proxy returned error from target server', responseData.error?.message);
            }
            if (responseData.success === false) {
              this.error('Proxy didn\'t return success from target server', responseData.message);
            }
            resolve(responseData);
          })
          .catch(error => {
            if (error.name === 'AbortError') {
              this.error('Request timed out', error);
            } else {
              this.error('Unable to fetch data', error);
            }
            reject(error);
          })
          .finally(() => {
            clearTimeout(timeoutId);
            this.finishLoading();
          });
      });
    },
    /* Check if a value is an environment variable, return its value if so. */
    parseAsEnvVar(str) {
      if (typeof str !== 'string') return str;
      if (str.includes('VUE_APP_')) {
        const envVar = process.env[str];
        if (!envVar) {
          this.error(`Environment variable ${str} not found`);
        } else {
          return envVar;
        }
      }
      return str;
    },
  },
};

export default WidgetMixin;
