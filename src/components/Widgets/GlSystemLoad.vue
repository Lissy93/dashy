<template>
<div class="glances-load-wrapper">
  <div
    :id="`load-${chartId}`" class="load-chart"
    v-tooltip="$t('widgets.glances.system-load-desc')"></div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';
import ChartingMixin from '@/mixins/ChartingMixin';

export default {
  mixins: [WidgetMixin, GlancesMixin, ChartingMixin],
  computed: {
    endpoint() {
      return this.makeGlancesUrl('load');
    },
  },
  methods: {
    processData(loadData) {
      const chartData = {
        labels: ['1 Min', '5 Mins', '15 Mins'],
        datasets: [
          { values: [loadData.min1, loadData.min5, loadData.min15] },
        ],
      };
      const chartTitle = `Load Averages over ${loadData.cpucore} Cores`;
      this.renderChart(chartData, chartTitle);
    },
    renderChart(loadBarChartData, chartTitle) {
      return new this.Chart(`#load-${this.chartId}`, {
        title: chartTitle,
        data: loadBarChartData,
        type: 'bar',
        height: 180,
        colors: ['#04e4f4'],
        barOptions: {
          spaceRatio: 0.2,
        },
        tooltipOptions: {
          formatTooltipY: d => `${d} Tasks`,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.glances-load-wrapper {
  p.desc {
    color: var(--widget-text-color);
    opacity: var(--dimming-factor);
    font-size: 0.8rem;
    margin: 0;
    visibility: hidden;
  }
  &:hover p.desc { visibility: visible; }
}
</style>
