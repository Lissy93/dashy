<template>
  <div class="glances-uptime-wrapper" v-if="secondsSinceBoot">
    <div class="uptime-row">
      <span class="lbl">Uptime</span>
      <span class="val">{{ formattedUptime }}</span>
    </div>
    <div class="uptime-row">
      <span class="lbl">Started Time</span>
      <span class="val">{{ formatStartTime(startTime) }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';

const UptimeUtils = {
  format(seconds) {
    if (!seconds) return '';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');

    return days > 0 ? `${days} days, ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`;
  },

  parse(str) {
    const regex = /(?:(\d+)\s+days?,\s*)?(\d+):(\d+):(\d+)/;
    const match = str.match(regex);
    if (!match) return null;
    const [, d, h, m, s] = match;
    return (parseInt(d || 0, 10) * 86400)
        + (parseInt(h, 10) * 3600)
        + (parseInt(m, 10) * 60)
        + parseInt(s, 10);
  },
};

export default {
  name: 'GlancesUptime',
  mixins: [WidgetMixin, GlancesMixin],
  data() {
    return {
      secondsSinceBoot: 0,
      startTime: null,
      refreshTimer: null,
      realtimeTimer: null,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('uptime');
    },
    formattedUptime() {
      return UptimeUtils.format(this.secondsSinceBoot);
    },
  },
  methods: {
    async fetchUptime() {
      try {
        const resp = await axios.get(this.endpoint);
        this.processData(resp.data);
      } catch {
        this.error('Failed to fetch uptime');
      }
    },

    processData(resp) {
      let seconds = 0;

      if (typeof resp === 'number') {
        seconds = resp;
      } else if (typeof resp === 'string') {
        seconds = UptimeUtils.parse(resp) || 0;
      } else if (resp && typeof resp === 'object') {
        if (typeof resp.uptime === 'number') {
          seconds = resp.uptime;
        } else if (resp.uptime_string) {
          seconds = UptimeUtils.parse(resp.uptime_string) || 0;
        }
      }

      this.secondsSinceBoot = seconds;
      if (!this.startTime) {
        this.startTime = Math.floor(Date.now() / 1000) - seconds;
      }

      if (seconds) this.startRealtimeCounter();
    },

    formatStartTime(ts) {
      if (!ts) return 'N/A';
      return new Date(ts * 1000).toLocaleString();
    },

    startRealtimeCounter() {
      this.clearTimer('realtime');
      this.realtimeTimer = setInterval(() => {
        this.secondsSinceBoot += 1;
      }, 1000);
    },

    clearTimer(type = 'all') {
      if (type === 'all' || type === 'refresh') {
        if (this.refreshTimer) clearInterval(this.refreshTimer);
        this.refreshTimer = null;
      }
      if (type === 'all' || type === 'realtime') {
        if (this.realtimeTimer) clearInterval(this.realtimeTimer);
        this.realtimeTimer = null;
      }
    },
  },
  mounted() {
    this.fetchUptime();
    this.refreshTimer = setInterval(this.fetchUptime, 5000);
  },
  beforeUnmount() {
    this.clearTimer('all');
  },
};
</script>

<style scoped lang="scss">
.glances-uptime-wrapper {
  .uptime-row {
    display: flex;
    padding: 0.25rem 0.2rem;
    align-items: center;
    justify-content: space-between;
    color: var(--widget-text-color);
    span.lbl {
      font-weight: bold;
    }
    span.val {
      font-family: var(--font-monospace);
    }
  }
}
</style>
