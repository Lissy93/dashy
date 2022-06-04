<template>
<div class="health-checks-wrapper" v-if="crons">
  <div
    class="cron-row"
    v-for="cron in crons" :key="cron.id"
    v-tooltip="pingTimeTooltip(cron)"
  >
    <div class="status">
      <p :class="cron.status">{{ cron.status | formatStatus }}</p>
    </div>
    <div class="info">
      <p class="cron-name">{{ cron.name }}</p>
      <p class="cron-desc">{{ cron.desc }}</p>
    </div>
  </div>
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
      return this.options.apiKey;
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      this.overrideProxyChoice = true;
      const authHeaders = { 'X-Api-Key': this.apiKey };
      this.makeRequest(this.endpoint, authHeaders).then(
        (response) => { this.processData(response); },
      );
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const results = [];
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
      this.crons = results;
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
  color: var(--widget-text-color);
  .cron-row {
    display: flex;
    justify-content: center;
    align-items: center;
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
        &.new { color: var(--neutral); }
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
}

</style>

<style lang="scss">
.ping-times-tt {
  min-width: 20rem;
}
</style>
