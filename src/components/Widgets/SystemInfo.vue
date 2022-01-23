<template>
<div class="system-info-wrapper">
  <div class="some-info" v-if="info">
    <p class="host">
      {{ info.username | isUsername }}{{ info.hostname }}
    </p>
    <p class="system">
      {{ info.system }} <span class="gap">|</span>
      {{ $t('widgets.system-info.uptime') }}: {{ info.uptime | makeUptime }}
    </p>
  </div>
  <div class="some-charts">
    <div :id="`memory-${chartId}`" class="mem-chart"></div>
    <div :id="`load-${chartId}`" class="load-chart"></div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { serviceEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  components: {},
  data() {
    return {
      info: null,
    };
  },
  computed: {
    endpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.systemInfo}`;
    },
  },
  filters: {
    isUsername(username) {
      return username ? `${username}@` : '';
    },
    makeUptime(seconds) {
      if (!seconds) return '';
      if (seconds < 60) return `${seconds} seconds`;
      if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`;
      if (seconds < 86400) return `${(seconds / 3600).toFixed(2)} hours`;
      if (seconds < 604800) return `${(seconds / 86400).toFixed(2)} days`;
      if (seconds < 2629800) return `${(seconds / 604800).toFixed(2)} weeks`;
      if (seconds < 31557600) return `${(seconds / 2629800).toFixed(2)} months`;
      if (seconds >= 31557600) return `${(seconds / 31557600).toFixed(2)} years`;
      return '';
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          if (!response.data.success) this.error('Error generating backend data');
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch system info', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      // Set class attributes for rendering
      this.info = data.meta;
      // Data for memory pie chart
      const freeMem = parseInt(data.memory.freePercent, 10);
      const memoryChartData = {
        labels: ['Free', 'Used'],
        datasets: [{
          values: [freeMem, 100 - freeMem],
        }],
      };
      this.generateMemoryPie(memoryChartData);

      // Data for load bar chart
      const loadBarChartData = {
        labels: ['1 Min', '5 Mins', '15 Mins'],
        datasets: [
          { values: [data.load.one, data.load.five, data.load.fifteen] },
        ],
      };
      this.generateLoadBar(loadBarChartData);
    },
    /* Using available memory info, generate simple pie chart */
    generateMemoryPie(memoryChartData) {
      return new this.Chart(`#memory-${this.chartId}`, {
        title: 'Memory Usage',
        data: memoryChartData,
        type: 'donut',
        height: 200,
        strokeWidth: 12,
        colors: ['#20e253', '#f80363'],
        tooltipOptions: {
          formatTooltipY: d => `${Math.round(d)}%`,
        },
      });
    },
    /* Using available load info, generate simple bar chart */
    generateLoadBar(loadBarChartData) {
      return new this.Chart(`#load-${this.chartId}`, {
        title: 'Load Averages',
        data: loadBarChartData,
        type: 'bar',
        height: 180,
        colors: ['#04e4f4'],
        barOptions: {
          spaceRatio: 0.1,
        },
      });
    },
  },
};
</script>

<style lang="scss">
.system-info-wrapper {
  color: var(--widget-text-color);
  .some-info {
    padding-bottom: 0.25rem;
    border-bottom: 1px dashed var(--widget-text-color);
    p.host {
      font-size: 1.2rem;
      margin: 0.25rem 0;
    }
    p.system {
      font-size: 0.8rem;
      margin: 0.25rem 0;
      opacity: var(--dimming-factor);
    }
    span.gap {
      margin: 0 0.4rem;
    }
  }
  .some-charts {
    display: flex;
    .mem-chart, .load-chart {
      width: 50%;
      .chart-legend {
        transform: translate(50px, 140px);
      }
    }
  }
}

</style>
