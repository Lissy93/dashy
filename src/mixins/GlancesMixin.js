/** Reusable mixin for all Glances widgets */
export default {
  computed: {
    /* Required, hostname (e.g. IP + port) for Glances instance */
    hostname() {
      if (!this.options.hostname) this.error('You must specify a \'hostname\' for Glances');
      return this.options.hostname;
    },
    /* Optionally specify the API version, defaults to V 3 */
    apiVersion() {
      return this.options.apiVersion || 3;
    },
    /* Optionally specify basic auth credentials for Glances instance */
    credentials() {
      if (this.options.username && this.options.password) {
        const stringifiedUser = `${this.options.username}:${this.options.password}`;
        return { Authorization: `Basic ${window.btoa(stringifiedUser)}` };
      }
      return null;
    },
  },
  methods: {
    /* Make the request to Glances API, and calls handler function with results
    * Requires endpoint attribute and processData method to be implemented by child */
    fetchData() {
      this.makeRequest(this.endpoint, this.credentials).then(this.processData);
    },
    /* Returns URL to Glances API endpoint */
    makeGlancesUrl(apiPath) {
      return `${this.hostname}/api/${this.apiVersion}/${apiPath}`;
    },
  },
};
