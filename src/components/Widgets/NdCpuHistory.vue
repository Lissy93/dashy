<template>
<div class="cpu-history-chart" :id="chartId"></div>
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
      return `${this.netDataHost}/api/${this.apiVersion}/data?chart=system.cpu`;
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
    processData(inputData) {
      const { labels, data } = inputData;
      const timeData = []; // List of timestamps for axis
      const resultGroup = {}; // List of datasets, for each label
      data.reverse().forEach((reading) => {
        labels.forEach((label, indx) => {
          if (indx === 0) { // First value is the timestamp, add to axis
            timeData.push(this.formatTime(reading[indx] * 1000));
          } else { // All other values correspond to a label
            if (!resultGroup[label]) resultGroup[label] = [];
            resultGroup[label].push(reading[indx]);
          }
        });
      });
      const datasets = [];
      Object.keys(resultGroup).forEach((label) => {
        datasets.push({ name: label, type: 'bar', values: resultGroup[label] });
      });
      const timeChartData = { labels: timeData, datasets };
      const chartTitle = this.makeChartTitle(data);
      this.generateChart(timeChartData, chartTitle);
    },
    makeChartTitle(data) {
      const prefix = this.$t('widgets.net-data.cpu-chart-title');
      if (!data || !data[0][0]) return prefix;
      const diff = Math.round((data[data.length - 1][0] - data[0][0]) / 60);
      return `${prefix}: Past ${diff} minutes`;
    },
    /* Create new chart, using the crypto data */
    generateChart(timeChartData, chartTitle) {
      return new this.Chart(`#${this.chartId}`, {
        title: chartTitle,
        data: timeChartData,
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
.cpu-history-chart .chart-container {
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
