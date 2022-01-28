<template>
<div class="load-history-chart" :id="chartId"></div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  components: {},
  computed: {
    /* URL where NetData is hosted */
    netDataHost() {
      const usersChoice = this.options.host;
      if (!usersChoice || typeof usersChoice !== 'string') {
        this.error('Host parameter is required');
        return '';
      }
      return usersChoice;
    },
    apiVersion() {
      return this.options.apiVersion || 'v1';
    },
    endpoint() {
      return `${this.netDataHost}/api/${this.apiVersion}/data?chart=system.load`;
    },
    /* A sudo-random ID for the chart DOM element */
    chartId() {
      return `cpu-history-chart-${Math.round(Math.random() * 10000)}`;
    },
  },
  methods: {
    /* Make GET request to NetData */
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const timeData = [];
      const load1min = [];
      const load5mins = [];
      const load15mins = [];
      data.data.reverse().forEach((reading) => {
        timeData.push(this.formatDate(reading[0] * 1000));
        load1min.push(reading[1]);
        load5mins.push(reading[2]);
        load15mins.push(reading[3]);
      });
      const chartData = {
        labels: timeData,
        datasets: [
          { name: '1 Min', type: 'bar', values: load1min },
          { name: '5 Mins', type: 'bar', values: load5mins },
          { name: '15 Mins', type: 'bar', values: load15mins },
        ],
      };
      const chartTitle = this.makeChartTitle(data.data);
      this.generateChart(chartData, chartTitle);
    },
    makeChartTitle(data) {
      const prefix = this.$t('widgets.net-data.load-chart-title');
      if (!data || !data[0][0]) return prefix;
      const diff = Math.round((data[data.length - 1][0] - data[0][0]) / 60);
      return `${prefix}: Past ${diff} minutes`;
    },
    /* Create new chart, using the crypto data */
    generateChart(chartData, chartTitle) {
      return new this.Chart(`#${this.chartId}`, {
        title: chartTitle,
        data: chartData,
        type: 'axis-mixed',
        height: this.chartHeight,
        colors: this.chartColors,
        truncateLegends: true,
        lineOptions: {
          regionFill: 1,
          hideDots: 1,
        },
        axisOptions: {
          xIsSeries: true,
          xAxisMode: 'tick',
        },
        tooltipOptions: {
          formatTooltipY: d => `${Math.round(d)}%`,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.load-history-chart .chart-container {
  text.title {
    text-transform: capitalize;
    color: var(--widget-text-color);
  }
  .axis, .chart-label {
    fill: var(--widget-text-color);
    opacity: var(--dimming-factor);
    &:hover { opacity: 1; }
  }
}

</style>
