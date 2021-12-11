<template>
  <div>
    <Collapsable
      :title="widget.name"
      :icon="widget.icon"
      :uniqueKey="groupId"
      :collapsed="displayData.collapsed"
      :cols="displayData.cols"
      :rows="displayData.rows"
      :color="displayData.color"
      :customStyles="displayData.customStyles"
    >
      <Clock v-if="widgetType === 'clock'" :options="widgetOptions" />
      <Weather v-else-if="widgetType === 'weather'" :options="widgetOptions" />
      <WeatherForecast v-else-if="widgetType === 'weather-forecast'" :options="widgetOptions" />
      <TflStatus v-else-if="widgetType === 'tfl-status'" :options="widgetOptions" />
      <CryptoPriceChart v-else-if="widgetType === 'crypto-price-chart'" :options="widgetOptions" />
      <CryptoWatchList v-else-if="widgetType === 'crypto-watch-list'" :options="widgetOptions" />
      <XkcdComic v-else-if="widgetType === 'xkcd-comic'" :options="widgetOptions" />
    </Collapsable>
  </div>
</template>

<script>
import Clock from '@/components/Widgets/Clock.vue';
import Weather from '@/components/Widgets/Weather.vue';
import WeatherForecast from '@/components/Widgets/WeatherForecast.vue';
import TflStatus from '@/components/Widgets/TflStatus.vue';
import CryptoPriceChart from '@/components/Widgets/CryptoPriceChart.vue';
import CryptoWatchList from '@/components/Widgets/CryptoWatchList.vue';
import XkcdComic from '@/components/Widgets/XkcdComic.vue';
import Collapsable from '@/components/LinkItems/Collapsable.vue';

export default {
  name: 'Widget',
  components: {
    Collapsable,
    Clock,
    Weather,
    WeatherForecast,
    TflStatus,
    CryptoPriceChart,
    CryptoWatchList,
    XkcdComic,
  },
  props: {
    widget: Object,
    index: Number,
  },
  computed: {
    displayData() {
      return this.widget.displayData || {};
    },
    groupId() {
      return `widget-${this.index}`;
    },
    widgetType() {
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
