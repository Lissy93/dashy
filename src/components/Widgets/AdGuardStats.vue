<template>
<div class="ad-guard-stats-wrapper">
  <!-- Show total query and block count -->
  <div v-if="queryCount && blockCount" class="summary">
    <div><span class="lbl">Queries:</span><span class="val">{{ queryCount }}</span></div>
    <div><span class="lbl">Blocked:</span><span class="val">{{ blockCount }}</span></div>
  </div>
  <!-- Pie chart with block breakdown -->
  <p :id="chartId" class="block-pie"></p>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  computed: {
    /* URL/ IP or hostname to the AdGuardHome instance, without trailing slash */
    hostname() {
      if (!this.options.hostname) this.error('You must specify the path to your AdGuard server');
      return this.options.hostname;
    },
    endpoint() {
      return `${this.hostname}/control/stats`;
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
      queryCount: null,
      blockCount: null,
    };
  },
  methods: {
    /* Make GET request to AdGuard endpoint */
    fetchData() {
      this.makeRequest(this.endpoint, this.authHeaders).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(data) {
      // Get data from response, to be rendered to the chart
      const totalAllowed = data.num_dns_queries || 0;
      const blocked = data.num_blocked_filtering || 0;
      const safeBrowsing = data.num_replaced_safebrowsing || 0;
      const safeSearch = data.num_replaced_safesearch || 0;
      const parental = data.num_replaced_parental || 0;
      const blockTotal = blocked + safeBrowsing + safeSearch + parental;
      const remaining = totalAllowed - blockTotal;

      // Set query and block count, for first line
      this.queryCount = totalAllowed;
      this.blockCount = blockTotal;

      // Put data into a flat array for the chart
      const chartColors = ['#ef476f', '#06d6a0'];
      const chartValues = [blocked, remaining];
      const chartLabels = ['Blocked', 'Allowed'];

      // If additional blocked results are non-zero, append to chart data
      if (safeBrowsing > 0) {
        chartColors.push('#ffc43d');
        chartValues.push(safeBrowsing);
        chartLabels.push('Safe Search - Blocked');
      }
      if (safeSearch > 0) {
        chartColors.push('#f8ffe5');
        chartValues.push(safeSearch);
        chartLabels.push('Safe Search - Blocked');
      }
      if (parental > 0) {
        chartColors.push('#1b9aaa');
        chartValues.push(parental);
        chartLabels.push('Parental Controls - Blocked');
      }

      // Call generate chart function
      this.generateBlockPie(chartLabels, chartValues, chartColors);
    },
    /* Generate pie chart showing the proportion of queries blocked */
    generateBlockPie(labels, values, colors) {
      return new this.Chart(`#${this.chartId}`, {
        title: 'AdGuard DNS Queries',
        data: {
          labels,
          datasets: [{ values }],
        },
        type: 'donut',
        height: 250,
        strokeWidth: 20,
        colors,
        tooltipOptions: {
          formatTooltipY: d => `${Math.round(d)} queries`,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.ad-guard-stats-wrapper {
  .block-pie {
    margin: 0;
    svg.frappe-chart.chart {
      overflow: visible;
    }
  }
  .summary {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    color: var(--widget-text-color);
    span.lbl {
      font-weight: bold;
      margin: 0.25rem;
    }
    span.val {
      font-family: var(--font-monospace);
    }
  }
}
</style>
