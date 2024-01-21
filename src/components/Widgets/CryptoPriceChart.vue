<template>
<div class="crypto-price-chart" :id="chartId"></div>
</template>

<script>
import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm';
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  components: {},
  data() {
    return {
      chartData: null,
      chartDom: null,
    };
  },
  computed: {
    /* The crypto asset to fetch price data for */
    asset() {
      const userChoice = this.options.asset;
      if (typeof userChoice === 'string') return userChoice;
      return 'bitcoin';
    },
    /* Number of days worth of history to fetch and display */
    numDays() {
      const userChoice = this.options.numDays;
      if (typeof usersChoice === 'number' && userChoice < 30 && userChoice > 0.15) {
        return userChoice;
      }
      return 7;
    },
    /* The fiat currency to calculate price data in */
    currency() {
      const userChoice = this.options.currency;
      if (typeof userChoice === 'string') return userChoice;
      return 'USD';
    },
    /* The number of data points to render on the chart */
    dataPoints() {
      const userChoice = this.options.dataPoints;
      if (typeof usersChoice === 'number' && userChoice < 100 && userChoice > 5) {
        return userChoice;
      }
      return 30;
    },
    /* The formatted GET request API endpoint to fetch crypto data from */
    endpoint() {
      return `${widgetApiEndpoints.cryptoPrices}${this.asset}/`
      + `market_chart?vs_currency=${this.currency}&days=${this.numDays}`;
    },
    /* A sudo-random ID for the chart DOM element */
    chartId() {
      return `crypto-price-chart-${Math.round(Math.random() * 10000)}`;
    },
  },
  methods: {
    /* Create new chart, using the crypto data */
    generateChart() {
      return new Chart(`#${this.chartId}`, {
        title: `${this.asset} Price Chart`,
        data: this.chartData,
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
          formatTooltipY: d => `${d} ${this.currency}`,
        },
      });
    },
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          try {
            this.processData(response.data);
          } catch (chartingError) {
            this.error('Unable to plot results on chart', chartingError);
          }
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch crypto data', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Generate price history in a format that can be consumed by the chart
     * To improve efficiency, only a certain amount of data points are plotted
     * depending on user preference. An average is then calculated between points
     */
    processData(data) {
      const priceChartData = [];
      const priceLabels = [];
      const interval = Math.round(data.prices.length / this.dataPoints);
      const showTime = this.numDays < 5;
      // Counters for calculating averages between data points
      let tmpCounter = 0; let tmpTotal = 0;
      const incrementAverage = (add) => {
        tmpCounter += 1; tmpTotal += add;
        if (add === null) { tmpCounter = 0; tmpTotal = 0; }
      };
      // For each data point, calc average, and if interval is right, then append
      data.prices.forEach((priceGroup, index) => {
        incrementAverage(priceGroup[1]); // Increment averages
        if (index % interval === 0) {
          const price = this.formatPrice(tmpTotal / tmpCounter);
          priceLabels.push(this.formatDate(priceGroup[0], showTime));
          priceChartData.push(price);
          incrementAverage(null); // Reset counter
        }
      });
      // Combine results with chart config
      this.chartData = {
        labels: priceLabels,
        datasets: [
          {
            name: 'Price',
            type: 'bar',
            values: priceChartData,
          },
        ],
      };
      // Call chart render function
      this.renderChart();
    },
    /* Uses class data to render the line chart */
    renderChart() {
      this.chartDom = this.generateChart();
    },
    /* Format the date for a given time stamp, also include time if required */
    formatDate(timestamp, includeTime) {
      const localFormat = navigator.language;
      const dateFormat = { weekday: 'short', day: 'numeric', month: 'short' };
      const timeFormat = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
      const date = new Date(timestamp).toLocaleDateString(localFormat, dateFormat);
      const time = Intl.DateTimeFormat(localFormat, timeFormat).format(timestamp);
      return `${date} ${includeTime ? time : ''}`;
    },
    /* Format the price, rounding to given number of decimal places */
    formatPrice(price) {
      let numDecimals = 0;
      if (price < 10) numDecimals = 1;
      if (price < 1) numDecimals = 2;
      if (price < 0.1) numDecimals = 3;
      if (price < 0.01) numDecimals = 4;
      if (price < 0.001) numDecimals = 5;
      return price.toFixed(numDecimals);
    },
  },
};
</script>

<style lang="scss">
.crypto-price-chart .chart-container {
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
