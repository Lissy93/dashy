<template>
<div class="glances-cpu-gauge-wrapper">
  <GaugeChart :value="gaugeValue" :baseColor="background">
    <p class="percentage">{{ gaugeValue }}%</p>
  </GaugeChart>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GaugeChart from '@/components/Charts/Gauge';
import { getValueFromCss } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {
    GaugeChart,
  },
  data() {
    return {
      gaugeValue: 0,
      background: '#fff',
    };
  },
  computed: {
    hostname() {
      if (!this.options.hostname) this.error('You must specify a \'hostname\' for Glaces');
      return this.options.hostname;
    },
    endpoint() {
      return `${this.hostname}/api/3/cpu`;
    },
  },
  methods: {
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    processData(cpuData) {
      this.gaugeValue = cpuData.total;
    },
  },
  mounted() {
    this.background = getValueFromCss('widget-accent-color');
  },
};
</script>

<style scoped lang="scss">
.glances-cpu-gauge-wrapper {
  .gauge-chart {
    max-width: 18rem;
    margin: 0 auto;
  }
  p.percentage {
    color: var(--widget-text-color);
    text-align: center;
    position: absolute;
    font-size: 1.3rem;
    margin: 0.5rem 0;
    width: 100%;
    bottom: 0;
  }
}
</style>
