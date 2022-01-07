<template>
<div class="glances-cpu-cores-wrapper">
  <div class="percentage-charts" v-for="(chartData, index) in cpuChartData" :key="index">
    <PercentageChart :values="chartData" />
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { capitalize } from '@/utils/MiscHelpers';
import PercentageChart from '@/components/Charts/PercentageChart';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  components: {
    PercentageChart,
  },
  data() {
    return {
      cpuChartData: null,
    };
  },
  computed: {
    hostname() {
      if (!this.options.hostname) this.error('You must specify a \'hostname\' for Glaces');
      return this.options.hostname;
    },
    endpoint() {
      return `${this.hostname}/api/3/quicklook`;
    },
  },
  methods: {
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    processData(cpuData) {
      const results = [];
      cpuData.percpu.forEach((cpuInfo) => {
        const cpuSection = [];
        const ignore = ['total', 'key', 'cpu_number'];
        Object.keys(cpuInfo).forEach((keyName) => {
          if (!ignore.includes(keyName) && cpuInfo[keyName]) {
            cpuSection.push({
              label: capitalize(keyName),
              size: cpuInfo[keyName],
              color: keyName === 'idle' ? '#20e253' : null,
            });
          }
        });
        results.push(cpuSection.reverse());
      });
      this.cpuChartData = results;
    },
    generateCpuChart(cpuData) {
      // [
      //   { size: 15, label: 'Hello' },
      //   { size: 12, label: 'World' },
      //   { size: 10 },
      //   { size: 10 },
      //   { size: 10 },
      //   { size: 10 },
      //   { size: 5 },
      //   { size: 5 },
      //   { size: 5 },
      // ]
      const newElement = document.createElement('div');
      const parentContainer = document.getElementById(this.chartId);
      parentContainer.appendChild(newElement);
      const colors = Array(cpuData.labels.length - 1).fill('#f80363');
      colors.push('#20e253');
      return new this.Chart(newElement, {
        title: 'CPU',
        data: cpuData,
        type: 'percentage',
        height: 150,
        colors,
        barOptions: {
          height: 18,
          depth: 4,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.glances-cpu-cores-wrapper {
  color: var(--widget-text-color);
}
</style>
