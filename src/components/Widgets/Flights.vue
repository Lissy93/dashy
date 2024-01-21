<template>
<div class="flight-wrapper">
  <!-- Info -->
  <p class="flight-intro">
    Live {{ direction !== 'both' ? direction: 'flight' }} data from {{ airport }}
  </p>
  <!-- Departures -->
  <div v-if="departures.length > 0" class="flight-group">
    <h3 class="flight-type-subtitle" v-if="direction === 'both'">
      {{ $t('widgets.flight-data.departures') }}
    </h3>
    <div v-for="flight in departures" :key="flight.number" class="flight" v-tooltip="tip(flight)">
      <p class="info flight-time">{{ flight.time | formatDate }}</p>
      <p class="info flight-number">{{ flight.number }}</p>
      <p class="info flight-airport">{{ flight.airport }}</p>
    </div>
  </div>
  <!-- Arrivals -->
  <div v-if="arrivals.length > 0" class="flight-group">
    <h3 class="flight-type-subtitle" v-if="direction === 'both'">
      {{ $t('widgets.flight-data.arrivals') }}
    </h3>
    <div v-for="flight in arrivals" :key="flight.number" class="flight" v-tooltip="tip(flight)">
      <p class="info flight-time">{{ flight.time | formatDate }}</p>
      <p class="info flight-number">{{ flight.number }}</p>
      <p class="info flight-airport">{{ flight.airport }}</p>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      departures: [],
      arrivals: [],
    };
  },
  filters: {
    formatDate(date) {
      const d = new Date(date);
      if (Number.isNaN(d.getHours())) return '[UNKNOWN]';
      return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    },
  },
  computed: {
    /* The users desired airport, specified as a 4-digit ICAO-code */
    airport() {
      const usersChoice = this.options.airport;
      if (!usersChoice) {
        this.error('A valid airport must be specified');
        return '';
      }
      const formattedAirport = usersChoice.toUpperCase().trim();
      if (!(/[A-Z]{4}/).test(formattedAirport)) {
        this.error('Incorrect airport format, must be a valid 4-digit ICAO-code');
        return '';
      }
      return formattedAirport;
    },
    apiKey() {
      const usersChoice = this.options.apiKey;
      if (!usersChoice) {
        this.error('An API key must be supplied');
        return '';
      }
      return usersChoice;
    },
    /* The direction of flights: Arrival, Departure or Both */
    direction() {
      const usersChoice = this.options.direction;
      if (!usersChoice || typeof usersChoice !== 'string') return 'both';
      const options = ['arrival', 'departure', 'both'];
      if (options.includes(usersChoice.toLowerCase())) return usersChoice;
      return 'both';
    },
    limit() {
      const usersChoice = this.options.limit;
      if (usersChoice) return usersChoice;
      return 8;
    },
    /* The starting date, right now, in ISO String format */
    fromDate() {
      const now = new Date();
      return new Date(`${now.toString().split('GMT')[0]} UTC`).toISOString().split('.')[0];
    },
    /* The ending date, 12 hours from now, in ISO string format */
    toDate() {
      const now = new Date(new Date().setSeconds(0));
      const tomorrow = new Date(new Date(now).setHours(now.getHours() + 12));
      return new Date(`${tomorrow.toString().split('GMT')[0]} UTC`).toISOString().split('.')[0];
    },
    endpoint() {
      return `${widgetApiEndpoints.flights}${this.airport}/${this.fromDate}/${this.toDate}`;
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      const requestConfig = {
        method: 'GET',
        url: this.endpoint,
        params: {
          withCargo: 'true',
          withPrivate: 'true',
          withLocation: 'false',
        },
        headers: {
          'x-rapidapi-host': 'aerodatabox.p.rapidapi.com',
          'x-rapidapi-key': this.apiKey,
        },
      };
      axios.request(requestConfig)
        .then((response) => {
          this.processData(response.data);
        }).catch((error) => {
          this.error('Unable to fetch flight data', error);
        }).finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.arrivals = this.makeFlightList(data.arrivals).slice(0, this.limit);
      this.departures = this.makeFlightList(data.departures).slice(0, this.limit);
    },
    /* Gets the useful flight info out of departures or arrivals */
    makeFlightList(flights) {
      const results = [];
      flights.forEach((flight) => {
        results.push({
          number: flight.number,
          airline: flight.airline.name,
          aircraft: flight.aircraft.model,
          airport: flight.movement.airport.name,
          time: flight.movement.actualTimeUtc,
        });
      });
      return results;
    },
    tip(flight) {
      const content = `${flight.aircraft} | ${flight.airline}`;
      return {
        content, trigger: 'hover focus', delay: 250, classes: 'in-modal-tt',
      };
    },
  },
};
</script>

<style scoped lang="scss">
.flight-wrapper {
  p.flight-intro {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: var(--widget-text-color);
    opacity: var(--dimming-factor);
  }
  h3.flight-type-subtitle {
    margin: 0.25rem 0;
    font-size: 1.2rem;
    color: var(--widget-text-color);
  }
 .flight-group {
    .flight {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0.25rem 0;
      p.info {
        margin: 0;
        min-width: 33%;
        color: var(--widget-text-color);
      }
      &:not(:last-child) {
        border-bottom: 1px dashed var(--widget-text-color);
      }
    }
  }
}

</style>
