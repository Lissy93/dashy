<template>
  <div class="widget-base">
    <Button :click="update" class="action-btn update-btn" v-if="!error && !loading">
      <UpdateIcon />
    </Button>
    <Button :click="fullScreenWidget" class="action-btn open-btn" v-if="!error && !loading">
      <OpenIcon />
    </Button>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="widget-error">
      <p class="error-msg">An error occurred, see the logs for more info.</p>
      <p class="error-output">{{ errorMsg }}</p>
    </div>
    <Clock
      v-else-if="widgetType === 'clock'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <Weather
      v-else-if="widgetType === 'weather'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <WeatherForecast
      v-else-if="widgetType === 'weather-forecast'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <TflStatus
      v-else-if="widgetType === 'tfl-status'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <CryptoPriceChart
      v-else-if="widgetType === 'crypto-price-chart'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <CryptoWatchList
      v-else-if="widgetType === 'crypto-watch-list'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <XkcdComic
      v-else-if="widgetType === 'xkcd-comic'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <ExchangeRates
      v-else-if="widgetType === 'exchange-rates'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <StockPriceChart
      v-else-if="widgetType === 'stock-price-chart'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <Jokes
      v-else-if="widgetType === 'joke'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
    <IframeWidget
      v-else-if="widgetType === 'iframe'"
      :options="widgetOptions"
      @error="handleError"
      :ref="widgetRef"
    />
  </div>
</template>

<script>
import ErrorHandler from '@/utils/ErrorHandler';
import Button from '@/components/FormElements/Button';
import UpdateIcon from '@/assets/interface-icons/widget-update.svg';
import OpenIcon from '@/assets/interface-icons/open-new-tab.svg';

import Clock from '@/components/Widgets/Clock.vue';
import Weather from '@/components/Widgets/Weather.vue';
import WeatherForecast from '@/components/Widgets/WeatherForecast.vue';
import TflStatus from '@/components/Widgets/TflStatus.vue';
import CryptoPriceChart from '@/components/Widgets/CryptoPriceChart.vue';
import CryptoWatchList from '@/components/Widgets/CryptoWatchList.vue';
import XkcdComic from '@/components/Widgets/XkcdComic.vue';
import ExchangeRates from '@/components/Widgets/ExchangeRates.vue';
import StockPriceChart from '@/components/Widgets/StockPriceChart.vue';
import Jokes from '@/components/Widgets/Jokes.vue';
import IframeWidget from '@/components/Widgets/IframeWidget.vue';

export default {
  name: 'Widget',
  components: {
    Button,
    UpdateIcon,
    OpenIcon,
    Clock,
    Weather,
    WeatherForecast,
    TflStatus,
    CryptoPriceChart,
    CryptoWatchList,
    XkcdComic,
    ExchangeRates,
    StockPriceChart,
    Jokes,
    IframeWidget,
  },
  props: {
    widget: Object,
    index: Number,
  },
  data: () => ({
    loading: false,
    error: false,
    errorMsg: null,
  }),
  computed: {
    /* Returns the widget type, shows error if not specified */
    widgetType() {
      if (!this.widget.type) {
        ErrorHandler('Missing type attribute for widget');
        return null;
      }
      return this.widget.type.toLowerCase();
    },
    /* Returns the users specified widget options, or empty object */
    widgetOptions() {
      return this.widget.options || {};
    },
    widgetRef() {
      return `widget-${this.widgetType}-${this.index}`;
    },
  },
  methods: {
    update() {
      this.$refs[this.widgetRef].update();
    },
    handleError(msg) {
      this.error = true;
      this.errorMsg = msg;
    },
    fullScreenWidget() {
      this.$emit('navigateToSection');
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';
.widget-base {
  position: relative;
  padding-top: 0.75rem;
  button.action-btn  {
    height: 1rem;
    min-width: auto;
    width: 1.75rem;
    margin: 0;
    padding: 0.1rem 0;
    position: absolute;
    top: 0;
    border: none;
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
    &:hover {
      opacity: 1;
      color: var(--widget-background-color);
    }
    &.update-btn {
      right: -0.25rem;
    }
    &.open-btn {
      right: 1.75rem;
    }
  }

  .widget-error {
    p.error-msg {
      color: var(--warning);
      font-weight: bold;
      font-size: 1rem;
      margin: 0 auto 0.5rem auto;
    }
    p.error-output {
      font-family: var(--font-monospace);
      color: var(--widget-text-color);
      font-size: 0.85rem;
      margin: 0.5rem auto;
    }
  }
}

</style>
