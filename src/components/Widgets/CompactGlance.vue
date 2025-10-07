<template>
  <div class="compact-glance">
    <div class="system-info">
      <div class="hostname">{{ hostname }}</div>
      <div class="os-info">{{ osInfo }}</div>
    </div>
    <div class="metrics">
      <div class="metric">
        <span class="label">CPU</span>
        <div class="bar">
          <div class="fill cpu-fill" :style="{ width: cpu + '%' }"></div>
        </div>
        <span class="value">{{ cpu.toFixed(1) }}%</span>
      </div>
      <div class="metric">
        <span class="label">MEM</span>
        <div class="bar">
          <div class="fill mem-fill" :style="{ width: memory + '%' }"></div>
        </div>
        <span class="value">{{ memory.toFixed(1) }}%</span>
      </div>
      <div class="metric">
        <span class="label">LOAD</span>
        <div class="bar">
          <div class="fill load-fill" :style="{ width: loadPercent + '%' }"></div>
        </div>
        <span class="value">{{ load.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompactGlance',
  props: {
    title: String,
    options: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      cpu: 0,
      memory: 0,
      load: 0,
      hostname: 'localhost',
      osInfo: 'Windows',
      coreCount: 4,
      timer: null,
    };
  },
  computed: {
    loadPercent() {
      return Math.min(100, (this.load / this.coreCount) * 100);
    },
  },
  methods: {
    async fetchSystemData() {
      console.log('=== Fetching System Information ===');

      // Use browser native APIs to get system information
      try {
        // Get system information
        this.hostname = window.location.hostname || 'localhost';
        this.osInfo = this.getOSInfo();

        console.log('Hostname:', this.hostname);
        console.log('Operating System:', this.osInfo);

        // Simulate system load data (based on time and random factors)
        const now = Date.now();
        const timeBasedValue = (Math.sin(now / 10000) + 1) * 50; // 0-100 cyclic variation

        this.cpu = Math.max(5, Math.min(95, timeBasedValue + Math.random() * 20 - 10));
        this.memory = Math.max(10, Math.min(90, timeBasedValue * 0.8 + Math.random() * 15));
        this.load = Math.max(0.1, Math.min(4, timeBasedValue / 25 + Math.random() * 0.5));

        console.log('CPU Usage:', `${this.cpu.toFixed(1)}%`);
        console.log('Memory Usage:', `${this.memory.toFixed(1)}%`);
        console.log('System Load:', this.load.toFixed(2));

        // Try to get more system information if supported
        if (navigator.deviceMemory) {
          // Estimate memory usage based on device memory
          const { deviceMemory } = navigator; // GB
          this.memory = Math.min(90, 30 + (8 - deviceMemory) * 10);
          console.log('Device Memory Detected:', `${deviceMemory}GB`);
          console.log('Adjusted Memory Usage:', `${this.memory.toFixed(1)}%`);
        }

        if (navigator.hardwareConcurrency) {
          this.coreCount = navigator.hardwareConcurrency;
          console.log('CPU Cores:', this.coreCount);
        }

        console.log('=== System Information Updated ===');
      } catch (error) {
        console.error('Error fetching system information:', error);
        this.hostname = 'Unknown';
        this.osInfo = 'Browser Environment';
      }
    },

    getOSInfo() {
      const { userAgent } = navigator;
      let os = 'Unknown OS';

      if (userAgent.indexOf('Windows NT 10.0') !== -1) os = 'Windows 10/11';
      else if (userAgent.indexOf('Windows NT 6.3') !== -1) os = 'Windows 8.1';
      else if (userAgent.indexOf('Windows NT 6.2') !== -1) os = 'Windows 8';
      else if (userAgent.indexOf('Windows NT 6.1') !== -1) os = 'Windows 7';
      else if (userAgent.indexOf('Windows') !== -1) os = 'Windows';
      else if (userAgent.indexOf('Mac OS X') !== -1) os = 'macOS';
      else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
      else if (userAgent.indexOf('Android') !== -1) os = 'Android';
      else if (userAgent.indexOf('iOS') !== -1) os = 'iOS';

      return os;
    },
  },
  mounted() {
    this.fetchSystemData();
    this.timer = setInterval(this.fetchSystemData, 5000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style scoped>
.compact-glance {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  color: white;
  font-family: monospace;
}

.system-info {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #444;
}

.hostname {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.os-info {
  font-size: 12px;
  opacity: 0.7;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  min-width: 50px;
  font-weight: bold;
  font-size: 14px;
}

.bar {
  flex: 1;
  height: 16px;
  background: #1a1a1a;
  border-radius: 4px;
  overflow: hidden;
}

.fill {
  height: 100%;
  transition: width 0.3s ease;
}

.cpu-fill {
  background: #4CAF50;
}

.mem-fill {
  background: #FF9800;
}

.load-fill {
  background: #2196F3;
}

.value {
  min-width: 60px;
  text-align: right;
  font-weight: bold;
  font-size: 14px;
}
</style>
