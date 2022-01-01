/**
 * Mixin that all pre-built and custom widgets extend from.
 * Manages loading state, error handling, data updates and user options
 */
import axios from 'axios';
import ProgressBar from 'rsup-progress';
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
    progress: new ProgressBar({ color: 'var(--progress-bar)' }),
    overrideProxyChoice: false,
  }),
  /* When component mounted, fetch initial data */
  mounted() {
    this.fetchData();
  },
  computed: {
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
    useProxy() {
      return this.options.useProxy || this.overrideProxyChoice;
    },
  },
  methods: {
    /* Re-fetches external data, called by parent. Usually overridden by widget */
    update() {
      this.startLoading();
      this.fetchData();
    },
    /* Called when an error occurs. Logs to handler, and passes to parent component */
    error(msg, stackTrace) {
      ErrorHandler(msg, stackTrace);
      this.$emit('error', msg);
    },
    /* When a data request update starts, show loader */
    startLoading() {
      this.$emit('loading', true);
      this.progress.start();
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
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
    },
    /* Makes data request, returns promise */
    makeRequest(endpoint, options) {
      // Request Options
      const method = 'GET';
      const url = this.useProxy ? this.proxyReqEndpoint : endpoint;
      const CustomHeaders = options ? JSON.stringify(options) : null;
      const headers = this.useProxy
        ? { 'Target-URL': endpoint, CustomHeaders } : CustomHeaders;
      // Make request
      return new Promise((resolve, reject) => {
        axios.request({ method, url, headers })
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
