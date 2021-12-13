<template>
  <div class="widget-base">
    <Button :click="update" class="update-btn">
      <UpdateIcon />
    </Button>
    <Clock
      v-if="widgetType === 'clock'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <Weather
      v-else-if="widgetType === 'weather'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <WeatherForecast
      v-else-if="widgetType === 'weather-forecast'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <TflStatus
      v-else-if="widgetType === 'tfl-status'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <CryptoPriceChart
      v-else-if="widgetType === 'crypto-price-chart'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <CryptoWatchList
      v-else-if="widgetType === 'crypto-watch-list'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <XkcdComic
      v-else-if="widgetType === 'xkcd-comic'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <ExchangeRates
      v-else-if="widgetType === 'exchange-rates'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <StockPriceChart
      v-else-if="widgetType === 'stock-price-chart'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <Jokes
      v-else-if="widgetType === 'joke'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
    <IframeWidget
      v-else-if="widgetType === 'iframe'"
      :options="widgetOptions"
      :ref="widgetRef"
    />
  </div>
</template>

<script>
import ErrorHandler from '@/utils/ErrorHandler';
import Button from '@/components/FormElements/Button';
import UpdateIcon from '@/assets/interface-icons/widget-update.svg';

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
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';
.widget-base {
  position: relative;
  padding-top: 0.75rem;
  button.update-btn {
    height: 1.5rem;
    min-width: auto;
    width: 2rem;
    margin: 0;
    padding: 0.1rem 0;
    position: absolute;
    right: -0.25rem;
    top: -0.25rem;
    border: none;
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
    &:hover {
      opacity: 1;
      color: var(--widget-background-color);
    }
  }
}

</style>
