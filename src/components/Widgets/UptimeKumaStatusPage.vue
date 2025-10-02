<template>
  <div @click="openStatusPage" class="clickable-widget">
    <template v-if="errorMessage">
      <div class="error-message">
        <span class="text">{{ errorMessage }}</span>
      </div>
    </template>
    <template v-else-if="lastHeartbeats">
      <div
        v-for="(heartbeat, index) in lastHeartbeats"
        :key="index"
        class="item-wrapper"
      >
        <div class="item monitor-row">
          <div class="title-title">
            <span class="text">
              {{
                monitorNames && monitorNames[index]
                  ? monitorNames[index]
                  : `Monitor ${index + 1}`
              }}
            </span>
          </div>
          <div class="monitors-container">
            <div class="status-container">
              <span
                class="status-pill"
                :class="getStatusClass(heartbeat.status)"
              >
                {{ getStatusText(heartbeat.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      lastHeartbeats: null,
      errorMessage: null,
      errorMessageConstants: {
        missingHost: 'No host set',
        missingSlug: 'No slug set',
      },
    };
  },
  computed: {
    host() {
      return this.parseAsEnvVar(this.options.host);
    },
    slug() {
      return this.parseAsEnvVar(this.options.slug);
    },
    monitorNames() {
      return this.options.monitorNames || [];
    },
    endpoint() {
      return `${this.host}/api/status-page/heartbeat/${this.slug}`;
    },
    statusPageUrl() {
      return `${this.host}/status/${this.slug}`;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    update() {
      this.startLoading();
      this.fetchData();
    },
    fetchData() {
      const { host, slug } = this;
      if (!this.optionsValid({ host, slug })) {
        return;
      }
      this.makeRequest(this.endpoint)
        .then(this.processData)
        .catch((error) => {
          this.errorMessage = error.message || 'Failed to fetch data';
        });
    },
    processData(response) {
      const { heartbeatList } = response;
      const lastHeartbeats = [];
      // Use Object.keys to safely iterate over heartbeatList
      Object.keys(heartbeatList).forEach((monitorId) => {
        const heartbeats = heartbeatList[monitorId];
        if (heartbeats.length > 0) {
          const lastHeartbeat = heartbeats[heartbeats.length - 1];
          lastHeartbeats.push(lastHeartbeat);
        }
      });
      this.lastHeartbeats = lastHeartbeats;
    },
    optionsValid({ host, slug }) {
      const errors = [];
      if (!host) errors.push(this.errorMessageConstants.missingHost);
      if (!slug) errors.push(this.errorMessageConstants.missingSlug);
      if (errors.length > 0) {
        this.errorMessage = errors.join('\n');
        return false;
      }
      return true;
    },
    openStatusPage() {
      window.open(this.statusPageUrl, '_blank');
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return 'Up';
        case 0:
          return 'Down';
        case 2:
          return 'Pending';
        case 3:
          return 'Maintenance';
        default:
          return 'Unknown';
      }
    },
    getStatusClass(status) {
      switch (status) {
        case 1:
          return 'up';
        case 0:
          return 'down';
        case 2:
          return 'pending';
        case 3:
          return 'maintenance';
        default:
          return 'unknown';
      }
    },
  },
};
</script>

<style scoped lang="scss">
.clickable-widget {
  cursor: pointer;
}
.status-pill {
  border-radius: 50em;
  box-sizing: border-box;
  font-size: 0.75em;
  display: inline-block;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  padding: 0.35em 0.65em;
  margin: 0.1em 0.5em;
  min-width: 64px;
  &.up {
    background-color: #5cdd8b;
    color: black;
  }
  &.down {
    background-color: #dc3545;
    color: white;
  }
  &.pending {
    background-color: #f8a306;
    color: black;
  }
  &.maintenance {
    background-color: #1747f5;
    color: white;
  }
  &.unknown {
    background-color: gray;
    color: white;
  }
}
.monitor-row {
  display: flex;
  justify-content: space-between;
  padding: 0.35em 0.5em;
  align-items: center;
}
.title-title {
  font-weight: bold;
}
.error-message {
  color: red;
  font-weight: bold;
}
</style>
