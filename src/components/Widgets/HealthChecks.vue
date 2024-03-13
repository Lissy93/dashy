<template>
<div class="health-checks-wrapper" v-if="crons">
  <template
    v-for="cron in crons"
  >
    <div class="status" v-bind:key="cron.id + 'status'">
      <p :class="cron.status">{{ cron.status | formatStatus }}</p>
    </div>
    <div
      class="info"
      v-tooltip="pingTimeTooltip(cron)"
      v-bind:key="cron.id + 'info'"
    >
      <p class="cron-name">{{ cron.name }}</p>
      <p class="cron-desc">{{ cron.desc }}</p>
    </div>
  </template>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { capitalize, timestampToDateTime } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      crons: null,
    };
  },
  filters: {
    formatStatus(status) {
      let symbol = '';
      if (status === 'up') symbol = '✔';
      if (status === 'down') symbol = '✘';
      if (status === 'new') symbol = '❖';
      if (status === 'paused') symbol = '⏸';
      if (status === 'running') symbol = '▶';
      return `${symbol} ${capitalize(status)}`;
    },
    formatDate(timestamp) {
      return timestampToDateTime(timestamp);
    },
  },
  computed: {
    /* API endpoint, either for self-hosted or managed instance */
    endpoint() {
      if (this.options.host) return `${this.options.host}/api/v1/checks`;
      return `${widgetApiEndpoints.healthChecks}`;
    },
    apiKey() {
      if (!this.options.apiKey) {
        this.error('An API key is required, please see the docs for more info');
      }
      if (typeof this.options.apiKey === 'string') {
        return [this.options.apiKey];
      }
      return this.options.apiKey;
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      this.overrideProxyChoice = true;
      const results = [];
      this.apiKey.forEach((key) => {
        const authHeaders = { 'X-Api-Key': key };
        this.makeRequest(this.endpoint, authHeaders).then(
          (response) => { this.processData(response, results); },
        );
      });
      results.sort((a, b) => ((a.name > b.name) ? 1 : -1));
      this.crons = results;
    },
    /* Assign data variables to the returned data */
    processData(data, results) {
      data.checks.forEach((cron) => {
        results.push({
          id: cron.slug,
          name: cron.name,
          desc: cron.desc,
          status: cron.status,
          pingCount: cron.n_pings,
          lastPing: cron.last_ping,
          nextPing: cron.next_ping,
          url: this.makeUrl(cron.unique_key),
        });
      });
      return results;
    },
    makeUrl(cronId) {
      const base = this.options.host || 'https://healthchecks.io';
      return `${base}/checks/${cronId}/details`;
    },
    pingTimeTooltip(cron) {
      const { lastPing, nextPing, pingCount } = cron;
      const content = `<b>Total number of Pings:</b> ${pingCount}<br>`
        + `<b>Last Ping:</b> ${timestampToDateTime(lastPing)}<br>`
        + `<b>Next Ping:</b>${timestampToDateTime(nextPing)}`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'ping-times-tt',
      };
    },
  },
};
</script>

<style scoped lang="scss">
.health-checks-wrapper {
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 2fr;
  color: var(--widget-text-color);
  padding: 0.25rem 0;
  .status {
    min-width: 5rem;
    font-size: 1.2rem;
    font-weight: bold;
    p {
      margin: 0;
      color: var(--info);
      &.up { color: var(--success); }
      &.down { color: var(--danger); }
      &.new { color: var(--widget-text-color); }
      &.running { color: var(--warning); }
      &.paused { color: var(--info); }
    }
  }
  .info {
    p.cron-name {
      margin: 0.25rem 0;
      font-weight: bold;
      color: var(--widget-text-color);
    }
    p.cron-desc {
      margin: 0;
      color: var(--widget-text-color);
      opacity: var(--dimming-factor);
    }
  }
  &:not(:last-child) {
    border-bottom: 1px dashed var(--widget-text-color);
  }
}

</style>

<style lang="scss">
.ping-times-tt {
  min-width: 20rem;
}
</style>
