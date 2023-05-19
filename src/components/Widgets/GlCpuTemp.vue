<template>
<div class="glances-temp-wrapper" v-if="tempData">
  <div class="temp-row" v-for="sensor in tempData" :key="sensor.label">
    <p class="label">{{ sensor.label | formatLbl }}</p>
    <p :class="`temp range-${sensor.color}`">{{ sensor.value | formatVal(sensor.unit) }}</p>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';
import { capitalize, celsiusToFahrenheit, fahrenheitToCelsius } from '@/utils/MiscHelpers';

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
    formatVal(val, unit) {
      switch (unit) {
        case 'R':
          return `${Math.round(val)} rpm`;
        case '%':
          return `${Math.round(val)}%`;
        default:
          return `${Math.round(val)}°${unit}`;
      }
    },
  },
  methods: {
    getDesiredUnits() {
      return this.options.units ?? 'C';
    },
    getDisplayValue(rawValue, units) {
      const desiredUnits = this.getDesiredUnits();
      if (units === desiredUnits) {
        return rawValue;
      }

      return desiredUnits === 'C'
        ? fahrenheitToCelsius(rawValue)
        : celsiusToFahrenheit(rawValue);
    },
    getCelsiusValue(rawValue, units) {
      if (units !== 'F' && units !== 'C') {
        return Number.NaN;
      }

      return units === 'C' ? rawValue : fahrenheitToCelsius(rawValue);
    },
    getFahrenheitValue(rawValue, units) {
      if (units !== 'F' && units !== 'C') {
        return Number.NaN;
      }

      return units === 'F' ? rawValue : celsiusToFahrenheit(rawValue);
    },
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
      this.tempData = sensorData.map(sensor => {
        switch (sensor.unit) {
          case 'F':
          case 'C':
            return this.processTemperatureSensor(sensor);
          case 'R':
            return this.processFanSensor(sensor);
          case '%':
            return this.processBatterySensor(sensor);
          default:
            // Justification: This is a recoverable error that developers
            // should nevertheless be warned about.
            // eslint-disable-next-line
            console.warn('Unrecognized unit', sensor.unit);
            return null;
        }
      }).filter(Boolean);
    },
    processBatterySensor({ label, unit, value }) {
      const color = this.getPercentageColor(value);
      return {
        color,
        label,
        unit,
        value,
      };
    },
    processFanSensor({ label, unit, value }) {
      return {
        color: 'grey',
        label,
        unit,
        value,
      };
    },
    processTemperatureSensor({ label, unit, value: originalValue }) {
      const celsiusValue = this.getCelsiusValue(originalValue, unit);
      const color = this.getTempColor(celsiusValue);
      const displayValue = this.getDisplayValue(originalValue, unit);
      const displayUnits = this.getDesiredUnits();

      return {
        color,
        label,
        unit: displayUnits,
        value: displayValue,
      };
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
