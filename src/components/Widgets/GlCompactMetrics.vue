<template>
  <div class="metrics-wrapper">
    <div v-if="options.label" class="widget-label">
      {{ options.label }}
    </div>

    <!-- Compact table view -->
    <div v-if="!selectedSystem" class="compact-table">
      <div class="table-header">
        <div class="node-column">Node</div>
        <div class="metric-column">CPU</div>
        <div class="metric-column">Memory</div>
        <div class="metric-column">Disk</div>
      </div>

      <div class="table-body">
        <div
          v-for="(system, index) in options.systems"
          :key="index"
          class="table-row"
          @click="showSystemDetails(system)"
        >
          <div class="node-column">
            <div class="node-name">{{ system.header }}</div>
            <div class="node-ip">{{ system.url.replace(/^https?:\/\//, '') }}</div>
          </div>
          <div class="metric-column">
            <span class="metric-value" :class="getMetricClass('cpu', system.url)">
              {{ getMetricDisplay(system.url, 'cpu') }}
            </span>
          </div>
          <div class="metric-column">
            <span class="metric-value" :class="getMetricClass('mem', system.url)">
              {{ getMetricDisplay(system.url, 'mem') }}
            </span>
          </div>
          <div class="metric-column">
            <span class="metric-value" :class="getMetricClass('disk', system.url)">
              {{ getMetricDisplay(system.url, 'disk') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail view -->
    <div v-if="selectedSystem" class="detail-view">
      <div class="detail-header">
        <h3>{{ selectedSystem.header }}</h3>
        <button class="back-btn" @click="backToCompactView">
          Back
        </button>
      </div>

      <div class="detail-content" v-if="!errors[selectedSystem.url]">
        <div class="detail-section">
          <h4>System Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Hostname:</span>
              <span class="info-value">{{ detailData.system?.hostname || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">OS:</span>
              <span class="info-value">{{ detailData.system?.os_name || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Uptime:</span>
              <span class="info-value">{{ getUptimeDisplay() }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>CPU Usage</h4>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :class="getProgressClass(getMetricValue(selectedSystem.url, 'cpu') || 0)"
              :style="{ width: (getMetricValue(selectedSystem.url, 'cpu') || 0) + '%' }"
            ></div>
            <span class="progress-text">
              {{ getMetricValue(selectedSystem.url, 'cpu') !== null
              ? getMetricValue(selectedSystem.url, 'cpu') + '%' : '-' }}
            </span>
          </div>
        </div>

        <div class="detail-section">
          <h4>Memory Usage</h4>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :class="getProgressClass(getMetricValue(selectedSystem.url, 'mem') || 0)"
              :style="{ width: (getMetricValue(selectedSystem.url, 'mem') || 0) + '%' }"
            ></div>
            <span class="progress-text">
              {{ getMetricValue(selectedSystem.url, 'mem') !== null
              ? getMetricValue(selectedSystem.url, 'mem') + '%' : '-' }}
            </span>
          </div>
          <div class="memory-details" v-if="detailData.mem">
            <small>
              Used: {{ formatBytes(detailData.mem.used) }} /
              Total: {{ formatBytes(detailData.mem.total) }}
            </small>
          </div>
        </div>

        <div class="detail-section">
          <h4>Disk Usage</h4>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :class="getProgressClass(getMetricValue(selectedSystem.url, 'disk') || 0)"
              :style="{ width: (getMetricValue(selectedSystem.url, 'disk') || 0) + '%' }"
            ></div>
            <span class="progress-text">
              {{ getMetricValue(selectedSystem.url, 'disk') !== null
              ? getMetricValue(selectedSystem.url, 'disk') + '%' : '-' }}
            </span>
          </div>
        </div>

        <div class="detail-section" v-if="detailData.fs && detailData.fs.length > 0">
          <h4>Disk Partitions</h4>
          <div class="partition-list">
            <div v-for="(disk, index) in detailData.fs.filter(d => d.mnt_point && d.size > 0)"
                 :key="index" class="partition-item">
              <div class="partition-path">{{ disk.mnt_point }}</div>
              <div class="partition-usage">
                <span class="usage-text">
                  {{ formatBytes(disk.used || 0) }} / {{ formatBytes(disk.size || 0) }}
                </span>
                <span class="usage-percent"
                      :class="getUsageClass(
                        disk.size > 0 ? Math.round(((disk.used || 0) / disk.size) * 100)
                        : 0)">
                  ({{ disk.size > 0 ? Math.round(((disk.used || 0) / disk.size) * 100) : 0 }}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="errors[selectedSystem.url]" class="error-message">
        Unable to retrieve details for {{ selectedSystem.header }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      metricsData: {},
      detailData: {},
      loading: {},
      errors: {},
      refreshInterval: null,
      selectedSystem: null,
    };
  },
  computed: {
    refreshRate() {
      return this.options.refreshRate || 5000;
    },
  },
  mounted() {
    this.initializeSystems();
    this.fetchAllMetrics();
    this.startRefreshInterval();
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  methods: {
    initializeSystems() {
      this.options.systems.forEach((system) => {
        this.$set(this.metricsData, system.url, {});
        this.$set(this.loading, system.url, false);
        this.$set(this.errors, system.url, false);
      });
    },

    async fetchAllMetrics() {
      const promises = this.options.systems.map((system) => this.fetchSystemMetrics(system));
      await Promise.allSettled(promises);
    },

    async fetchSystemMetrics(system) {
      const { url } = system;
      this.$set(this.loading, url, true);
      // Don't reset error state here to prevent flickering

      try {
        const apiUrl = `${url.replace(/\/$/, '')}/api/4/all`;
        const response = await axios.get(apiUrl, { timeout: 8000 });
        this.processMetricsData(url, response.data);

        // Clear error state only on successful fetch
        this.$set(this.errors, url, false);

        // Update detail data if this system is currently selected
        if (this.selectedSystem && this.selectedSystem.url === url) {
          this.detailData = response.data;
        }
      } catch (error) {
        console.error(`Failed to fetch metrics for ${system.header}:`, error);
        this.$set(this.errors, url, true);

        // Clear detail data if this is the selected system and it fails
        if (this.selectedSystem && this.selectedSystem.url === url) {
          this.detailData = {};
        }
      } finally {
        this.$set(this.loading, url, false);
      }
    },

    processMetricsData(systemUrl, data) {
      const processedData = {};

      if (data.cpu) {
        processedData.cpu = Math.round(data.cpu.total || 0);
      }
      if (data.mem) {
        processedData.mem = Math.round(data.mem.percent || 0);
      }
      if (data.fs && Array.isArray(data.fs)) {
        let totalSize = 0;
        let totalUsed = 0;
        data.fs.forEach((disk) => {
          if (disk.size && disk.used) {
            totalSize += disk.size;
            totalUsed += disk.used;
          }
        });
        processedData.disk = totalSize > 0 ? Math.round((totalUsed / totalSize) * 100) : 0;
      }

      this.$set(this.metricsData, systemUrl, processedData);
    },

    getMetricValue(systemUrl, metric, defaultValue = null) {
      return this.metricsData[systemUrl]?.[metric] ?? defaultValue;
    },

    getMetricDisplay(systemUrl, metric) {
      // Display '-' if there's an error or no data available
      if (this.errors[systemUrl] || this.getMetricValue(systemUrl, metric) === null) {
        return '-';
      }
      return `${this.getMetricValue(systemUrl, metric)}%`;
    },

    getMetricClass(metric, systemUrl) {
      if (this.errors[systemUrl] || this.getMetricValue(systemUrl, metric) === null) {
        return 'error';
      }
      const value = this.getMetricValue(systemUrl, metric, 0);
      return this.getUsageClass(value);
    },

    // Three states: green (<50), orange (50-90), red (>90)
    getUsageClass(percentage) {
      if (percentage > 90) return 'critical';
      if (percentage >= 50) return 'warning';
      return 'good';
    },

    getProgressClass(percentage) {
      if (percentage > 90) return 'progress-critical';
      if (percentage >= 50) return 'progress-warning';
      return 'progress-good';
    },

    showSystemDetails(system) {
      this.selectedSystem = system;
      this.detailData = {}; // Clear previous data immediately
      this.fetchSystemDetails(system);
    },

    async fetchSystemDetails(system) {
      try {
        const apiUrl = `${system.url.replace(/\/$/, '')}/api/4/all`;
        const response = await axios.get(apiUrl, { timeout: 8000 });
        this.detailData = response.data;

        // Clear error state on successful fetch
        this.$set(this.errors, system.url, false);

        // Try to fetch uptime data separately
        try {
          const uptimeUrl = `${system.url.replace(/\/$/, '')}/api/4/uptime`;
          const uptimeResponse = await axios.get(uptimeUrl, { timeout: 5000 });
          this.detailData.uptimeData = uptimeResponse.data;
        } catch (uptimeError) {
          // Uptime API unavailable, will use alternative data sources
        }
      } catch (error) {
        console.error(`Failed to fetch details for ${system.header}:`, error);
        this.$set(this.errors, system.url, true);
        this.detailData = {}; // Clear detail data on error
      }
    },

    backToCompactView() {
      this.selectedSystem = null;
      this.detailData = {};
    },

    startRefreshInterval() {
      this.refreshInterval = setInterval(() => {
        this.fetchAllMetrics();
      }, this.refreshRate);
    },

    formatBytes(bytes) {
      if (bytes == null || isNaN(bytes)) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / (k ** i)).toFixed(1))} ${sizes[i]}`;
    },

    formatUptime(seconds) {
      if (!seconds || seconds <= 0) return '-';

      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      if (days > 0) {
        return `${days} days ${hours} hours ${minutes} minutes`;
      } else if (hours > 0) {
        return `${hours} hours ${minutes} minutes`;
      } else {
        return `${minutes} minutes`;
      }
    },

    getUptimeDisplay() {
      // Try different data sources in priority order
      let uptime = null;

      // 1. Dedicated uptime API data
      if (this.detailData.uptimeData) {
        uptime = this.detailData.uptimeData;
      } else if (this.detailData.uptime) {
        // 2. Uptime field (may be string format)
        uptime = this.detailData.uptime;

        if (typeof uptime === 'string') {
          return uptime;
        }
      } else if (this.detailData.system && this.detailData.system.uptime) {
        // 3. System object uptime
        uptime = this.detailData.system.uptime;
      } else if (this.detailData.boot_time) {
        // 4. Calculate from boot time
        const now = Date.now() / 1000;
        uptime = now - this.detailData.boot_time;
      }

      // Format if it's a number
      if (typeof uptime === 'number') {
        return this.formatUptime(uptime);
      }

      return '-';
    },
  },
};
</script>

<style scoped>
.metrics-wrapper {
  padding: 0.8rem;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.widget-label {
  margin-bottom: 0.8rem;
  font-weight: bold;
  font-size: 1.1rem;
}

/* Compact table styles */
.compact-table {
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.6rem 0;
  font-weight: bold;
  font-size: 0.85rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(2px);
}

.table-row:last-child {
  border-bottom: none;
}

.node-column {
  flex: 2;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-column {
  flex: 1;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.node-name {
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.2;
}

.node-ip {
  font-size: 0.7rem;
  color: #aaa;
  line-height: 1;
}

.metric-value {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.metric-value.good {
  color: #4CAF50;
}

.metric-value.warning {
  color: #FF9800;
}

.metric-value.critical {
  color: #F44336;
}

.metric-value.error {
  color: #BDBDBD;
}

/* Detail view styles */
.detail-view {
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.detail-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3));
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.detail-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.08));
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.detail-section h4 {
  margin: 0 0 0.6rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #E0E0E0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.4rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-label {
  color: #B0B0B0;
  font-weight: 500;
}

.info-value {
  color: #fff;
  font-weight: 600;
}

.progress-bar {
  position: relative;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-fill {
  height: 100%;
  transition: all 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-good {
  background: #4CAF50;
}

.progress-warning {
  background: #FF9800;
}

.progress-critical {
  background: #F44336;
  animation: criticalPulse 1.5s infinite alternate;
}

@keyframes criticalPulse {
  0% { opacity: 0.8; }
  100% { opacity: 1; }
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.memory-details,
.disk-details {
  margin-top: 0.4rem;
  color: #B0B0B0;
}

.partition-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 320px;
  overflow-y: auto;
}

.partition-item {
  padding: 0.6rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.06));
  border-radius: 8px;
  border-left: 4px solid #007bff;
  transition: all 0.3s ease;
}

.partition-path {
  font-size: 0.8rem;
  font-weight: 500;
  color: #fff;
  margin-bottom: 0.3rem;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.partition-usage {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
}

.usage-text {
  color: #ccc;
}

.usage-percent {
  font-weight: 600;
}

.good {
  color: #4CAF50 !important;
}

.warning {
  color: #FF9800 !important;
}

.critical {
  color: #F44336 !important;
}

.error-message {
  text-align: center;
  color: #EF5350;
  padding: 2rem;
  font-size: 0.9rem;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(244, 67, 54, 0.3);
}
</style>
