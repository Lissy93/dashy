import { serviceEndpoints } from '@/utils/defaults';
import {
  convertBytes, formatNumber, getTimeAgo, timestampToDateTime,
} from '@/utils/MiscHelpers';

/**
 * Reusable mixin for Nextcloud widgets
 * Nextcloud APIs
 *  - capabilities: https://docs.nextcloud.com/server/latest/developer_manual/client_apis/OCS/ocs-api-overview.html#capabilities-api
 *  - userstatus: https://docs.nextcloud.com/server/latest/developer_manual/client_apis/OCS/ocs-status-api.html#user-status-retrieve-statuses
 *  - user: https://docs.nextcloud.com/server/latest/developer_manual/client_apis/OCS/ocs-api-overview.html#user-metadata
 *  - notifications: https://github.com/nextcloud/notifications/blob/master/docs/ocs-endpoint-v2.md
 *  - serverinfo: https://github.com/nextcloud/serverinfo
 */
export default {
  data() {
    return {
      validCredentials: null,
      capabilities: {
        notifications: {
          enabled: null,
          features: [],
        },
        userStatus: null,
      },
      capabilitiesLastUpdated: 0,
      branding: {
        name: null,
        logo: null,
        url: null,
        slogan: null,
      },
      version: {
        string: null,
        edition: null,
      },
    };
  },
  computed: {
    /* The user provided Nextcloud hostname */
    hostname() {
      if (!this.options.hostname) this.error('A hostname is required');
      return this.options.hostname;
    },
    /* The user provided Nextcloud username */
    username() {
      if (!this.options.username) this.error('A username is required');
      return this.options.username;
    },
    /* The user provided Nextcloud password */
    password() {
      if (!this.options.password) this.error('An app-password is required');
      // reject Nextcloud user passord (enforce 'app-password')
      if (!/^([a-z0-9]{5}-){4}[a-z0-9]{5}$/i.test(this.options.password)) {
        this.error('Please use a Nextcloud app-password, not your login password.');
        return '';
      }
      return this.options.password;
    },
    /* HTTP headers for Nextcloud API requests */
    headers() {
      const authBase = `${this.username}:${this.password}`;
      return {
        'OCS-APIREQUEST': true,
        Accept: 'application/json',
        Authorization: `Basic ${window.btoa(authBase)}`,
      };
    },
    /* TTL for data delivered by the capabilities endpoint, ms */
    capabilitiesTtl() {
      return (parseInt(this.options.capabilitiesTtl, 10) || 3600) * 1000;
    },
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
  },
  methods: {
    /* Nextcloud API endpoints */
    endpoint(id) {
      switch (id) {
        case 'user':
          return `${this.hostname}/ocs/v1.php/cloud/users/${this.username}`;
        case 'userstatus':
          return `${this.hostname}/ocs/v2.php/apps/user_status/api/v1/statuses`;
        case 'serverinfo':
          return `${this.hostname}/ocs/v2.php/apps/serverinfo/api/v1/info`;
        case 'notifications':
          return `${this.hostname}/ocs/v2.php/apps/notifications/api/v2/notifications`;
        case 'capabilities':
        default:
          return `${this.hostname}/ocs/v1.php/cloud/capabilities`;
      }
    },
    /* Helper for widgets to terminate {fetchData} early */
    hasValidCredentials() {
      return this.validCredentials !== false
             && this.username.length > 0
             && this.password.length > 0;
    },
    /* Primary handler for every Nextcloud API response */
    validateResponse(response) {
      const data = response?.ocs?.data;
      let meta = response?.ocs?.meta;
      const error = response?.error; // Dashy error when cors-proxied
      if (error && error.status) {
        meta = { statuscode: error.status };
      }
      if (!meta || !meta.statuscode || !data) {
        this.error('Invalid response');
      }
      switch (meta.statuscode) {
        case 401:
          this.validCredentials = false;
          this.error(
            `Access denied for user ${this.username}.`
            + ' Note that some Nextcloud widgets only work with an admin user.',
          );
          break;
        case 429:
          this.validCredentials = false;
          this.error(
            'The server indicated \'rate-limit reached\' error (HTTP 429).'
            + ' The server-info API may return this error for incorrect user/password.',
          );
          break;
        case 993:
        case 997:
        case 998:
          this.validCredentials = false;
          this.error(
            'The provided app-password is not permitted to access the requested resource or it has'
            + ' been revoked, or the username/password combination is incorrect',
          );
          break;
        default:
          this.validCredentials = true;
          if (!this.allowedStatuscodes().includes(meta.statuscode)) {
            this.error('Unexpected response');
          }
          break;
      }
      return data;
    },
    /* Process the capabilities endpoint if {capabilitiesTtl} has expired */
    loadCapabilities() {
      if ((new Date().getTime()) - this.capabilitiesLastUpdated > this.capabilitiesTtl) {
        return this.makeRequest(this.endpoint('capabilities'), this.headers)
          .then(this.processCapabilities);
      }
      return Promise.resolve();
    },
    /* Update the sate based on the capabilites response */
    processCapabilities(capResponse) {
      const ocdata = this.validateResponse(capResponse);
      const capNotif = ocdata.capabilities?.notifications?.['ocs-endpoints'];
      this.branding = ocdata.capabilities?.theming;
      this.capabilities.notifications.enabled = !!(capNotif?.length);
      this.capabilities.notifications.features = capNotif || [];
      this.capabilities.userStatus = !!(ocdata.capabilities?.user_status?.enabled);
      this.version.string = ocdata.version?.string;
      this.version.edition = ocdata.version?.edition;
      this.capabilitiesLastUpdated = new Date().getTime();
    },
    /* Shared template helpers */
    getTimeAgo(time) {
      return getTimeAgo(time);
    },
    formatDateTime(time) {
      return timestampToDateTime(time);
    },
    /* Add additional formatting to {MiscHelpers.convertBytes()} */
    convertBytes(bytes, decimals = 2, formatHtml = true) {
      const formatted = convertBytes(bytes, decimals).toString();
      if (!formatHtml) return formatted;
      const m = formatted.match(/(-?\d+)((\.\d+)?\s(([KMGTPEZY]B|Bytes)))/);
      return `${m[1]}<span class="decimals">${m[2]}</span>`;
    },
    /* Add additional formatting to {MiscHelpers.formatNumber()} */
    formatNumber(number, decimals = 1, formatHtml = true) {
      const formatted = formatNumber(number, decimals).toString();
      if (!formatHtml) return formatted;
      const m = formatted.match(/(\d+)((\.\d+)?([KMBT]?))/);
      return `${m[1]}<span class="decimals">${m[2]}</span>`;
    },
    /* Format a number as percentage value */
    formatPercent(number, decimals = 2) {
      const n = parseFloat(number).toFixed(decimals).split('.');
      const d = n.length > 1 ? `.${n[1]}` : '';
      return `${n[0]}<span class="decimals">${d}%</span>`;
    },
    /* Similar to {MiscHelpers.getValueFromCss()} but uses the widget root node to get
     * the computed style so widget color is respected in variable widget color themes. */
    getValueFromCss(colorVar) {
      const cssProps = getComputedStyle(this.$el || document.documentElement);
      return cssProps.getPropertyValue(`--${colorVar}`).trim();
    },
    /* Get {colorVar} CSS property value and return as rgba() */
    getColorRgba(colorVar, alpha = 1) {
      const [r, g, b] = this.getValueFromCss(colorVar).match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    },
    /* Translation shorthand with key prefix */
    tt(key, options = null) {
      return this.$t(`widgets.nextcloud.${key}`, options);
    },
  },
};
