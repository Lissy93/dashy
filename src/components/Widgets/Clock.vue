<template>
<div class="clock">
  <div class="upper" v-if="!options.hideDate">
    <p class="city">{{ cityName }}</p>
    <p class="date">{{ date }}</p>
  </div>
  <p class="time">{{ time }}</p>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      time: null, // Current time string
      date: null, // Current date string
      timeUpdateInterval: null, // Stores setInterval function
    };
  },
  computed: {
    /* Get time zone, either specified by user or calculated from browser */
    timeZone() {
      if (this.options.timeZone) return this.options.timeZone;
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    /* Get date/time format specification, either user choice, or from browser lang */
    timeFormat() {
      if (this.options.format) return this.options.format;
      return navigator.language;
    },
    /* Get city name from time-zone, or return users custom city name */
    cityName() {
      if (this.options.customCityName) return this.options.customCityName;
      return this.timeZone.split('/')[1].replaceAll('_', ' ');
    },
    showSeconds() {
      return !this.options.hideSeconds;
    },
  },
  methods: {
    update() {
      this.setTime();
      this.setDate();
    },
    /* Get and format the current time */
    setTime() {
      this.time = Intl.DateTimeFormat(this.timeFormat, {
        timeZone: this.timeZone,
        hour: 'numeric',
        minute: 'numeric',
        ...(this.showSeconds && { second: 'numeric' }),
      }).format();
    },
    /* Get and format the date */
    setDate() {
      this.date = new Date().toLocaleDateString(this.timeFormat, {
        weekday: 'long', day: 'numeric', year: 'numeric', month: 'short',
      });
    },
  },
  created() {
    // Set initial date and time
    this.update();
    // Update the time and date every second (1000 ms)
    this.timeUpdateInterval = setInterval(this.update, 1000);
  },
  beforeDestroy() {
    // Remove the clock interval listener
    clearInterval(this.timeUpdateInterval);
  },
};
</script>

<style scoped lang="scss">
@font-face {
  font-family: 'Digital';
  src: url('/fonts/Digital-Regular.ttf');
}

.clock {
  padding: 0.5rem 0;
  .upper {
    display: flex;
    justify-content: space-between;
    border-radius: var(--curve-factor);
    padding: 0.5rem;
    opacity: 0.85;
    font-size: 0.8rem;
    background: var(--widget-accent-color);
  }
  p {
    color: var(--widget-text-color);
    cursor: default;
    margin: 0;
  }
  .time {
    font-size: 4rem;
    padding: 0.5rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
    font-family: Digital, var(--font-monospace);
  }
}

</style>
