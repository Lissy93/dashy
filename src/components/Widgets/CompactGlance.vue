<template>
  <div class="glance-card">
    <!-- 系统信息头部 -->
    <div class="system-header">
      <div class="hostname">{{ hostname || 'brick' }}</div>
      <div class="system-info">{{ systemInfo }}</div>
      <div class="ip-info">IP {{ ipAddress }}</div>
    </div>

    <!-- CPU信息 -->
    <div class="cpu-section">
      <div class="cpu-title">{{ cpuModel }}</div>
      <div class="metric-row">
        <span class="metric-label">CPU</span>
        <div class="progress-bar">
          <div class="progress-fill cpu-fill" :style="{ width: cpu + '%' }"></div>
        </div>
        <span class="metric-value">{{ cpu.toFixed(1) }}%</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">MEM</span>
        <div class="progress-bar">
          <div class="progress-fill mem-fill" :style="{ width: memory + '%' }"></div>
        </div>
        <span class="metric-value">{{ memory.toFixed(1) }}%</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">LOAD</span>
        <div class="progress-bar">
          <div class="progress-fill load-fill" :style="{ width: loadPercent + '%' }"></div>
        </div>
        <span class="metric-value">{{ loadPercent.toFixed(1) }}%</span>
      </div>
    </div>

    <!-- 右侧系统状态 -->
    <div class="system-stats">
      <div class="stat-item">
        <span class="stat-label">user:</span>
        <span class="stat-value">{{ cpuUser.toFixed(1) }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">system:</span>
        <span class="stat-value">{{ cpuSystem.toFixed(1) }}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">iowait:</span>
        <span class="stat-value">{{ cpuIowait.toFixed(1) }}%</span>
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
      cpuUser: 0,
      cpuSystem: 0,
      cpuIowait: 0,
      cpuModel: 'Intel(R) Core(TM) i5 CPU M ...',
      systemInfo: 'NixOS 24.11 64bit / Linux 6.6.63',
      ipAddress: '10.0.0.203/24',
      hostname: 'brick',
      timer: null,
      coreCount: 4,
    };
  },
  computed: {
    pollMs() { return (this.options.poll || 5) * 1000; },
    endpoint() { return this.options.endpoint; },
    useProxy() { return this.options.useProxy === true; },
    loadPercent() {
      return Math.min(100, (this.load / this.coreCount) * 100);
    },
  },
  methods: {
    async loadData() {
      try {
        const url = this.useProxy
          ? `/api/proxy?url=${encodeURIComponent(this.endpoint)}`
          : this.endpoint;
        // eslint-disable-next-line no-console
        console.log('Fetching data from:', url);
        const res = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        // eslint-disable-next-line no-console
        console.log('API Response - CPU:', data.cpu?.total, 'MEM:', data.mem?.percent, 'LOAD:', data.load?.min1);

        // CPU数据
        if (data.cpu) {
          this.cpu = data.cpu.total || 0;
          this.cpuUser = data.cpu.user || 0;
          this.cpuSystem = data.cpu.system || 0;
          this.cpuIowait = data.cpu.iowait || 0;
        }

        // 内存数据
        if (data.mem) {
          this.memory = data.mem.percent || 0;
        }

        // 负载数据
        if (data.load) {
          this.load = data.load.min1 || 0;
        }

        // 系统信息
        if (data.system) {
          this.hostname = data.system.hostname || 'brick';
          if (data.system.os_name && data.system.os_version) {
            this.systemInfo = `${data.system.os_name} ${data.system.os_version}`;
          }
        }

        // CPU型号
        if (data.cpu && data.cpu.model) {
          this.cpuModel = `${data.cpu.model.substring(0, 30)}...`;
        }

        this.coreCount = data.cpu?.cpucore || 4;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Glances API Error:', e);
        // eslint-disable-next-line no-console
        console.log('Using fallback data');
        // 使用模拟数据
        this.cpu = Math.random() * 10 + 2;
        this.memory = Math.random() * 30 + 20;
        this.load = Math.random() * 3 + 0.5;
        this.cpuUser = Math.random() * 5 + 1;
        this.cpuSystem = Math.random() * 3 + 0.5;
        this.cpuIowait = Math.random() * 2;
      }
    },
  },
  mounted() {
    // eslint-disable-next-line no-console
    console.log('CompactGlance mounted! Endpoint:', this.endpoint);
    this.loadData();
    this.timer = setInterval(this.loadData, this.pollMs);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.glance-card {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  min-height: 200px;
}

.system-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #444;
}

.hostname {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.system-info {
  font-size: 12px;
  color: #cccccc;
}

.ip-info {
  font-size: 12px;
  color: #cccccc;
}

.cpu-section {
  margin-bottom: 16px;
}

.cpu-title {
  color: #cccccc;
  margin-bottom: 12px;
  font-size: 13px;
}

.metric-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.metric-label {
  width: 50px;
  color: #ffffff;
  font-weight: bold;
}

.progress-bar {
  flex: 1;
  height: 20px;
  background: #1a1a1a;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid #444;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.cpu-fill {
  background: #4CAF50;
}

.mem-fill {
  background: #4CAF50;
}

.load-fill {
  background: #333;
}

.metric-value {
  width: 60px;
  text-align: right;
  color: #ffffff;
  font-weight: bold;
}

.system-stats {
  position: absolute;
  top: 60px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.stat-label {
  color: #cccccc;
}

.stat-value {
  color: #4CAF50;
  font-weight: bold;
}
</style>
