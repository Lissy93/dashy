<template>
<div class="glances-load-history-wrapper">
  <div class="gl-history-chart" :id="chartId"></div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { timestampToTime, getTimeAgo } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, GlancesMixin, ChartingMixin],
  components: {},
  data() {
    return {};
  },
  computed: {
    limit() {
      return this.options.limit || 500;
    },
    endpoint() {
      return this.makeGlancesUrl(`load/history/${this.limit}`);
    },
  },
  methods: {
    processData(loadData) {
      const labels = [];
      const min1 = [];
      const min5 = [];
      const min15 = [];
      loadData.min1.forEach((dataPoint) => {
        labels.push(timestampToTime(dataPoint[0]));
        min1.push(dataPoint[1]);
      });
      loadData.min5.forEach((dataPoint) => {
        min5.push(dataPoint[1]);
      });
      loadData.min15.forEach((dataPoint) => {
        min15.push(dataPoint[1]);
      });

      const chartTitle = this.makeTitle(loadData.min1);
      const datasets = [
        { name: '1 Minute', type: 'bar', values: min1 },
        { name: '5 Minutes', type: 'bar', values: min5 },
        { name: '15 Minutes', type: 'bar', values: min15 },
      ];
      this.generateChart({ labels, datasets }, chartTitle);
    },
    makeTitle(system) {
      return `System Load over past ${getTimeAgo(system[0][0]).replace('ago', '')}`;
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
          formatTooltipY: d => `${d} Processes`,
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
.glances-load-history-wrapper {
  .gl-history-chart {}
}
</style>
