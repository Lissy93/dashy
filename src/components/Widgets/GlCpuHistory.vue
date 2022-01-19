<template>
<div class="glances-cpu-history-wrapper">
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
      return this.options.limit || 100;
    },
    endpoint() {
      return this.makeGlancesUrl(`cpu/history/${this.limit}`);
    },
  },
  methods: {
    processData(cpuData) {
      const { system, user } = cpuData;
      const labels = [];
      const systemValues = [];
      const userValues = [];
      system.forEach((dataPoint) => {
        labels.push(timestampToTime(dataPoint[0]));
        systemValues.push(dataPoint[1]);
      });
      user.forEach((dataPoint) => {
        userValues.push(dataPoint[1]);
      });
      const chartTitle = this.makeTitle(system);
      const datasets = [
        { name: 'System', type: 'bar', values: systemValues },
        { name: 'User', type: 'bar', values: userValues },
      ];
      this.generateChart({ labels, datasets }, chartTitle);
    },
    makeTitle(system) {
      return `CPU Usage over past ${getTimeAgo(system[0][0]).replace('ago', '')}`;
    },
    generateChart(timeChartData, chartTitle) {
      return new this.Chart(`#${this.chartId}`, {
        title: chartTitle,
        data: timeChartData,
        type: 'axis-mixed',
        height: this.chartHeight,
        colors: ['#9b5de5', '#00f5d4'],
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
