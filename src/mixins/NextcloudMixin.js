import { serviceEndpoints } from '@/utils/defaults';
import { convertBytes, formatNumber, getTimeAgo } from '@/utils/MiscHelpers';
// //import { NcdCap } from '@/utils/ncd';

/** Reusable mixin for Nextcloud widgets */
export default {
  data() {
    return {
      capabilities: {
        notifications: null,
        activity: null,
      },
      capabilitiesLastUpdated: 0,
    };
  },
  computed: {
    hostname() {
      if (!this.options.hostname) this.error('A hostname is required');
      return this.options.hostname;
    },
    username() {
      if (!this.options.username) this.error('A username is required');
      return this.options.username;
    },
    password() {
      if (!this.options.password) this.error('An app-password is required');
      return this.options.password;
    },
    headers() {
      return {
        'OCS-APIREQUEST': true,
        Accept: 'application/json',
        Authorization: `Basic ${window.btoa(`${this.username}:${this.password}`)}`,
      };
    },
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
  },
  methods: {
    endpoint(id) {
      const endpoints = {
        capabilities: `${this.hostname}/ocs/v1.php/cloud/capabilities`,
        user: `${this.hostname}/ocs/v1.php/cloud/users/${this.username}`,
        serverinfo: `${this.hostname}/ocs/v2.php/apps/serverinfo/api/v1/info`,
      };
      return endpoints[id];
    },
    fetchCapabilities() {
      const promise = Promise.resolve();
      if ((new Date().getTime()) - this.capabilitiesLastUpdated > 3600000) {
        promise.then(() => this.makeRequest(this.endpoint('capabilities'), this.headers))
        // //promise.then(() => NcdCap)
          .then(this.processCapabilities);
      }
      return promise;
    },
    processCapabilities(data) {
      const ocdata = data?.ocs?.data;
      if (!ocdata) {
        this.error('Invalid response');
        return;
      }
      this.branding = ocdata?.capabilities?.theming;
      this.capabilities.notifications = ocdata?.capabilities?.notifications?.['ocs-endpoints'];
      this.capabilities.activity = ocdata?.capabilities?.activity?.apiv2;
      this.version.string = ocdata?.version?.string;
      this.version.edition = ocdata?.version?.edition;
      this.capabilitiesLastUpdated = new Date().getTime();
    },
    formatNumber(number) {
      return formatNumber(number);
    },
    convertBytes(bytes) {
      return convertBytes(bytes);
    },
    getTimeAgo(time) {
      return getTimeAgo(time);
    },
  },
};
