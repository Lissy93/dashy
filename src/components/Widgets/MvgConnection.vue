<template>
<div class="mvg-connections-outer-wrapper">
  <div class="mvg-connections-header" v-if="showTitle">{{ connectionName }}</div>
  <div class="mvg-wrapper" v-if="connections">
    <div
      v-for="connection in connections"
      v-bind:key="connection.uniqueId"
      class="line"
        v-tooltip="mvgTooltipConnection(connection)"
    >
      <div
      class="departure"
      >
        <span class="time"
        >
          {{connection.parts[0].from.plannedDeparture | formatTime}}
        </span>
        <span class="delay"
          :class="{'has-delay': connection.parts[0].from.departureDelayInMinutes > 0}"
        >{{ Math.max(parseInt(connection.parts[0].from.departureDelayInMinutes) || 0, 0) }}</span>
      </div>
      <div
      class="changes"
      >
        <template
          v-for="(part,index) in connection.parts"
        >
          <span
            v-if="index > 0"
            v-bind:key="'change-' + index"
            class="change"
            v-tooltip="part.from.name"
          >⬌</span>
          <span
            v-bind:key="'transport-' + index"
              :class="['type-' + part.line.transportType,
              'line-' + part.line.label,
              ]"
            v-if="part.line.transportType != 'PEDESTRIAN'"
            class="transport"
          >{{part.line.label}}</span>
          <span v-else
            v-bind:key="'transport-' + index"
          >🚶</span>
        </template>
      </div>
      <span class="time">
        {{Date.parse(connection.parts[connection.parts.length-1]
            .to.plannedDeparture) - Date.parse(connection.parts[0]
              .from.plannedDeparture) | formatDuration}}
      </span>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      connections: null,
      locationSearch: null,
      connectionName: null,
      defaultTitle: 'Connection',
      locations: {
        origin: undefined,
        destination: undefined,
      },
    };
  },
  created() {
    const promStart = this.getLocationId(this.start);
    const promEnd = this.getLocationId(this.end);
    Promise.all([promStart, promEnd]).then(
      (results) => {
        [this.locations.origin, this.locations.destination] = results.map((r) => r[0]);
        this.defaultTitle = `${this.locations.origin.name} - ${this.locations.destination.name}`;
        this.fetchData();
      },
    );
  },
  filters: {
    formatDepartureTime(timestamp) {
      const msDifference = new Date(timestamp).getTime() - new Date().getTime();
      const diff = Math.max(0, Math.round(msDifference / 60000));
      return diff;
    },
    formatTime(str) {
      const d = new Date(Date.parse(str));
      function ii(i) {
        let s = `${i}`;
        if (s.length < 2) s = `0${s}`;
        return s;
      }
      return `${ii(d.getHours())}:${ii(d.getMinutes())}`;
    },
    formatDuration(val) {
      function ii(i) {
        let s = `${i}`;
        if (s.length < 2) s = `0${s}`;
        return s;
      }
      return `${Math.floor(val / 3600000)}:${ii(Math.floor(val / 60000))}`;
    },
  },
  computed: {
    start() {
      return this.options.from || this.options.start || this.options.origin || 'Marienplatz';
    },
    end() {
      return this.options.to || this.options.end || this.options.destination || 'Giesing';
    },
    title() {
      if (this.options.title) {
        return this.options.title;
      }
      return this.defaultTitle;
    },
    showTitle() {
      return (this.options.header) ? this.options.header : true;
    },
    transportTypes() {
      if (this.options.transportations) {
        return this.options.transportations.join(',');
      }
      return 'UBAHN,TRAM,BUS,SBAHN';
    },
  },
  methods: {
    formatPoint(point, typ) {
      if (point.type === 'ADDRESS' || point.type === 'POI') {
        return `${typ}Latitude=${point.latitude}&${typ}Longitude=${point.longitude}`;
      }
      return `${typ}StationGlobalId=${point.globalId}`;
    },
    isLocationId(loc) {
      if (!loc) {
        this.error('Location is required');
      }
      if (typeof loc !== 'string') this.error('Location can only be a string');
      return (loc.startsWith('de:09162:'));
    },
    getLocationId(loc) {
      return this.makeRequest(this.getEndpointLocation(loc));
    },
    getEndpointLocation(loc) {
      return `${widgetApiEndpoints.mvg}/location?query=${encodeURIComponent(loc)}`;
    },
    endpointConnection() {
      return `${widgetApiEndpoints.mvg}/connection?${this.formatPoint(this.locations.origin, 'origin')}&${this.formatPoint(this.locations.destination, 'destination')}&routingDateTime=${(new Date()).toISOString()}&offsetInMinutes=${this.offset}&transportTypes=${this.transportTypes}`;
    },
    update() {
      this.startLoading();
      this.fetchData();
      this.finishLoading();
    },
    fetchData() {
      if (this.locations.origin !== undefined
          && this.locations.destination !== undefined) {
        this.makeRequest(this.endpointConnection()).then(
          (response) => { this.processData(response); },
        );
      }
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.connections = data;
    },
    ensure_array(value) {
      if (typeof value === 'string') {
        return [value];
      }
      return value;
    },
    mvgTooltipConnection(data) {
      let connectionDetails = '';
      const self = this;
      function addStep(step) {
        connectionDetails += `<b>${self.$options.filters.formatTime(step.plannedDeparture)}</b>
          <span class="delay">+${Math.max(parseInt(step.departureDelayInMinutes, 10) || 0, 0)}</span>
          <span>${step.name}</span>`;
      }
      addStep(data.parts[0].from);
      data.parts.forEach((part) => {
        addStep(part.to);
      });
      return {
        content: connectionDetails, html: true, trigger: 'hover', delay: 250, classes: 'mvg-connection-detail',
      };
    },
  },
};
</script>

<style scoped lang="scss">
.mvg-header {
   color: var(--widget-text-color);
   font-size:1.2em;
}
.mvg-wrapper {
  display: grid;
  justify-content: left;
  grid-template-columns: 100%;
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
    margin: 0em;
    padding: 0em;
    border-radius: 0.2em;
    display: grid;
    grid-template-columns: 2fr 5fr 0.75fr;
    .changes {
      text-align: center;
    }
    .type-UBAHN {
      border: 0px;
    }
    .type-SBAHN {
      border: 0px;
    }
    .type-BUS {
    }
    .type-TRAM {
        background-color: #dd3d4d;
    }
    .transport{
      border-radius: 0.2em;
      margin: 0em;
      padding: 0.15em 0.15em;
      color: #FFFFFF;
      margin-right: 0.40em;
      margin-left: 0.40em;
      text-align: center;
      span {
        min-width: 2em;
        display: inline-block;
      }
      &.line-Fussweg {
            text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
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
.mvg-connection-detail .tooltip-inner {
  min-width: 20rem;
  display: grid;
  grid-template-columns: 2fr 1fr 6fr;
}
</style>
