<template>
  <div class="gl-compact-metrics">
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
          v-for="(system, index) in systems"
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
        <button class="back-btn" @click="backToCompactView">Back</button>
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
              <span class="info-value">{{ uptimeDisplay }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section" v-for="m in detailMetrics" :key="m.key">
          <h4>{{ m.title }}</h4>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :class="progressClass(m.value)"
              :style="{ width: (m.value || 0) + '%' }"
            ></div>
            <span class="progress-text">{{ m.value !== null ? m.value + '%' : '-' }}</span>
          </div>
          <div class="memory-details" v-if="m.key === 'mem' && detailData.mem">
            <small>
              Used: {{ formatSize(detailData.mem.used) }} /
              Total: {{ formatSize(detailData.mem.total) }}
            </small>
          </div>
        </div>

        <div class="detail-section" v-if="filteredPartitions.length > 0">
          <h4>Disk Partitions</h4>
          <div class="partition-list">
            <div v-for="(disk, index) in filteredPartitions" :key="index" class="partition-item">
              <div class="partition-path">{{ disk.mnt_point }}</div>
              <div class="partition-usage">
                <span class="usage-text">
                  {{ formatSize(disk.used) }} / {{ formatSize(disk.size) }}
                </span>
                <span class="usage-percent" :class="usageClass(diskPercent(disk))">
                  ({{ diskPercent(disk) }}%)
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
import { convertBytes } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      metricsData: {},
      detailData: {},
      errors: {},
      selectedSystem: null,
    };
  },
  computed: {
    systems() {
      if (!this.options.systems || !Array.isArray(this.options.systems)) {
        this.error(
          'You must specify a \'systems\' array for GlCompactMetrics',
        );
        return [];
      }
      return this.options.systems;
    },
    apiVersion() {
      return this.options.apiVersion || 4;
    },
    filteredPartitions() {
      if (!this.detailData.fs) return [];
      return this.detailData.fs.filter(d => d.mnt_point && d.size > 0);
    },
    detailMetrics() {
      if (!this.selectedSystem) return [];
      const { url } = this.selectedSystem;
      return [
        { key: 'cpu', title: 'CPU Usage', value: this.getMetricValue(url, 'cpu') },
        { key: 'mem', title: 'Memory Usage', value: this.getMetricValue(url, 'mem') },
        { key: 'disk', title: 'Disk Usage', value: this.getMetricValue(url, 'disk') },
      ];
    },
    uptimeDisplay() {
      const { uptime } = this.detailData;
      if (uptime && typeof uptime === 'string') return uptime;
      return '-';
    },
  },
  methods: {
    formatSize(bytes) {
      if (!bytes) return '0 Bytes';
      return convertBytes(bytes);
    },
    fetchData() {
      this.systems.forEach((system) => {
        if (!this.metricsData[system.url]) {
          this.metricsData[system.url] = {};
          this.errors[system.url] = false;
        }
      });
      this.fetchAllMetrics();
    },

    makeSystemUrl(systemUrl, path) {
      return `${systemUrl.replace(/\/$/, '')}/api/${this.apiVersion}/${path}`;
    },

    requestConfig(endpoint) {
      const headers = {};
      if (this.options.username && this.options.password) {
        const creds = `${this.options.username}:${this.options.password}`;
        headers.Authorization = `Basic ${window.btoa(creds)}`;
      }
      if (this.useProxy) {
        return {
          url: this.proxyReqEndpoint,
          headers: { 'Target-URL': endpoint, CustomHeaders: JSON.stringify(headers) },
        };
      }
      return { url: endpoint, headers };
    },

    async fetchSystemData(endpoint) {
      const config = this.requestConfig(endpoint);
      const response = await axios.get(config.url, {
        headers: config.headers,
        timeout: this.options.timeout || 8000,
      });
      return response.data;
    },

    async fetchAllMetrics() {
      const promises = this.systems.map(
        (system) => this.fetchSystemMetrics(system),
      );
      await Promise.allSettled(promises);
      this.finishLoading();
    },

    async fetchSystemMetrics(system) {
      const { url } = system;
      try {
        const data = await this.fetchSystemData(
          this.makeSystemUrl(url, 'all'),
        );
        this.processMetricsData(url, data);
        this.errors[url] = false;
        if (this.selectedSystem && this.selectedSystem.url === url) {
          this.detailData = data;
        }
      } catch (_) {
        this.errors[url] = true;
        if (this.selectedSystem && this.selectedSystem.url === url) {
          this.detailData = {};
        }
      }
    },

    processMetricsData(systemUrl, data) {
      const processed = {};
      if (data.cpu) processed.cpu = Math.round(data.cpu.total || 0);
      if (data.mem) processed.mem = Math.round(data.mem.percent || 0);
      if (data.fs && Array.isArray(data.fs)) {
        let totalSize = 0;
        let totalUsed = 0;
        data.fs.forEach((disk) => {
          if (disk.size && disk.used) {
            totalSize += disk.size;
            totalUsed += disk.used;
          }
        });
        processed.disk = totalSize > 0
          ? Math.round((totalUsed / totalSize) * 100) : 0;
      }
      this.metricsData[systemUrl] = processed;
    },

    getMetricValue(systemUrl, metric) {
      return this.metricsData[systemUrl]?.[metric] ?? null;
    },

    getMetricDisplay(systemUrl, metric) {
      if (this.errors[systemUrl]
        || this.getMetricValue(systemUrl, metric) === null) return '-';
      return `${this.getMetricValue(systemUrl, metric)}%`;
    },

    getMetricClass(metric, systemUrl) {
      if (this.errors[systemUrl]
        || this.getMetricValue(systemUrl, metric) === null) return 'error';
      return this.usageClass(this.getMetricValue(systemUrl, metric));
    },

    usageClass(pct) {
      if (pct > 90) return 'critical';
      if (pct >= 50) return 'warning';
      return 'good';
    },

    progressClass(pct) {
      if (pct > 90) return 'progress-critical';
      if (pct >= 50) return 'progress-warning';
      return 'progress-good';
    },

    diskPercent(disk) {
      return disk.size > 0
        ? Math.round(((disk.used || 0) / disk.size) * 100) : 0;
    },

    showSystemDetails(system) {
      this.selectedSystem = system;
      this.detailData = {};
      this.fetchSystemDetails(system);
    },

    async fetchSystemDetails(system) {
      try {
        const data = await this.fetchSystemData(
          this.makeSystemUrl(system.url, 'all'),
        );
        this.detailData = data;
        this.errors[system.url] = false;
      } catch (_) {
        this.errors[system.url] = true;
        this.detailData = {};
      }
    },

    backToCompactView() {
      this.selectedSystem = null;
      this.detailData = {};
    },
  },
  created() {
    this.overrideUpdateInterval = 5;
  },
};
</script>

<style scoped lang="scss">
.gl-compact-metrics {
  color: var(--widget-text-color);
}

.compact-table {
  border-radius: var(--curve-factor);
  overflow: hidden;
  background: var(--widget-accent-color);
}

.table-header {
  display: flex;
  padding: 0.6rem 0;
  font-weight: bold;
  font-size: 0.85rem;
  border-bottom: 2px solid var(--widget-accent-color);
  opacity: 0.8;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--widget-accent-color);
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover { background: var(--widget-accent-color); }
  &:last-child { border-bottom: none; }
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
}

.node-name {
  font-weight: 600;
  font-size: 0.85rem;
  line-height: 1.2;
}

.node-ip {
  font-size: 0.7rem;
  opacity: 0.6;
  line-height: 1;
}

.metric-value {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--curve-factor);
  &.good { color: var(--success); }
  &.warning { color: var(--warning); }
  &.critical { color: var(--danger); }
  &.error { opacity: 0.5; }
}

.detail-view {
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
  border-bottom: 2px solid var(--widget-accent-color);
  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: bold;
  }
}

.back-btn {
  background: var(--widget-accent-color);
  color: var(--widget-text-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--curve-factor);
  cursor: pointer;
  font-size: 0.8rem;
  &:hover { opacity: 0.8; }
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-section {
  background: var(--widget-accent-color);
  padding: 1rem;
  border-radius: var(--curve-factor);
  h4 {
    margin: 0 0 0.6rem 0;
    font-size: 0.9rem;
    font-weight: 600;
    opacity: 0.8;
  }
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
  border-bottom: 1px solid var(--widget-accent-color);
}

.info-label { opacity: 0.7; }
.info-value { font-weight: 600; }

.progress-bar {
  position: relative;
  height: 24px;
  background: var(--widget-accent-color);
  border-radius: var(--curve-factor);
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.progress-good { background: var(--success); }
.progress-warning { background: var(--warning); }
.progress-critical { background: var(--danger); }

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
}

.memory-details {
  margin-top: 0.4rem;
  opacity: 0.7;
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
  background: var(--widget-background-color);
  border-radius: var(--curve-factor);
  border-left: 3px solid var(--widget-text-color);
}

.partition-path {
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
  font-family: var(--font-monospace);
  word-break: break-all;
}

.partition-usage {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
}

.usage-percent {
  font-weight: 600;
  &.good { color: var(--success); }
  &.warning { color: var(--warning); }
  &.critical { color: var(--danger); }
}

.error-message {
  text-align: center;
  color: var(--danger);
  padding: 2rem;
  font-size: 0.9rem;
  background: var(--widget-accent-color);
  border-radius: var(--curve-factor);
}
</style>
