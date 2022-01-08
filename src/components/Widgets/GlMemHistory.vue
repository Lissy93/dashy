<template>
<div class="glances-cpu-history-wrapper">
  <div class="gl-history-chart" :id="chartId"></div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { timestampToTime, getTimeAgo } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  components: {},
  data() {
    return {};
  },
  computed: {
    hostname() {
      if (!this.options.hostname) this.error('You must specify a \'hostname\' for Glaces');
      return this.options.hostname;
    },
    limit() {
      return this.options.limit || 100;
    },
    endpoint() {
      return `${this.hostname}/api/3/mem/history/${this.limit}`;
    },
  },
  methods: {
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    processData(memData) {
      const readings = memData.percent;
      const labels = [];
      const systemValues = [];
      readings.forEach((dataPoint) => {
        labels.push(timestampToTime(dataPoint[0]));
        systemValues.push(dataPoint[1]);
      });

      const chartTitle = this.makeTitle(readings);
      const datasets = [
        { name: 'Memory', type: 'bar', values: systemValues },
      ];
      this.generateChart({ labels, datasets }, chartTitle);
    },
    makeTitle(system) {
      return `Memory Usage over past ${getTimeAgo(system[0][0]).replace('ago', '')}`;
    },
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
          // formatTooltipX: d => timestampToTime(d),
        },
      });
    },

  },
  created() {
    this.overrideUpdateInterval = 20;
  },
};
</script>

<style scoped lang="scss">
.glances-cpu-history-wrapper {
  .gl-history-chart {}
}
</style>
