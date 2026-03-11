<template>
  <div class="glances-uptime-wrapper" v-if="secondsSinceBoot">
    <div class="format-selector">
      <label class="selector-label">Display Format:</label>
      <select class="format-dropdown" v-model="selectedFormat">
        <option value="auto">
          Auto (Smart Format)
        </option>
        <option value="full">
          Full (Days, Hours, Minutes, Seconds)
        </option>
        <option value="days">
          Days Only
        </option>
        <option value="hours">
          Hours Only
        </option>
        <option value="minutes">
          Minutes Only
        </option>
        <option value="seconds">
          Seconds Only
        </option>
        <option value="dhm">
          Days, Hours, Minutes
        </option>
        <option value="hms">
          Hours, Minutes, Seconds
        </option>
        <option value="compact">
          Compact (D:H:M:S)
        </option>
      </select>
    </div>

    <div class="uptime-row">
      <span class="lbl">Uptime</span>
      <span class="val">{{ formattedUptime }}</span>
    </div>
    <div class="uptime-row">
      <span class="lbl">Started Time</span>
      <span class="val">{{ formatStartTime(startTime) }}</span>
    </div>

    <div class="uptime-details" v-if="showDetails">
      <div class="detail-row" v-if="cpuData">
        <span class="lbl">CPU Usage</span>
        <span class="val">{{ cpuData.total.toFixed(1) }}%</span>
      </div>
      <div class="detail-row" v-if="memData">
        <span class="lbl">Memory</span>
        <span class="val">
      {{ ((memData.used / memData.total) * 100).toFixed(1) }}%
    </span>
      </div>
      <div class="detail-row" v-if="fsData && fsData.length">
        <span class="lbl">Storage</span>
        <span class="val">
      {{ ((fsData[0].used / fsData[0].size) * 100).toFixed(1) }}%
    </span>
      </div>
    </div>

    <div class="toggle-details">
      <button class="details-btn" @click="showDetails = !showDetails">
        {{ showDetails ? 'Hide Details' : 'Show Details' }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';

const UptimeUtils = {
  format(seconds, formatType = 'auto') {
    if (!seconds) return '';

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    switch (formatType) {
      case 'days':
        return `${Math.floor(seconds / 86400)} days`;

      case 'hours':
        return `${Math.floor(seconds / 3600)} hours`;

      case 'minutes':
        return `${Math.floor(seconds / 60)} minutes`;

      case 'seconds':
        return `${seconds} seconds`;

      case 'dhm':
        if (days > 0) {
          return `${days} days, ${hours} hours, ${minutes} minutes`;
        } else if (hours > 0) {
          return `${hours} hours, ${minutes} minutes`;
        } else {
          return `${minutes} minutes`;
        }

      case 'hms': {
        const totalHours = Math.floor(seconds / 3600);
        const mm = String(minutes).padStart(2, '0');
        const ss = String(secs).padStart(2, '0');
        return totalHours > 0 ? `${totalHours}:${mm}:${ss}` : `${mm}:${ss}`;
      }

      case 'compact':
        if (days > 0) {
          return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
        } else {
          return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
        }

      case 'full': {
        const hhFull = String(hours).padStart(2, '0');
        const mmFull = String(minutes).padStart(2, '0');
        const ssFull = String(secs).padStart(2, '0');
        return days > 0
          ? `${days} days, ${hhFull}:${mmFull}:${ssFull}`
          : `${hhFull}:${mmFull}:${ssFull}`;
      }

      case 'auto':
      default:
        if (days >= 30) {
          return `${days} days (${Math.floor(days / 30)} months)`;
        } else if (days >= 7) {
          return `${days} days (${Math.floor(days / 7)} weeks)`;
        } else if (days > 0) {
          const hhAuto = String(hours).padStart(2, '0');
          const mmAuto = String(minutes).padStart(2, '0');
          const ssAuto = String(secs).padStart(2, '0');
          return `${days} days, ${hhAuto}:${mmAuto}:${ssAuto}`;
        } else if (hours > 0) {
          const mmAuto = String(minutes).padStart(2, '0');
          const ssAuto = String(secs).padStart(2, '0');
          return `${hours}:${mmAuto}:${ssAuto}`;
        } else if (minutes > 0) {
          return `${minutes}:${String(secs).padStart(2, '0')}`;
        } else {
          return `${secs} seconds`;
        }
    }
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
      selectedFormat: 'auto',
      showDetails: false,
      cpuData: null,
      memData: null,
      fsData: null,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('uptime');
    },
    formattedUptime() {
      return UptimeUtils.format(this.secondsSinceBoot, this.selectedFormat);
    },
  },
  watch: {
    selectedFormat(newFormat) {
      try {
        localStorage.setItem('glances-uptime-format', newFormat);
      } catch (e) {
        console.warn('Failed to save uptime format preference:', e);
      }
    },
  },
  mounted() {
    try {
      const savedFormat = localStorage.getItem('glances-uptime-format');
      if (savedFormat) {
        this.selectedFormat = savedFormat;
      }
    } catch (e) {
      console.warn('Failed to load uptime format preference:', e);
    }

    this.fetchUptime();
    this.fetchDetails();
    this.refreshTimer = setInterval(() => {
      this.fetchUptime();
      this.fetchDetails();
    }, 5000);
  },
  beforeUnmount() {
    this.clearTimer('all');
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

    async fetchDetails() {
      try {
        const [cpuResp, memResp, fsResp] = await Promise.all([
          axios.get(this.makeGlancesUrl('cpu')),
          axios.get(this.makeGlancesUrl('mem')),
          axios.get(this.makeGlancesUrl('fs')),
        ]);

        this.cpuData = cpuResp.data;
        this.memData = memResp.data;
        this.fsData = fsResp.data;
      } catch (e) {
        console.warn('Failed to fetch details:', e);
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
};
</script>

<style scoped lang="scss">
.glances-uptime-wrapper {
  .format-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;

    .selector-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--widget-text-color);
      white-space: nowrap;
    }

    .format-dropdown {
      flex: 1;
      padding: 0.25rem 0.5rem;
      background: var(--widget-accent-color, #2a2a2a);
      color: var(--widget-text-color);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      font-size: 0.85rem;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: var(--primary-color, #007bff);
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }

      option {
        background: var(--widget-accent-color, #2a2a2a);
        color: var(--widget-text-color);
      }
    }
  }

  .uptime-row {
    display: flex;
    padding: 0.25rem 0.2rem;
    align-items: center;
    justify-content: space-between;
    color: var(--widget-text-color);

    .lbl {
      font-weight: bold;
    }

    .val {
      font-family: var(--font-monospace);
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-size: 0.9rem;
    }
  }

  .uptime-details {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
    border-left: 3px solid var(--primary-color, #007bff);

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.15rem 0;
      font-size: 0.85rem;
      color: var(--widget-text-color);
      opacity: 0.8;

      .lbl {
        font-weight: 500;
      }

      .val {
        font-family: var(--font-monospace);
        color: var(--primary-color, #007bff);
      }
    }
  }

  .toggle-details {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;

    .details-btn {
      padding: 0.3rem 0.8rem;
      background: rgba(255, 255, 255, 0.1);
      color: var(--widget-text-color);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }
    }
  }
}

@media (max-width: 768px) {
  .glances-uptime-wrapper {
    .format-selector {
      flex-direction: column;
      align-items: stretch;
      gap: 0.3rem;

      .selector-label {
        text-align: center;
      }
    }

    .uptime-row {
      flex-direction: column;
      gap: 0.2rem;
      text-align: center;

      .val {
        width: 100%;
        text-align: center;
      }
    }
  }
}

@media (prefers-color-scheme: dark) {
  .glances-uptime-wrapper {
    .format-selector {
      background: rgba(0, 0, 0, 0.3);

      .format-dropdown {
        background: #1a1a1a;
        border-color: rgba(255, 255, 255, 0.1);
      }
    }

    .uptime-details {
      background: rgba(0, 0, 0, 0.2);
    }

    .details-btn {
      background: rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }
}
</style>
