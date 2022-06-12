import { serviceEndpoints } from '@/utils/defaults';
import { convertBytes, formatNumber, getTimeAgo } from '@/utils/MiscHelpers';
// //import { NcdCap, NcdUsr } from '@/utils/ncd';

/** Reusable mixin for Nextcloud widgets */
export default {
  data() {
    return {
      capabilities: {
        notifications: null,
        activity: null,
      },
      capabilitiesLastUpdated: 0,
      user: {
        id: null,
        isAdmin: false,
        displayName: null,
        email: null,
        quota: {
          relative: null,
          total: null,
          used: null,
          free: null,
          quota: null,
        },
      },
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
      if (!/^([a-z0-9]{5}-){4}[a-z0-9]{5}$/i.test(this.options.password)) {
        this.error('Please use an app-password for this widget, not your login password.');
      }
      return this.options.password;
    },
    headers() {
      return {
        'OCS-APIREQUEST': true,
        Accept: 'application/json',
        Authorization: `Basic ${window.btoa(`${this.username}:${this.password}`)}`,
      };
    },
    capabilitiesTtl() {
      return (parseInt(this.options.capabilitiesTtl, 10) || 3600) * 1000;
    },
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
  },
  methods: {
    endpoint(id) {
      switch (id) {
        case 'capabilities':
        default:
          return `${this.hostname}/ocs/v1.php/cloud/capabilities`;
        case 'user':
          return `${this.hostname}/ocs/v1.php/cloud/users/${this.username}`;
        case 'serverinfo':
          return `${this.hostname}/ocs/v2.php/apps/serverinfo/api/v1/info`;
      }
    },
    loadCapabilities() {
      if ((new Date().getTime()) - this.capabilitiesLastUpdated > this.capabilitiesTtl) {
        return this.makeRequest(this.endpoint('capabilities'), this.headers)
        // //return Promise.resolve(NcdCap)
          .then(this.processCapabilities);
      }
      return Promise.resolve();
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
    loadUser() {
      return this.makeRequest(this.endpoint('user'), this.headers).then(this.processUser);
      // //return Promise.resolve(NcdUsr).then(this.processUser);
    },
    processUser(userData) {
      const user = userData?.ocs?.data;
      if (!user) {
        this.error('Invalid response');
        return;
      }
      this.user.id = user.id;
      this.user.email = user.email;
      this.user.quota = user.quota;
      this.user.displayName = user.displayname;
      this.user.lastLogin = user.lastLogin;
      this.user.isAdmin = user.groups && user.groups.includes('admin');
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
