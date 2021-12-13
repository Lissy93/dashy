<template>
  <Clock v-if="widgetType === 'clock'" :options="widgetOptions" />
  <Weather v-else-if="widgetType === 'weather'" :options="widgetOptions" />
  <WeatherForecast v-else-if="widgetType === 'weather-forecast'" :options="widgetOptions" />
  <TflStatus v-else-if="widgetType === 'tfl-status'" :options="widgetOptions" />
  <CryptoPriceChart v-else-if="widgetType === 'crypto-price-chart'" :options="widgetOptions" />
  <CryptoWatchList v-else-if="widgetType === 'crypto-watch-list'" :options="widgetOptions" />
  <XkcdComic v-else-if="widgetType === 'xkcd-comic'" :options="widgetOptions" />
  <ExchangeRates v-else-if="widgetType === 'exchange-rates'" :options="widgetOptions" />
  <StockPriceChart v-else-if="widgetType === 'stock-price-chart'" :options="widgetOptions" />
  <Jokes v-else-if="widgetType === 'joke'" :options="widgetOptions" />
  <IframeWidget v-else-if="widgetType === 'iframe'" :options="widgetOptions" />
</template>

<script>
import ErrorHandler from '@/utils/ErrorHandler';
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
    groupId() {
      return `widget-${this.index}`;
    },
    widgetType() {
      if (!this.widget.type) {
        ErrorHandler('Missing type attribute for widget');
        return null;
      }
      return this.widget.type.toLowerCase();
    },
    widgetOptions() {
      return this.widget.options || {};
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

</style>
