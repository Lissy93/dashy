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
      console.log('开始获取系统数据...');
      try {
        console.log('正在连接 http://localhost:61208/');
        const response = await fetch('http://localhost:61208/');
        console.log('API响应状态:', response.status);
        
        if (!response.ok) throw new Error(`API响应错误: ${response.status}`);
        
        const data = await response.json();
        console.log('收到的数据:', data);
        
        // Update CPU
        if (data.cpu) {
          this.cpu = data.cpu.total || 0;
          console.log('CPU使用率:', this.cpu + '%');
        }
        
        // Update Memory
        if (data.mem) {
          this.memory = data.mem.percent || 0;
          console.log('内存使用率:', this.memory + '%');
        }
        
        // Update Load
        if (data.load) {
          this.load = data.load.min1 || 0;
          console.log('系统负载:', this.load);
        }
        
        // Update System Info
        if (data.system) {
          this.hostname = data.system.hostname || 'localhost';
          this.osInfo = data.system.os_name || 'Unknown OS';
          console.log('主机名:', this.hostname);
          console.log('系统信息:', this.osInfo);
        }
        
        console.log('数据更新完成!');
        
      } catch (error) {
        console.error('连接API失败:', error);
        console.log('错误详情:', error.message);
        this.hostname = '连接失败';
        this.osInfo = '请运行 python system-api.py';
      }
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