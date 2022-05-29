<template>
<div class="ad-guard-filter-status-wrapper">
  <!-- Current Status -->
  <div v-if="status !== null && showOnOffStatusOnly" class="status">
    <span class="status-lbl">{{ $t('widgets.pi-hole.status-heading') }}:</span>
    <span :class="`status-val ${getStatusColor(status)}`">
      {{ status ? 'Enabled' : 'Disabled' }}
    </span>
  </div>
  <!-- List of filters -->
  <div v-if="filters && !showOnOffStatusOnly" class="filters-list">
    <div v-for="filter in filters" :key="filter.id" class="filter">
      <!-- Filter status, name and query count -->
      <div class="row-1">
        <span :class="`on-off ${filter.enabled ? 'green' : 'red'}`">
          {{ filter.enabled ? '✔' : '✘' }}
        </span>
        <span class="filter-name">{{ filter.name }}</span>
        <span class="filter-rules-count">{{ filter.rules_count }}</span>
      </div>
      <!-- Date of last update, and link to list -->
      <div class="row-2">
        <span class="updated">Updated {{ filter.last_updated | formatDate }}</span>
        <a class="filter-link" v-if="filter.url" :href="filter.url">View List</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { getTimeAgo } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  computed: {
    /* URL/ IP or hostname to the AdGuardHome instance, without trailing slash */
    hostname() {
      if (!this.options.hostname) this.error('You must specify the path to your AdGuard server');
      return this.options.hostname;
    },
    showOnOffStatusOnly() {
      return this.options.showOnOffStatusOnly;
    },
    endpoint() {
      return `${this.hostname}/control/filtering/status`;
    },
    authHeaders() {
      if (this.options.username && this.options.password) {
        const encoded = window.btoa(`${this.options.username}:${this.options.password}`);
        return { Authorization: `Basic ${encoded}` };
      }
      return {};
    },
  },
  data() {
    return {
      status: null,
      filters: null,
    };
  },
  filters: {
    formatDate(date) {
      if (!date) return 'Never';
      return getTimeAgo(date);
    },
  },
  methods: {
    /* Make GET request to AdGuard endpoint */
    fetchData() {
      this.makeRequest(this.endpoint, this.authHeaders).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.status = data.enabled;
      this.filters = data.filters;
    },
    getStatusColor(status) {
      return status ? 'green' : 'red';
    },
  },
};
</script>

<style lang="scss">
.ad-guard-filter-status-wrapper {
  .status {
    margin: 0.5rem 0;
    font-size: 1.1rem;
    .status-lbl {
      color: var(--widget-text-color);
      font-weight: bold;
    }
    .status-val {
      font-family: var(--font-monospace);
      &.green { color: var(--success); }
      &.red { color: var(--danger); }
      &.blue { color: var(--info); }
    }
  }
  .filters-list {
    .filter {
      display: flex;
      flex-direction: column;
      color: var(--widget-text-color);
      padding: 0.25rem 0.1rem;
      .row-1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.on-off {
          margin-right: 0.5rem;
          &.green { color: var(--success); }
          &.red { color: var(--danger); }
        }
        span.filter-name {
          width: 100%;
          overflow: hidden;
          white-space: pre;
          text-overflow: ellipsis;
        }
        span.rules_count {
          font-family: var(--font-monospace);
        }
      }
      .row-2 {
        display: flex;
        justify-content: space-between;
        span.updated, a.filter-link {
          margin: 0.2rem 0;
          font-size: 0.8rem;
          opacity: var(--dimming-factor);
          color: var(--widget-text-color);
        }
      }
      &:not(:last-child) {
        border-bottom: 1px dashed var(--widget-text-color);
      }
    }
  }
}
</style>
