<template>
<div class="weather">
  <!-- Icon + Temperature -->
  <div class="intro">
    <p class="temp">{{ temp }}</p>
    <i :class="`owi owi-${icon}`"></i>
  </div>
  <!-- Weather description -->
  <p class="description">{{ description }}</p>
  <!-- More temperature info -->
  <div class="info-wrap temp">
    <p class="info-line min">
      <span class="lbl">Minimum</span>
      <span class="val">{{ minTemp }}</span>
    </p>
    <p class="info-line min">
      <span class="lbl">Maximum</span>
      <span class="val">{{ maxTemp }}</span>
    </p>
    <p class="info-line feels">
      <span class="lbl">Feels Like</span>
      <span class="val">{{ feelsLike }}</span>
    </p>
  </div>
  <!-- More weather info -->
  <div class="info-wrap conditions">
    <p class="info-line wind">
      <span class="lbl">Wind</span>
      <span class="val">{{ wind }}</span>
    </p>
    <p class="info-line clouds">
      <span class="lbl">Clouds</span>
      <span class="val">{{ clouds }}</span>
    </p>
    <p class="info-line humidity">
      <span class="lbl">Humidity</span>
      <span class="val">{{ humidity }}</span>
    </p>
    <p class="info-line pressure">
      <span class="lbl">Pressure</span>
      <span class="val">{{ pressure }}</span>
    </p>
    <p class="info-line visibility">
      <span class="lbl">Visibility</span>
      <span class="val">{{ visibility }}</span>
    </p>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import ErrorHandler from '@/utils/ErrorHandler';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      loading: true,
      error: false,
      icon: null,
      description: null,
      temp: null,
      minTemp: null,
      maxTemp: null,
      feelsLike: null,
      pressure: null,
      visibility: null,
      humidity: null,
      wind: null,
      clouds: null,
    };
  },
  computed: {
    units() {
      return this.options.units || 'metric';
    },
    endpoint() {
      const { apiKey, city } = this.options;
      return `${widgetApiEndpoints.weather}?q=${city}&appid=${apiKey}&units=${this.units}`;
    },
    tempDisplayUnits() {
      switch (this.units) {
        case ('metric'): return '°C';
        case ('imperial'): return '°F';
        default: return '';
      }
    },
    speedDisplayUnits() {
      switch (this.units) {
        case ('metric'): return 'm/s';
        case ('imperial'): return 'mph';
        default: return '';
      }
    },
  },
  methods: {
    processTemp(temp) {
      return `${Math.round(temp)}${this.tempDisplayUnits}`;
    },
    fetchWeather() {
      axios.get(this.endpoint)
        .then((response) => {
          const { data } = response;
          this.icon = data.weather[0].icon;
          this.description = data.weather[0].description;
          this.temp = this.processTemp(data.main.temp);
          this.minTemp = this.processTemp(data.main.temp_min);
          this.maxTemp = this.processTemp(data.main.temp_max);
          this.feelsLike = this.processTemp(data.main.feels_like);
          this.pressure = `${data.main.pressure}hPa`;
          this.humidity = `${data.main.humidity}%`;
          this.visibility = data.visibility;
          this.wind = `${data.wind.speed}${this.speedDisplayUnits}`;
          this.clouds = `${data.clouds.all}%`;
        })
        .catch(() => {
          this.throwError('Failed to fetch weather');
        });
    },
    checkProps() {
      const ops = this.options;
      let valid = true;
      if (!ops.apiKey) {
        this.throwError('Missing API key for OpenWeatherMap');
        valid = false;
      }
      if (!ops.city) {
        this.throwError('A city name is required to fetch weather');
        valid = false;
      }
      if (ops.units && ops.units !== 'metric' && ops.units !== 'imperial') {
        this.throwError('Invalid units specified, must be either \'metric\' or \'imperial\'');
        valid = false;
      }
      return valid;
    },
    throwError(error) {
      ErrorHandler(error);
      this.error = true;
    },
  },
  created() {
    if (this.checkProps()) {
      this.fetchWeather();
    }
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/weather-icons.scss';

.weather {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  .intro {
    grid-column-start: span 2;
    display: flex;
    justify-content: space-around;
    .owi {
      font-size: 3rem;
      color: var(--widget-text-color);
      margin: 0;
    }
    .temp {
      font-size: 3rem;
      margin: 0;
    }
  }
  .description {
    grid-column-start: 2;
    text-transform: capitalize;
    text-align: center;
    margin: 0;
  }
  .info-wrap {
    display: flex;
    flex-direction: column;
    opacity: var(--dimming-factor);
    p.info-line {
      display: flex;
      justify-content: space-between;
      margin: 0.1rem 0.5rem;
      padding: 0.1rem 0;
      color: var(--widget-text-color);
      &:not(:last-child) {
        border-bottom: 1px dashed var(--widget-text-color);
      }
    }
  }
  p {
      color: var(--widget-text-color);
  }
}

</style>
