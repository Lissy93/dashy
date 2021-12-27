/**
 * Mixin for helper functions, used for making chart widgets
 */
import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';

const ChartingMixin = {
  props: {},
  computed: {
    chartHeight() {
      return this.options.chartHeight || 300;
    },
    chartColors() {
      const ops = this.options;
      if (ops.chartColor && typeof ops.chartColor === 'string') return [ops.chartColor];
      if (ops.chartColors && Array.isArray(ops.chartColors)) return ops.chartColors;
      const cssVars = getComputedStyle(document.documentElement);
      return [cssVars.getPropertyValue('--widget-text-color').trim() || '#7cd6fd'];
    },
    chartId() {
      return `widget-chart-${Math.round(Math.random() * 10000)}`;
    },
  },
  data: () => ({
    Chart,
  }),
  methods: {
    /* Format the date for a given time stamp */
    formatDate(timestamp) {
      const localFormat = navigator.language;
      const dateFormat = { weekday: 'short', day: 'numeric', month: 'short' };
      return new Date(timestamp).toLocaleDateString(localFormat, dateFormat);
    },
    /* Format the time for a given time stamp */
    formatTime(timestamp) {
      const localFormat = navigator.language;
      const timeFormat = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return Intl.DateTimeFormat(localFormat, timeFormat).format(timestamp);
    },
    /* Given an array of numbers, returns the average of all */
    average(array) {
      return array.reduce((a, b) => a + b) / array.length;
    },
  },
};

export default ChartingMixin;
