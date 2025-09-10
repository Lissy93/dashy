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
        // 连接本地系统API
        const apiUrl = 'http://127.0.0.1:8888/api/system';
        // eslint-disable-next-line no-console
        console.log('Fetching real system data from:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        // eslint-disable-next-line no-console
        console.log('Real system data received:', data);

        // 更新CPU数据
        if (data.cpu) {
          this.cpu = data.cpu.total || 0;
          this.cpuUser = data.cpu.user || 0;
          this.cpuSystem = data.cpu.system || 0;
          this.cpuIowait = data.cpu.iowait || 0;
          this.coreCount = data.cpu.count || 4;
          this.cpuModel = data.cpu.model || 'Unknown CPU';
        }

        // 更新内存数据
        if (data.memory) {
          this.memory = data.memory.percent || 0;
        }

        // 更新负载数据
        if (data.load) {
          this.load = data.load.avg_1 || 0;
        }

        // 更新系统信息
        if (data.system) {
          this.hostname = data.system.hostname || 'localhost';
          this.systemInfo = `${data.system.os_name || 'Unknown OS'} ${data.system.architecture || ''}`;
        }

        // 更新网络信息
        if (data.network) {
          this.ipAddress = `${data.network.ip || '127.0.0.1'}/24`;
        }

        // eslint-disable-next-line no-console
        console.log(`Real data - CPU: ${this.cpu}%, MEM: ${this.memory}%, LOAD: ${this.load}`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch real system data:', error);
        // eslint-disable-next-line no-console
        console.log('Please make sure system-api.py is running on http://127.0.0.1:8888');

        // 使用默认值
        this.cpu = 0;
        this.memory = 0;
        this.load = 0;
        this.cpuUser = 0;
        this.cpuSystem = 0;
        this.cpuIowait = 0;
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
