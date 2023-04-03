<template>
<div class="glances-temp-wrapper" v-if="tempData">
  <div class="temp-row" v-for="sensor in tempData" :key="sensor.label">
    <p class="label">{{ sensor.label | formatLbl }}</p>
    <p :class="`temp range-${sensor.color}`">{{ sensor.value | formatVal(sensor.sensorType) }}</p>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';
import { capitalize, fahrenheitToCelsius } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, GlancesMixin],
  data() {
    return {
      tempData: null,
      noResults: false,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('sensors');
    },
  },
  filters: {
    formatLbl(lbl) {
      return capitalize(lbl);
    },
    formatVal(val, sensorType) {
      switch (sensorType) {
        case 'rpm':
          return `${Math.round(val)} rpm`;
        case 'percentage':
          return `${Math.round(val)}%`;
        default:
          return `${Math.round(val)}°C`;
      }
    },
  },
  methods: {
    getTempColor(temp) {
      if (temp <= 50) return 'green';
      if (temp > 50 && temp < 75) return 'yellow';
      if (temp >= 75) return 'red';
      return 'grey';
    },
    getPercentageColor(percentage) {
      if (percentage < 20) return 'red';
      if (percentage < 50) return 'orange';
      if (percentage < 75) return 'yellow';
      return 'green';
    },
    processData(sensorData) {
      const results = [];
      sensorData.forEach((sensor) => {
        // Start by assuming the sensor's unit is degrees Celsius
        let sensorValue = sensor.value;
        let color = this.getTempColor(sensorValue);
        let sensorType = 'temperature';

        // Now, override above if sensor unit is actually of a different type
        switch (sensor.unit) {
          case 'F':
            sensorValue = fahrenheitToCelsius(sensorValue);
            color = fahrenheitToCelsius(sensorValue);
            break;

          // R is for RPM and is typically for fans
          case 'R':
            color = 'grey';
            sensorType = 'rpm';
            break;

          // For instance, battery levels
          case '%':
            sensorType = 'percentage';
            color = this.getPercentageColor(sensorValue);
            break;

          // Nothing to do here, already covered by default values
          default:
            break;
        }

        results.push({
          label: sensor.label,
          value: sensorValue,
          color,
          sensorType,
        });
      });
      this.tempData = results;
    },
  },
};
</script>

<style scoped lang="scss">
.glances-temp-wrapper {
  .temp-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    p.label {
      margin: 0.5rem 0;
      color: var(--widget-text-color);
    }
    p.temp {
      margin: 0.5rem 0;
      font-size: 1.5rem;
      font-weight: bold;
      &.range-green { color: var(--success); }
      &.range-yellow { color: var(--warning); }
      &.range-red { color: var(--danger); }
      &.range-grey { color: var(--medium-grey); }
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}
</style>
