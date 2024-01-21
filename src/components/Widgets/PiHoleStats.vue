<template>
<div class="pi-hole-stats-wrapper">
  <!-- Current Status -->
  <div v-if="status" class="status">
    <span class="status-lbl">{{ $t('widgets.pi-hole.status-heading') }}:</span>
    <span :class="`status-val ${getStatusColor(status)}`">{{ status | capitalize }}</span>
  </div>
  <!-- Block Pie Chart -->
  <p :id="chartId" class="block-pie"></p>
  <!-- More Data -->
  <div v-if="dataTable" class="data-table">
    <div class="data-table-row" v-for="(row, inx) in dataTable" :key="inx" >
      <p class="row-label">{{ row.lbl }}</p>
      <p class="row-value">{{ row.val }}</p>
    </div>
  </div>
</div>
</template>

<script>
// import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { capitalize } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  components: {},
  data() {
    return {
      status: null,
      dataTable: null,
      blockPercentChart: null,
    };
  },
  computed: {
    /* Let user select which comic to display: random, latest or a specific number */
    hostname() {
      const usersChoice = this.options.hostname;
      if (!usersChoice) this.error('You must specify the hostname for your Pi-Hole server');
      return usersChoice || 'http://pi.hole';
    },
    apiKey() {
      if (!this.options.apiKey) this.error('API Key is required, please see the docs');
      return this.options.apiKey;
    },
    endpoint() {
      return `${this.hostname}/admin/api.php?summary&auth=${this.apiKey}`;
    },
    hideStatus() { return this.options.hideStatus; },
    hideChart() { return this.options.hideChart; },
    hideInfo() { return this.options.hideInfo; },
  },
  filters: {
    capitalize(str) {
      return capitalize(str);
    },
  },
  methods: {
    /* Make GET request to local pi-hole instance */
    fetchData() {
      this.makeRequest(this.endpoint)
        .then((response) => {
          if (Array.isArray(response)) {
            this.error('Got success, but found no results, possible authorization error');
          } else {
            this.processData(response);
          }
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      if (!this.hideStatus) {
        this.status = data.status;
      }
      if (!this.hideInfo) {
        this.dataTable = [
          { lbl: 'Active Clients', val: `${data.unique_clients}/${data.clients_ever_seen}` },
          { lbl: 'Ads Blocked Today', val: data.ads_blocked_today },
          { lbl: 'DNS Queries Today', val: data.dns_queries_today },
          { lbl: 'Total DNS Queries', val: data.dns_queries_all_types },
          { lbl: 'Domains on Block List', val: data.domains_being_blocked },
        ];
      }
      if (!this.hideChart) {
        const blockedToday = Math.round(data.ads_percentage_today);
        this.generateBlockPie(blockedToday);
      }
    },
    getStatusColor(status) {
      if (status === 'enabled') return 'green';
      if (status === 'disabled') return 'red';
      else return 'blue';
    },
    /* Generate pie chart showing the proportion of queries blocked */
    generateBlockPie(blockedToday) {
      const chartData = {
        labels: ['Blocked', 'Allowed'],
        datasets: [{
          values: [blockedToday, 100 - blockedToday],
        }],
      };
      return new this.Chart(`#${this.chartId}`, {
        title: 'Block Percent',
        data: chartData,
        type: 'donut',
        height: 250,
        strokeWidth: 18,
        colors: ['#f80363', '#20e253'],
        tooltipOptions: {
          formatTooltipY: d => `${Math.round(d)}%`,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.pi-hole-stats-wrapper {
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
