<template>
<div class="weather">
  <!-- Icon + Temperature -->
  <div class="intro">
    <p class="temp">{{ temp }}</p>
    <i :class="`owi owi-${icon}`"></i>
  </div>
  <!-- Weather description -->
  <p class="description">{{ description }}</p>
  <div class="details" v-if="showDetails && weatherDetails.length > 0">
    <div class="info-wrap" v-for="(section, indx) in weatherDetails" :key="indx">
      <p class="info-line" v-for="weather in section" :key="weather.label">
          <span class="lbl">{{weather.label}}</span>
          <span class="val">{{ weather.value }}</span>
        </p>
    </div>
  </div>
  <!-- Show/ hide toggle button -->
  <p class="more-details-btn" @click="toggleDetails" v-if="weatherDetails.length > 0">
    {{ showDetails ? $t('widgets.general.show-less') : $t('widgets.general.show-more') }}
  </p>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      loading: true,
      icon: null,
      description: null,
      temp: null,
      showDetails: false,
      weatherDetails: [],
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
    /* Extends mixin, and updates data. Called by parent component */
    update() {
      this.startLoading();
      this.fetchWeather();
    },
    /* Adds units symbol to temperature, depending on metric or imperial */
    processTemp(temp) {
      return `${Math.round(temp)}${this.tempDisplayUnits}`;
    },
    /* Fetches the weather from OpenWeatherMap, and processes results */
    fetchWeather() {
      axios.get(this.endpoint)
        .then((response) => {
          this.loading = false;
          const { data } = response;
          this.icon = data.weather[0].icon;
          this.description = data.weather[0].description;
          this.temp = this.processTemp(data.main.temp);
          if (!this.options.hideDetails) {
            this.makeWeatherData(data);
          }
        })
        .catch((error) => {
          this.throwError('Failed to fetch weather', error);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* If showing additional info, then generate this data too */
    makeWeatherData(data) {
      this.weatherDetails = [
        [
          { label: 'Min Temp', value: this.processTemp(data.main.temp_min) },
          { label: 'Max Temp', value: this.processTemp(data.main.temp_max) },
          { label: 'Feels Like', value: this.processTemp(data.main.feels_like) },
        ],
        [
          { label: 'Pressure', value: `${data.main.pressure}hPa` },
          { label: 'Humidity', value: `${data.main.humidity}%` },
          { label: 'visibility', value: data.visibility },
          { label: 'wind', value: `${data.wind.speed}${this.speedDisplayUnits}` },
          { label: 'clouds', value: `${data.clouds.all}%` },
        ],
      ];
    },
    /* Show/ hide additional weather info */
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
    /* Validate input props, and print warning if incorrect */
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
    /* Just outputs an error message */
    throwError(msg, error) {
      this.error(msg, error);
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

.loader {
  margin: 0 auto;
  display: flex;
}
  p {
    color: var(--widget-text-color);
  }

.weather {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  // Weather symbol and temperature
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
  // Weather description
  .description {
    grid-column-start: 2;
    text-transform: capitalize;
    text-align: center;
    margin: 0;
  }
  // Show more details button
  .more-details-btn {
    grid-column-start: span 2;
    cursor: pointer;
    font-size: 0.9rem;
    text-align: center;
    width: fit-content;
    margin: 0.25rem auto;
    padding: 0.1rem 0.25rem;
    border: 1px solid transparent;
    opacity: var(--dimming-factor);
    border-radius: var(--curve-factor);
    &:hover {
      border: 1px solid var(--widget-text-color);
    }
    &:focus, &:active {
      background: var(--widget-text-color);
      color: var(--widget-background-color);
    }
  }
  // More weather details table
  .details {
    grid-column-start: span 2;
    display: flex;
    .info-wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
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
  }
}

</style>
