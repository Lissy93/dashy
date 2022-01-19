<template>
<div class="glances-cpu-cores-wrapper">
  <div class="percentage-charts" v-for="(chartData, index) in cpuChartData" :key="index">
    <PercentageChart :values="chartData" :title="`Core #${index + 1}`" />
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';
import { capitalize } from '@/utils/MiscHelpers';
import PercentageChart from '@/components/Charts/PercentageChart';

export default {
  mixins: [WidgetMixin, GlancesMixin],
  components: {
    PercentageChart,
  },
  data() {
    return {
      cpuChartData: null,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('quicklook');
    },
  },
  created() {
    // Enable automatic updates (won't be applied if user has explicitly disabled)
    this.overrideUpdateInterval = 2;
  },
  methods: {
    /* Converts returned data into format for the percentage charts */
    processData(cpuData) {
      const cpuSections = [];
      cpuData.percpu.forEach((cpuInfo) => {
        const cpuSection = [];
        const ignore = ['total', 'key', 'cpu_number', 'idle'];
        cpuSection.push({ label: 'Idle', size: cpuInfo.idle, color: '#20e253' });
        Object.keys(cpuInfo).forEach((keyName) => {
          if (!ignore.includes(keyName) && cpuInfo[keyName]) {
            cpuSection.push({ label: capitalize(keyName), size: cpuInfo[keyName] });
          }
        });
        cpuSections.push(cpuSection);
      });
      this.cpuChartData = cpuSections;
    },
  },
};
</script>

<style scoped lang="scss">
.glances-cpu-cores-wrapper {
  color: var(--widget-text-color);
  .percentage-charts:not(:last-child) {
    border-bottom: 1px dashed var(--widget-accent-color);
  }
}
</style>
