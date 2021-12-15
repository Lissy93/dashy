<template>
<div class="cpu-history-chart" :id="chartId"></div>
</template>

<script>
import axios from 'axios';
import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      chartTitle: null,
      chartData: null,
      chartDom: null,
    };
  },
  mounted() {
    this.fetchData();
  },
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
    chartHeight() {
      return this.options.chartHeight || 300;
    },
    getChartColor() {
      const cssVars = getComputedStyle(document.documentElement);
      return cssVars.getPropertyValue('--widget-text-color').trim() || '#7cd6fd';
    },
  },
  methods: {
    /* Make GET request to NetData */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch data', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const timeData = [];
      const systemCpu = [];
      const userCpu = [];
      data.data.reverse().forEach((reading) => {
        timeData.push(this.formatDate(reading[0]));
        systemCpu.push(reading[2]);
        userCpu.push(reading[3]);
      });
      this.chartData = {
        labels: timeData,
        datasets: [
          { name: 'System CPU', type: 'bar', values: systemCpu },
          { name: 'User CPU', type: 'bar', values: userCpu },
        ],
      };
      this.chartTitle = this.makeChartTitle(data.data);
      this.renderChart();
    },
    makeChartTitle(data) {
      if (!data || !data[0][0]) return '';
      const diff = Math.round((data[data.length - 1][0] - data[0][0]) / 60);
      return `Past ${diff} minutes`;
    },
    renderChart() {
      this.chartDom = this.generateChart();
    },
    /* Create new chart, using the crypto data */
    generateChart() {
      return new Chart(`#${this.chartId}`, {
        title: this.chartTitle,
        data: this.chartData,
        type: 'axis-mixed',
        height: this.chartHeight,
        colors: [this.getChartColor, '#743ee2'],
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
    /* Format the date for a given time stamp, also include time if required */
    formatDate(timestamp) {
      const localFormat = navigator.language;
      const dateFormat = { weekday: 'short', day: 'numeric', month: 'short' };
      const timeFormat = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
      const date = new Date(timestamp * 1000).toLocaleDateString(localFormat, dateFormat);
      const time = Intl.DateTimeFormat(localFormat, timeFormat).format(timestamp);
      return `${date} ${time}`;
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
