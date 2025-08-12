<template>
  <a v-if="link" :href="link" target="_blank" rel="noopener" class="compact-card">
    <div class="card-header">
      <i v-if="icon" :class="icon" class="service-icon"></i>
      <h3 class="service-title">{{ title }}</h3>
      <div class="status-dot" :class="statusClass" :aria-label="`Status: ${status}`"></div>
    </div>
    <div v-if="hasMetrics" class="metrics">
      <span v-for="(metric, index) in displayMetrics" :key="index" class="metric">
        {{ metric.label }}: {{ metric.value }}
      </span>
    </div>
  </a>
  <div v-else class="compact-card no-link">
    <div class="card-header">
      <i v-if="icon" :class="icon" class="service-icon"></i>
      <h3 class="service-title">{{ title }}</h3>
      <div class="status-dot" :class="statusClass" :aria-label="`Status: ${status}`"></div>
    </div>
    <div v-if="hasMetrics" class="metrics">
      <span v-for="(metric, index) in displayMetrics" :key="index" class="metric">
        {{ metric.label }}: {{ metric.value }}
      </span>
    </div>
  </div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  computed: {
    title() {
      return this.options.title || 'Service';
    },
    icon() {
      return this.options.icon || 'fas fa-server';
    },
    link() {
      return this.options.link || this.options.url;
    },
    status() {
      return this.options.status || 'unknown';
    },
    statusClass() {
      const status = this.status.toLowerCase();
      return {
        'status-up': status === 'up' || status === 'online',
        'status-warn': status === 'warn' || status === 'warning',
        'status-down': status === 'down' || status === 'offline',
        'status-unknown': true, // 默认类
      };
    },
    metrics() {
      return this.options.metrics || [];
    },
    displayMetrics() {
      // 最多显示2个指标
      return this.metrics.slice(0, 2);
    },
    hasMetrics() {
      return this.displayMetrics.length > 0;
    },
  },
};
</script>

<style scoped lang="scss">
.compact-card {
  display: block;
  padding: 12px;
  background: var(--widget-accent-color);
  border: 1px solid var(--outline-color);
  border-radius: 6px;
  text-decoration: none;
  color: var(--widget-text-color);
  transition: all 0.2s ease;

  &:not(.no-link) {
    cursor: pointer;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  &.no-link {
    cursor: default;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.service-icon {
  font-size: 16px;
  color: var(--primary);
  flex-shrink: 0;
}

.service-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--widget-text-color);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;

  &.status-up {
    background-color: #22c55e;
  }

  &.status-warn {
    background-color: #eab308;
  }

  &.status-down {
    background-color: #ef4444;
  }

  &.status-unknown {
    background-color: #6b7280;
  }
}

.metrics {
  font-size: 12px;
  color: var(--widget-text-color);
  opacity: 0.8;

  .metric {
    display: inline-block;
    margin-right: 12px;
    font-family: var(--font-monospace);

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
