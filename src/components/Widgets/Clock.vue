<template>
<div class="clock">
  <div class="upper" v-if="!options.hideDate">
    <p class="city">{{ timeZone | getCity }}</p>
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
      timeUpdateInterval: null, // Stores setInterval function
      time: null, // Current time string
      date: null, // Current date string
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
  },
  filters: {
    /* For a given time zone, return just the city name */
    getCity(timeZone) {
      return timeZone.split('/')[1].replaceAll('_', ' ');
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
        second: 'numeric',
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
    // Update the date every hour, and the time each second
    this.timeUpdateInterval = setInterval(() => {
      this.setTime();
      const now = new Date();
      if (now.getMinutes() === 0 && now.getSeconds() === 0) {
        this.setDate();
      }
    }, 1000);
  },
  beforeDestroy() {
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
    font-family: Digital, var(--font-monospace);
  }
}

</style>
