<template>
<div class="eth-gas-wrapper" v-if="gasCosts">
  <!-- Current Prices -->
  <p class="current-label">Current Gas Prices</p>
  <div v-for="gasCost in gasCosts" :key="gasCost.name" class="gas-row">
    <p class="time-name">{{ gasCost.name }}</p>
    <div class="cost">
      <span class="usd">${{ gasCost.usd }}</span>
      <span class="gwei">{{ gasCost.gwei }} GWEI</span>
    </div>
  </div>
  <!-- Current ETH Price -->
  <div class="current-price">
    <span class="label">Current ETH Price:</span>
    <span class="price">{{ gasInfo.ethPrice }}</span>
  </div>
  <!-- Historical Chart -->
  <p class="time-frame-label">Historical Gas Prices</p>
  <div class="time-frame-selector">
    <span
      v-for="time in timeOptions"
      :key="time.value"
      @click="updateTimeFrame(time.value)"
      :class="time.value === selectedTimeFrame ? 'selected' : ''"
    >
    {{ time.label }}
    </span>
  </div>
  <div :id="chartId"></div>
  <!-- Meta Info -->
  <div v-if="gasInfo" class="gas-info">
    <p>Last Updated: {{ gasInfo.lastUpdated }}</p>
    <div class="sources">
      Sources:
      <a
        v-for="source in gasInfo.sources"
        :key="source.name"
        :href="source.source"
        v-tooltip="tooltip(`Average: ${source.standard || '[UNKNOWN]'} GWEI`)"
      >{{ source.name }}</a>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { timestampToTime, roundPrice, putCommasInBigNum } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  computed: {
    numHours() {
      return this.options.numHours || 24;
    },
    endpoint() {
      const numHours = this.selectedTimeFrame || this.numHours;
      return `${widgetApiEndpoints.ethGasHistory}?hours=${numHours}`;
    },
  },
  data() {
    return {
      gasInfo: null,
      gasCosts: null,
      timeOptions: [
        { label: '6 hours', value: 6 },
        { label: '1 Day', value: 24 },
        { label: '1 Week', value: 168 },
        { label: '2 Weeks', value: 220 },
      ],
      selectedTimeFrame: null,
    };
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      this.makeRequest(widgetApiEndpoints.ethGasPrices).then(this.processPriceInfo);
      this.makeRequest(this.endpoint).then(this.processHistoryData);
    },
    processPriceInfo(data) {
      this.gasCosts = [
        { name: 'Slow', gwei: data.slow.gwei, usd: data.slow.usd },
        { name: 'Normal', gwei: data.normal.gwei, usd: data.normal.usd },
        { name: 'Fast', gwei: data.fast.gwei, usd: data.fast.usd },
        { name: 'Instant', gwei: data.instant.gwei, usd: data.instant.usd },
      ];
      const sources = [];
      data.sources.forEach((sourceInfo) => {
        const { name, source, standard } = sourceInfo;
        sources.push({ name, source, standard });
      });
      this.gasInfo = {
        lastUpdated: timestampToTime(data.lastUpdated),
        ethPrice: `$${putCommasInBigNum(roundPrice(data.ethPrice))}`,
        sources,
      };
    },
    processHistoryData(data) {
      const chartData = {
        labels: data.labels,
        datasets: [
          { name: 'Slow', type: 'bar', values: data.slow },
          { name: 'Normal', type: 'bar', values: data.normal },
          { name: 'Fast', type: 'bar', values: data.fast },
          { name: 'Instant', type: 'bar', values: data.instant },
        ],
      };
      return new this.Chart(`#${this.chartId}`, {
        title: 'Historical Transaction Costs',
        data: chartData,
        type: 'axis-mixed',
        height: this.chartHeight,
        colors: ['#ef476f', '#ffd166', '#118ab2', '#06d6a0'],
        truncateLegends: true,
        lineOptions: {
          hideDots: 1,
        },
        axisOptions: {
          xIsSeries: true,
          xAxisMode: 'tick',
        },
        tooltipOptions: {
          formatTooltipY: d => `${d} GWEI`,
        },
      });
    },
    updateTimeFrame(newNumHours) {
      this.startLoading();
      this.selectedTimeFrame = newNumHours;
      this.fetchData();
    },
  },
  mounted() {
    this.selectedTimeFrame = this.numHours;
  },
};
</script>

<style scoped lang="scss">
.eth-gas-wrapper {
  p.current-label {
    margin: 0.25rem 0;
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
  }
  .gas-row {
    display: flex;
    vertical-align: middle;
    justify-content: space-between;
    color: var(--widget-text-color);
    p.time-name {
      margin: 0.25rem 0;
      font-weight: bold;
      font-size: 1.1rem;
    }
    .cost {
      display: flex;
      min-width: 10rem;
      justify-content: space-between;
      span {
        font-family: var(--font-monospace);
        margin: 0.5rem;
        &.usd {
          opacity: var(--dimming-factor);
        }
      }
    }
    &:not(:last-child) { border-bottom: 1px dashed var(--widget-text-color); }
  }
  .current-price {
    color: var(--widget-text-color);
    margin: 1rem 0 0.5rem;
    span.label {
      font-weight: bold;
      margin-right: 0.5rem;
    }
    span.price {
      font-family: var(--font-monospace);
    }
  }
  .gas-info {
    p, .sources {
      margin: 0.5rem 0;
      font-size: 0.8rem;
      opacity: var(--dimming-factor);
      color: var(--widget-text-color);
      font-family: var(--font-monospace);
    }
    .sources a {
      color: var(--widget-text-color);
      margin: 0 0.15rem;
    }
  }
  p.time-frame-label {
    display: inline-block;
    color: var(--widget-text-color);
    opacity: var(--dimming-factor);
    margin: 1rem 0.5rem 0.25rem 0;
    font-size: 0.9rem;
  }
  .time-frame-selector {
    display: inline-block;
    margin: 0 0 0.25rem;
    max-width: 20rem;
    vertical-align: middle;
    justify-content: space-evenly;
    color: var(--widget-text-color);
    font-size: 0.9rem;
    span {
      cursor: pointer;
      padding: 0.1rem 0.25rem;
      margin: 0 0.15rem;
      border: 1px solid transparent;
      border-radius: var(--curve-factor);
      &.selected {
        background: var(--widget-text-color);
        color: var(--widget-background-color);
      }
      &:hover {
        border: 1px solid var(--widget-text-color);
      }
    }
  }
}

</style>
