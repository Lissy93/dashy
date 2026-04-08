<template>
<div class="pi-hole-stats-v6-wrapper">
  <!-- Current Status -->
  <div v-if="status && !hideStatus" class="status">
    <span class="status-lbl">{{ $t('widgets.pi-hole.status-heading') }}:</span>
    <span :class="`status-val ${getStatusColor(status)}`">{{ status | capitalize }}</span>
  </div>
  <!-- Block Pie Chart -->
  <p :id="chartId" class="block-pie"></p>
  <!-- More Data -->
  <div v-if="dataTable" class="data-table">
    <div class="data-table-row" v-for="(row, inx) in dataTable" :key="inx">
      <p class="row-label">{{ row.lbl }}</p>
      <p class="row-value">{{ row.val }}</p>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { capitalize } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  data() {
    return {
      status: null,
      dataTable: null,
      csrfToken: null,
      sid: null,
    };
  },
  computed: {
    /* Let user select which comic to display: random, latest or a specific number */
    hostname() {
      const usersChoice = this.parseAsEnvVar(this.options.hostname);
      if (!usersChoice) this.error('You must specify the hostname for your Pi-Hole server');
      return usersChoice;
    },
    apiKey() {
      const usersChoice = this.parseAsEnvVar(this.options.apiKey);
      if (!usersChoice) this.error('App Password is required, please see the docs');
      return usersChoice;
    },
    hideStatus() { return this.options.hideStatus; },
    hideChart() { return this.options.hideChart; },
    hideInfo() { return this.options.hideInfo; },
    authHeader() {
      return {
        'X-FTL-SID': this.sid,
        'X-FTL-CSRF': this.csrfToken,
        Accept: 'application/json',
      };
    },
    authEndpoint() {
      return `${this.hostname}/api/auth`;
    },
    blockingStatusEndpoint() {
      return `${this.hostname}/api/dns/blocking`;
    },
    /* This is actually just the stats that are currently in memory, which amounts to 24hrs when the
    service first boots up, but will drift to be a little more than 24hrs worth of data as the
    server runs. If you need accurate stats to a particular timeframe, then the
    /api/stats/database/summary endpoint is the way to go. */
    statsEndpoint() {
      return `${this.hostname}/api/stats/summary`;
    },
    statsDatabaseEndpoint() {
      return `${this.hostname}/api/stats/database/summary`;
    },
    timestampTomorrowMidnight() {
      const calcDate = new Date();
      calcDate.setHours(0, 0, 0, 0);
      calcDate.setDate(calcDate.getDate() + 1);
      return parseInt(
        String(calcDate.getTime()).substring(0, String(calcDate.getTime()).length - 3),
        10,
      );
    },
    timestamp24HoursAgo() {
      const calcDate = new Date();
      calcDate.setDate(calcDate.getDate() - 1);
      return parseInt(
        String(calcDate.getTime()).substring(0, String(calcDate.getTime()).length - 3),
        10,
      );
    },
  },
  filters: {
    capitalize,
  },
  methods: {
    fetchData() {
      this.makeRequest(
        this.authEndpoint,
        { 'Content-Type': 'application/json' },
        'POST',
        { password: this.apiKey },
      )
        .then(this.processAuthData)
        .then(
          () => {
            if (!this.sid || !this.csrfToken) return;

            Promise.all([
              this.fetchBlockingStatus(),
              this.fetchInMemoryStats(),
              this.fetchTodayStats(),
              this.fetchAllTimeStats(),
            ]).then(this.processData);
          },
        );
    },
    processAuthData({ session }) {
      if (!session) {
        this.error('Missing session info in auth response');
      } else if (session.valid !== true) {
        this.error('Authentication failed: Invalid credentials or 2FA token required');
      } else {
        const { sid, csrf } = session;
        if (!sid || !csrf) {
          this.error('No CSRF token or SID received');
        } else {
          this.sid = sid;
          this.csrfToken = csrf;
        }
      }
    },
    fetchBlockingStatus() {
      return this.makeRequest(this.blockingStatusEndpoint, this.authHeader);
    },
    fetchInMemoryStats() {
      return this.makeRequest(this.statsEndpoint, this.authHeader);
    },
    fetchTodayStats() {
      const url = new URL(this.statsDatabaseEndpoint);
      url.searchParams.append('from', this.timestamp24HoursAgo);
      // Future date because we're looking for "up to present".
      url.searchParams.append('until', this.timestampTomorrowMidnight);
      return this.makeRequest(url.toString(), this.authHeader);
    },
    fetchAllTimeStats() {
      const url = new URL(this.statsDatabaseEndpoint);
      url.searchParams.append('from', 1); // Errors out with 0.
      url.searchParams.append('until', this.timestampTomorrowMidnight);
      return this.makeRequest(url.toString(), this.authHeader);
    },
    processData([blockingStatus, inMemoryStats, todayStats, allTimeStats]) {
      if (!this.hideStatus) {
        this.status = blockingStatus.blocking || 'unknown';
      }

      if (!this.hideInfo) {
        this.dataTable = [
          {
            lbl: 'Active Clients',
            val: `${inMemoryStats.clients.active.toLocaleString('en-US')}/${allTimeStats.total_clients.toLocaleString('en-US')}`,
          },
          { lbl: 'Ads Blocked Last 24 Hours', val: todayStats.sum_blocked.toLocaleString('en-US') },
          { lbl: 'DNS Queries Last 24 Hours', val: todayStats.sum_queries.toLocaleString('en-US') },
          { lbl: 'Total DNS Queries', val: allTimeStats.sum_queries.toLocaleString('en-US') },
          {
            lbl: 'Domains on Block List',
            val: inMemoryStats.gravity.domains_being_blocked.toLocaleString('en-US'),
          },
        ];
      }

      if (!this.hideChart) {
        this.generateBlockPie(
          Math.round(todayStats.percent_blocked * 10) / 10,
        );
      }
    },
    getStatusColor(status) {
      if (status === 'enabled') return 'green';
      if (status === 'disabled') return 'red';
      return 'blue';
    },
    /* Generate pie chart showing the proportion of queries blocked */
    generateBlockPie(blockedTodayPercentage) {
      const chartData = {
        labels: ['Blocked', 'Allowed'],
        datasets: [{
          values: [blockedTodayPercentage, 100 - blockedTodayPercentage],
        }],
      };
      return new this.Chart(`#${this.chartId}`, {
        title: 'Block Percent Last 24 Hours',
        data: chartData,
        type: 'donut',
        height: 250,
        strokeWidth: 18,
        colors: ['#f80363', '#20e253'],
        tooltipOptions: {
          formatTooltipY: d => `${Math.round(d * 10) / 10}%`,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.pi-hole-stats-v6-wrapper {
  display: flex;
  flex-direction: column;
  .status {
    margin: 0.5rem 0;
    .status-lbl {
      color: var(--widget-text-color);
      font-weight: bold;
    }
    .status-val {
      margin-left: 0.5rem;
      font-family: var(--font-monospace);
      &.green { color: var(--success); }
      &.red { color: var(--danger); }
      &.blue { color: var(--info); }
    }
  }
  img.block-percent-chart {
    margin: 0.5rem auto;
    max-width: 8rem;
    width: 100%;
  }
  .block-pie {
    margin: 0;
  }
  .data-table {
    display: flex;
    flex-direction: column;
    .data-table-row {
      display: flex;
      justify-content: space-between;
      p {
        margin: 0.2rem 0;
        color: var(--widget-text-color);
        font-size: 0.9rem;
        &.row-value {
          font-family: var(--font-monospace);
        }
      }
      &:not(:last-child) {
        border-bottom: 1px dashed var(--widget-text-color);
      }
    }
  }
}
</style>
