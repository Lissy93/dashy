<template>
<div class="ad-guard-top-domains-wrapper">
  <!-- List of top blocked domains -->
  <div class="sec blocked-domains" v-if="topBlockedDomains && !hideBlockedDomains">
    <h3 class="sub-title">Top Blocked Domains</h3>
    <div class="row title-row">
      <span class="cell domain">Domain</span>
      <span class="cell">Query Count</span>
    </div>
    <div class="row" v-for="(domain, ind) in topBlockedDomains" :key="ind">
      <span class="cell domain">{{ domain.name }}</span>
      <span class="cell count">{{ domain.count }}</span>
    </div>
  </div>
  <!-- List of top queried domains -->
  <div class="sec blocked-domains" v-if="topQueriedDomains && !hideQueriedDomains">
    <h3 class="sub-title">Top Queried Domains</h3>
    <div class="row title-row">
      <span class="cell domain">Domain</span>
      <span class="cell">Query Count</span>
    </div>
    <div class="row" v-for="(domain, ind) in topQueriedDomains" :key="ind">
      <span class="cell domain">{{ domain.name }}</span>
      <span class="cell count">{{ domain.count }}</span>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  computed: {
    /* URL/ IP or hostname to the AdGuardHome instance, without trailing slash */
    hostname() {
      if (!this.options.hostname) this.error('You must specify the path to your AdGuard server');
      return this.options.hostname;
    },
    authHeaders() {
      if (this.options.username && this.options.password) {
        const encoded = window.btoa(`${this.options.username}:${this.options.password}`);
        return { Authorization: `Basic ${encoded}` };
      }
      return {};
    },
    limit() {
      return this.options.limit || 10;
    },
    hideBlockedDomains() {
      return this.options.hideBlockedDomains;
    },
    hideQueriedDomains() {
      return this.options.hideQueriedDomains;
    },
    endpoint() {
      return `${this.hostname}/control/stats`;
    },
  },
  data() {
    return {
      topQueriedDomains: null,
      topBlockedDomains: null,
    };
  },
  methods: {
    /* Make GET request to AdGuard endpoint */
    fetchData() {
      this.makeRequest(this.endpoint, this.authHeaders).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.topQueriedDomains = this.makeDomainData(data.top_queried_domains);
      this.topBlockedDomains = this.makeDomainData(data.top_blocked_domains);
    },
    /* Process AdGruard's weird data format, into something that can be rendered */
    makeDomainData(rawData) {
      const domains = [];
      rawData.forEach((domainBlock) => {
        Object.keys(domainBlock).forEach((domain) => {
          domains.push({ name: domain, count: domainBlock[domain] });
        });
      });
      return domains.slice(0, this.limit);
    },
  },
};
</script>

<style lang="scss">
.ad-guard-top-domains-wrapper {
  text-align: center;
  color: var(--widget-text-color);
  .sec {
    width: 100%;
    max-width: 28rem;
    margin-right: 1rem;
    display: inline-block;
    h3.sub-title {
      text-align: left;
      font-size: 1.2rem;
      margin: 0.4rem 0 0.2rem 0;
    }
    .row {
      display: flex;
      font-size: 0.9rem;
      align-items: center;
      padding: 0.25rem 0.1rem;
      justify-content: space-between;
      color: var(--widget-text-color);
      &:not(:last-child) {
        border-bottom: 1px dashed var(--widget-text-color);
      }
      &.title-row {
        font-weight: bold;
        border-top: 1px solid var(--widget-text-color);
      }
      .cell {
        &.count {
          font-family: var(--font-monospace);
        }
      }
    }
  }
}
</style>
