<template>
<div class="memory-charts-wrapper">
  <div class="chart" :id="`aggregate-${chartId}`"></div>
  <div class="chart" :id="chartId"></div>
</div>
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
      return `${this.netDataHost}/api/${this.apiVersion}/data?chart=system.ram`;
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

      // Convert data to an object for easy working
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

      // Put data in the format expected by the charts
      const averages = [];
      const datasets = [];
      Object.keys(resultGroup).forEach((label) => {
        datasets.push({ name: label, type: 'bar', values: resultGroup[label] });
        averages.push(Math.round(this.average(resultGroup[label])));
      });

      // Set results as component attributes, and call to render
      const timeChartData = { labels: timeData, datasets };
      const aggregateChartData = { labels: labels.slice(1), datasets: [{ values: averages }] };
      this.renderCharts(timeChartData, aggregateChartData);
    },
    renderCharts(timeChartData, aggregateChartData) {
      this.generateHistoryChart(timeChartData);
      this.generateAggregateChart(aggregateChartData);
    },
    /* Create new chart, using the crypto data */
    generateHistoryChart(timeChartData) {
      return new this.Chart(`#${this.chartId}`, {
        title: this.$t('widgets.net-data.mem-chart-title'),
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
          formatTooltipY: d => `${Math.round(d)}mb`,
        },
      });
    },
    generateAggregateChart(aggregateChartData) {
      return new this.Chart(`#aggregate-${this.chartId}`, {
        title: this.$t('widgets.net-data.mem-breakdown-title'),
        data: aggregateChartData,
        type: 'percentage',
        height: 100,
        colors: this.chartColors,
        barOptions: {
          height: 18,
          depth: 5,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.memory-charts-wrapper .chart {
  text.title, text.legend-dataset-text {
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
