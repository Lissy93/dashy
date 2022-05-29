<template>
<div class="ad-guard-dns-info-wrapper">
  <div class="enable-status" v-if="enabled !== null">
    <p v-if="enabled"  class="status connected"><span>✔</span> Enabled</p>
    <p v-else class="status not-connected"><span>✘</span> Disabled</p>
  </div>
  <p @click="toggleShowData" v-if="dnsInfo.length > 0" class="expend-details-btn">
    {{ showData ? $t('widgets.general.show-less') : $t('widgets.general.show-more') }}
  </p>
  <div v-if="showData && dnsInfo.length > 0" class="dns-info">
    <div v-for="(item, index) in dnsInfo" :key="index" class="row">
      <span class="lbl">{{ item.lbl }}: </span>
      <span class="val">{{ item.val | renderVal }}</span>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { capitalize } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  computed: {
    /* URL/ IP or hostname to the AdGuardHome instance, without trailing slash */
    hostname() {
      if (!this.options.hostname) this.error('You must specify the path to your AdGuard server');
      return this.options.hostname;
    },
    showFullInfo() {
      return this.options.showFullInfo;
    },
    endpoint() {
      return `${this.hostname}/control/dns_info`;
    },
    basicInoEndpoint() {
      return `${this.hostname}/control/status`;
    },
    authHeaders() {
      if (this.options.username && this.options.password) {
        const encoded = window.btoa(`${this.options.username}:${this.options.password}`);
        return { Authorization: `Basic ${encoded}` };
      }
      return {};
    },
  },
  data() {
    return {
      enabled: null,
      dnsInfo: [],
      showData: false,
    };
  },
  filters: {
    renderVal(val) {
      if (val === undefined) return 'N/A';
      if (Array.isArray(val) && val.length === 0) return 'N/A';
      if (typeof val === 'boolean') return val ? '✔' : '✘';
      if (typeof val === 'string') return capitalize(val);
      if (Array.isArray(val)) return val.join('\n');
      return val;
    },
  },
  methods: {
    /* Make GET request to AdGuard endpoint */
    fetchData() {
      this.makeRequest(this.basicInoEndpoint, this.authHeaders).then(this.processStatusBasics);
      this.makeRequest(this.endpoint, this.authHeaders).then(this.processData);
    },
    processStatusBasics(data) {
      const newInfo = [
        { lbl: 'DNS Address', val: data.dns_addresses },
        { lbl: 'DNS Port', val: data.dns_port },
        { lbl: 'HTTP Port', val: data.http_port },
      ];
      this.dnsInfo = [...this.dnsInfo, ...newInfo];
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.enabled = data.protection_enabled;
      const newInfo = [
        { lbl: 'Blocking Mode', val: data.blocking_mode },
        { lbl: 'Cache Size', val: `${data.cache_size} B` },
        { lbl: 'IPv6', val: !data.disable_ipv6 },
        { lbl: 'DNSSEC', val: data.dnssec_enabled },
        { lbl: 'EDNS Client-Subnet', val: data.edns_cs_enabled },
        { lbl: 'Private PTR', val: data.use_private_ptr_resolvers },
        { lbl: 'Upstream DNS', val: data.upstream_dns },
        { lbl: 'PRT Upstream', val: data.local_ptr_upstreams },
        { lbl: 'Bootstrap DNS', val: data.bootstrap_dns },
      ];
      this.dnsInfo = [...this.dnsInfo, ...newInfo];
    },
    toggleShowData() {
      this.showData = !this.showData;
    },
  },
  mounted() {
    if (this.showFullInfo) this.showData = true;
  },
};
</script>

<style lang="scss">
.ad-guard-dns-info-wrapper {
  color: var(--widget-text-color);
  .enable-status {
      .status {
        display: flex;
        max-width: 250px;
        font-size: 1.5rem;
        font-weight: bold;
        align-items: center;
        margin: 0.25rem auto;
        justify-content: space-evenly;
        span {
          font-size: 1.5rem;
          border-radius: 1.5rem;
          padding: 0.3rem 0.7rem;
          border: 1px solid;
          color: var(--background);
        }
        &.not-connected {
          color: var(--danger);
          span { background: var(--danger); }
        }
        &.connected {
          color: var(--success);
          span { background: var(--success); }
        }
      }
  }

  p.expend-details-btn {
    cursor: pointer;
    text-align: center;
    margin: 0;
    font-size: 0.9rem;
    padding: 0.1rem 0.25rem;
    border: 1px solid transparent;
    color: var(--widget-text-color);
    opacity: var(--dimming-factor);
    border-radius: var(--curve-factor);
    &:hover {
      text-decoration: underline;
    }
    &:focus, &:active {
      background: var(--widget-text-color);
      color: var(--widget-background-color);
    }
  }
}

.dns-info {
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem 0.1rem;
    font-size: 0.9rem;
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
    .val {
      max-width: 80%;
      overflow: hidden;
      white-space: pre;
      text-overflow: ellipsis;
      font-family: var(--font-monospace);
    }
  }
}
</style>
