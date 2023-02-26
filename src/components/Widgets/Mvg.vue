<template>
<div class="mvg-wrapper" v-if="departures">
  <template
    v-for="departure in departures"
  >
    <div class="departure" v-bind:key="departure.key" v-tooltip="mvgTooltipDeparture(departure)">
      <span :class="{live: departure.live}">
        {{ departure.realtimeDepartureTime | formatDepartureTime }}
      </span>
    </div>
    <div class='line'
      v-bind:key="departure.key + 'line'"
      >
      <div
        class="transport"
        :class="['type-' + departure.transportType,
        'line-' + departure.label,
        ]"
      >{{ departure.label }}</div>
      <div
      class='destination'
      v-tooltip="mvgTooltipDestination(departure)"
      :class="{cancelled: departure.cancelled}">{{ departure.destination }}</div>
      <span class="delay"
        :class="{'has-delay': departure.realtimeDepartureTime > departure.plannedDepartureTime}"
      >{{ Math.max(0,
          (departure.realtimeDepartureTime - departure.plannedDepartureTime)/60000) }}</span>
      <span class="occupancy"
      :class="'occupancy-' + departure.occupancy"
        v-if="departure.occupancy != 'UNKNOWN'"
        v-tooltip="departure.occupancy"
      >■</span>
    </div>
  </template>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { timestampToTime } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      departures: null,
      locationSearch: null,
    };
  },
  created() {
    if (!this.isLocationId) {
      this.makeRequest(this.endpointLocation).then(
        (response) => {
          const stations = response.filter((r) => r.type === 'STATION');
          if (stations.length > 0) {
            this.location = stations[0].globalId;
            this.fetchData();
          } else {
            this.error('Cannot find station for specified string');
          }
        },
      );
    } else {
      this.location = this.options.location;
    }
  },
  filters: {
    formatDepartureTime(timestamp) {
      const msDifference = new Date(timestamp).getTime() - new Date().getTime();
      const diff = Math.max(0, Math.round(msDifference / 60000));
      return diff;
    },
  },
  computed: {
    isLocationId() {
      if (!this.options.location) {
        this.error('Location is required');
      }
      if (typeof this.options.location !== 'string') this.error('Location can only be a string');
      if (this.options.location.startsWith('de:09162:')) return true;
      return false;
    },
    offset() {
      if (this.options.offset) return this.options.offset;
      return 0;
    },
    limit() {
      return this.options.limit || 10;
    },
    endpointDeparture() {
      return `${widgetApiEndpoints.mvg}/departure?globalId=${this.location}&limit=30&offsetInMinutes=${this.offset}&transportTypes=UBAHN,TRAM,BUS,SBAHN`;
    },
    endpointLocation() {
      return `${widgetApiEndpoints.mvg}/location?query=${encodeURIComponent(this.options.location)}`;
    },
  },
  methods: {
    update() {
      this.startLoading();
      this.fetchData();
      this.finishLoading();
    },
    fetchData() {
      if (this.location !== undefined) {
        this.makeRequest(this.endpointDeparture).then(
          (response) => { this.processData(response); },
        );
      }
    },
    /* Assign data variables to the returned data */
    processData(data) {
      let i = 0;
      const results = [];
      data
        .filter(this.filter_results)
        .sort(this.sort_results)
        .slice(0, this.limit).forEach((dep) => {
          results.push({ ...dep, key: `mvg-dep-${this.location}-${i}` });
          i += 1;
        });
      this.departures = results;
    },
    ensure_array(value) {
      if (typeof value === 'string') {
        return [value];
      }
      return value;
    },
    filter_results(value) {
      if (!this.options.filters) return true;
      let useEntry = (
        (!this.options.filters.line)
            || this.ensure_array(this.options.filters.line).includes(value.label)
      );
      useEntry = useEntry
        && (
          (!this.options.filters.product)
            || this.ensure_array(this.options.filters.product)
              .some(x => x.toLowerCase() === value.transportType.toLowerCase())
        );
      useEntry = useEntry
        && (
          (!this.options.filters.destination)
            || this.ensure_array(this.options.filters.destination)
              .some(x => x.toLowerCase() === value.destination.toLowerCase())
        );
      return useEntry;
    },
    sort_results(a, b) {
      const depa = a.realtimeDepartureTime ? a.realtimeDepartureTime : a.plannedDepartureTime;
      const depb = b.realtimeDepartureTime ? b.realtimeDepartureTime : b.plannedDepartureTime;
      if (depa > depb) return 1;
      if (depa < depb) return -1;
      if (a.label < b.label) return 1;
      if (a.label > b.label) return -1;
      if (a.destination < b.destination) return 1;
      if (a.destination > b.destination) return -1;
      return 0;
    },
    makeUrl(cronId) {
      const base = this.options.host || 'https://healthchecks.io';
      return `${base}/checks/${cronId}/details`;
    },
    mvgTooltipDeparture(data) {
      let departureDetails = '';
      if (data.realtime) {
        departureDetails += `Live: ${timestampToTime(data.realtimeDepartureTime)}<br />`;
      }
      departureDetails += `Planned: ${timestampToTime(data.plannedDepartureTime)}<br />`;
      if (data.realtime) {
        departureDetails += 'Live!<br />';
      }
      return {
        content: departureDetails, html: true, trigger: 'hover', delay: 250, classes: 'mvg-info-tt',
      };
    },
    mvgTooltipDestination(data) {
      let departureDetails = `<b>Infos:</b><br />${data.messages.join('<br />')}`;
      if (data.platform) {
        departureDetails += `Platform: ${data.platform}<br />`;
      }
      if (data.cancelled) {
        departureDetails += '<b>Cancelled!</b><br />';
      }
      return {
        content: departureDetails, html: true, trigger: 'hover', delay: 250, classes: 'mvg-info-tt',
      };
    },
  },
};
</script>

<style scoped lang="scss">
.mvg-wrapper {
  display: grid;
  justify-content: left;
  grid-template-columns: 1fr 9fr;
  color: var(--widget-text-color);
  padding: 0.25rem 0;
  grid-row-gap: 0.4em;
  .departure {
    min-width: 1rem;
    font-size: 1.1rem;
    font-weight: bold;
    text-align: right;
    margin-right: 0.2rem;
    span.live {
      color: var(--success);
    }
  }
  .line {
    background-color: #FFFFFF;
    margin: 0;
    padding-right: 0.2em;
    border-radius: 0.2em;
    display: grid;
    grid-template-columns: 2.2em 1fr minmax(1.5em,max-content) 0.75em;
    .type-UBAHN {
      border: 0px;
    }
    .type-SBAHN {
      border: 0px;
    }
    .type-BUS {
    }
    .type-TRAM {
    }
    .transport{
      border-top-left-radius: 0.2em 0.2em;
      border-bottom-left-radius: 0.2em 0.2em;
      margin: 0em;
      padding: 0.15em 0;
      color: #FFFFFF;
      margin-right: 0.40em;
      text-align: center;
      span {
        min-width: 2em;
        display: inline-block;
      }
      &.line-U1 {
        background-color: #468447;
      }
      &.line-U2 {
        background-color: #dd3d4d;
      }
      &.line-U3 {
        background-color: #ef8824;
      }
      &.line-U4 {
        background-color: #04af90;
      }
      &.line-U5 {
        background-color: #b78730;
      }
      &.line-U6 {
        background-color: #0472b3;
      }
      &.line-S1 {
        background-color: #79c6e7;
      }
      &.line-S2 {
        background-color: #9bc04c;
      }
      &.line-S3 {
        background-color: #942d8d;
      }
      &.line-S4 {
        background-color: #d4214d;
      }
      &.line-S5 {
        background-color: #03a074;
      }
      &.line-S6 {
        background-color: #03a074;
      }
      &.line-S7 {
        background-color: #964438;
      }
      &.line-S8 {
        background-color: #000000;
      }
      &.type-BUS {
        background-color: #0d5c70;
      }
    }
    .destination{
      border-radius: 0.2em;
      width: 100%;
      background-color: #FFFFFF;
      color: #000;
      padding-top: 0.15em;
      padding-bottom: 0.15em;
      white-space: nowrap;
      overflow: hidden;
      span.cancelled {
        color: var(--danger);
        text-decoration: line-through;
      }
      span.destination {
        overflow: clip;
        margin-right: 0.25em;
        width: 75%;
        display: inline-block;
      }
    }

    .delay{
      padding: 0.15em;
      font-weight: bold;
      &.has-delay{
        padding: 0.15em;
        background-color: var(--danger);
        color: #FFF;
        border-radius: 0.2em;
      }
    }
    .delay::before{
      content: "+";
    }
    .occupancy{
      display: inline-block;
      padding: 0 0.15em;
      border-radius: 0.2em;
      &.occupancy-LOW {
        color: green;
      }
      &.occupancy-MEDIUM {
        color: orange;
      }
      &.occupancy-HIGH {
        color: red;
      }
    }
  }
  &:not(:last-child) {
    border-bottom: 1px dashed var(--widget-text-color);
  }
}

</style>

<style lang="scss">
.ping-times-tt {
  min-width: 20rem;
}
</style>
<style lang="scss">
.mvg-info-tt {
  min-width: 20rem;
}
</style>
