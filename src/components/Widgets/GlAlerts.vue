<template>
<div class="glances-alerts-wrapper" v-if="alerts">
  <div class="alert-row" v-for="(alert, index) in alerts" :key="index">
    <p class="time" v-tooltip="tooltip(`${alert.timeAgo}<br>Lasted: ${alert.lasted}`, true)">
      {{ alert.time }}
      <span v-if="alert.ongoing" class="ongoing">Ongoing</span>
    </p>
    <div class="alert-info" v-tooltip="tooltip(alert.minMax, true)">
      <span class="category">{{ alert.category }}</span> -
      <span class="value">{{ alert.value }}%</span>
    </div>
    <p :class="`severity ${alert.severity.toLowerCase()}`">{{ alert.severity }}</p>
  </div>
</div>
<div v-else-if="noResults" class="no-alerts">
  <p class="no-alert-title">System is Healthy</p>
  <p class="no-alert-info">There are no active alerts</p>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';
import { timestampToDateTime, getTimeAgo, getTimeDifference } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, GlancesMixin],
  data() {
    return {
      alerts: null,
      noResults: false,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('alert');
    },
  },
  filters: {},
  methods: {
    processData(alertData) {
      const round = (num) => ((num && typeof num === 'number') ? Math.round(num) : num);
      if (!alertData || alertData.length === 0) {
        this.noResults = true;
      } else {
        const alerts = [];
        alertData.forEach((alert) => {
          alerts.push({
            time: timestampToDateTime(alert[0] * 1000),
            ongoing: (alert[1] === -1),
            timeAgo: getTimeAgo(alert[0] * 1000),
            lasted: alert[1] ? getTimeDifference(alert[0] * 1000, alert[1] * 1000) : 'Ongoing',
            severity: alert[2],
            category: alert[3],
            value: round(alert[5]),
            minMax: `Min: ${round(alert[4])}%<br>Avg: `
            + `${round(alert[5])}%<br>Max: ${round(alert[6])}%`,
          });
        });
        this.alerts = alerts;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.glances-alerts-wrapper {
  .alert-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--widget-text-color);
    .time {
      max-width: 25%;
      margin: 0.25rem 0;
      span.ongoing {
        display: block;
        padding: 0.25rem;
        margin: 0.2rem 0;
        font-weight: bold;
        font-size: 0.85rem;
        width: fit-content;
        color: var(--error);
        border: 1px solid var(--error);
        border-radius: var(--curve-factor);
      }
    }
    .alert-info {
      .category {}
      .value {
        font-family: var(--font-monospace);
        font-weight: bold;
      }
    }
    .severity {
      padding: 0.25rem;
      font-size: 0.85rem;
      border-radius: var(--curve-factor);
      color: var(--black);
      font-weight: bold;
      cursor: default;
      border: 1px solid var(--widget-text-color);
      &.warning { color: var(--warning); border-color: var(--warning); }
      &.critical { color: var(--danger); border-color: var(--danger); }
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}
p.no-alert-title {
  margin: 0.5rem 0;
  font-weight: bold;
  text-align: center;
  color: var(--success);
 }
p.no-alert-info {
  margin: 0.5rem 0;
  font-style: italic;
  text-align: center;
  opacity: var(--dimming-factor);
  color: var(--widget-text-color);
}
</style>
