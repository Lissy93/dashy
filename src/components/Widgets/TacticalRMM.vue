<template>
  <div class="status-section">
    <template v-if="statusData">
      <div class="status-wrapper">
        <div class="status-item">
          <div class="title">Version</div>
          <div class="value">{{ statusData.version }}</div>
        </div>
        <div class="status-item">
          <div class="title">Agent Count</div>
          <div class="value">{{ statusData.agent_count }}</div>
        </div>
        <div class="status-item">
          <div class="title">Client Count</div>
          <div class="value">{{ statusData.client_count }}</div>
        </div>
        <div class="status-item">
          <div class="title">Site Count</div>
          <div class="value">{{ statusData.site_count }}</div>
        </div>
        <div class="status-item">
          <div class="title">Disk Usage</div>
          <div class="value">{{ statusData.disk_usage_percent }}%</div>
        </div>
        <div class="status-item">
          <div class="title">Memory Usage</div>
          <div class="value">{{ statusData.mem_usage_percent }}%</div>
        </div>
        <div class="status-item">
          <div class="title">Days Until Cert Expires</div>
          <div class="value">{{ statusData.days_until_cert_expires }}</div>
        </div>
        <div class="status-item">
          <div class="title">Cert Expired</div>
          <div class="value">{{ statusData.cert_expired ? 'Yes' : 'No' }}</div>
        </div>
        <div class="status-item">
          <div class="title">Celery Queue Length</div>
          <div class="value">{{ statusData.celery_queue_len }}</div>
        </div>
        <div class="status-item">
          <div class="title">Celery Queue Health</div>
          <div class="value">{{ statusData.celery_queue_health }}</div>
        </div>
        <div class="status-item">
          <div class="title">NATS STD Ping</div>
          <div class="value">{{ statusData.nats_std_ping ? 'Healthy' : 'Unhealthy' }}</div>
        </div>
        <div class="status-item">
          <div class="title">NATS WS Ping</div>
          <div class="value">{{ statusData.nats_ws_ping ? 'Healthy' : 'Unhealthy' }}</div>
        </div>
        <div class="status-item">
          <div class="title">Mesh Ping</div>
          <div class="value">{{ statusData.mesh_ping ? 'Healthy' : 'Unhealthy' }}</div>
        </div>
        <div class="status-item services">
          <div class="title">Services Running</div>
          <div class="services-list">
            <div
              v-for="(status, service) in statusData.services_running"
              :key="service"
              class="service"
            >
              <span class="service-name">{{ service }}</span>
              <span :class="['service-status', status ? 'running' : 'stopped']">
                {{ status ? 'Running' : 'Stopped' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="errorMessage">
      <div class="error-message">
        <span class="text">{{ errorMessage }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { serviceEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      statusData: null,
      errorMessage: null,
      errorMessageConstants: {
        missingToken: 'No Token set',
        missingUrl: 'No URL set',
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    token() {
      return this.parseAsEnvVar(this.options.token);
    },
    url() {
      return this.parseAsEnvVar(this.options.url);
    },
    authHeaders() {
      return {
        'X-MON-TOKEN': this.token,
        'Content-Type': 'application/json',
      };
    },
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
  },
  methods: {
    update() {
      this.startLoading();
      this.fetchData();
    },
    fetchData() {
      const {
        authHeaders, url, token, proxyReqEndpoint,
      } = this;

      if (!this.optionsValid({ url, token })) {
        return;
      }

      const targetURL = url;
      const customHeaders = JSON.stringify(authHeaders);

      axios.get(
        proxyReqEndpoint,
        {
          headers: {
            'Target-URL': targetURL,
            CustomHeaders: customHeaders,
          },
        },
      )
        .then((response) => {
          this.processData(response.data);
        })
        .catch(() => {
          this.errorMessage = 'Failed to fetch data';
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    processData(response) {
      this.statusData = response;
    },
    optionsValid({ url, token }) {
      const errors = [];
      if (!url) {
        errors.push(this.errorMessageConstants.missingUrl);
      }
      if (!token) {
        errors.push(this.errorMessageConstants.missingToken);
      }
      if (errors.length === 0) {
        return true;
      }
      this.errorMessage = errors.join('\n');
      return false;
    },
  },
};
</script>

<style scoped lang="scss">
.status-section {
  background-color: var(--item-background);
  padding: 1em;
  border-radius: 8px;
}

.status-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  color: var(--item-text-color);
}

.status-item {
  width: 48%;
  margin: 1em 0;
}

.title {
  font-weight: bold;
  color: var(--item-text-color);
}

.value {
  margin-top: 0.5em;
  color: var(--item-text-color);
}

.services-list {
  display: flex;
  flex-direction: column;
}

.service {
  display: flex;
  justify-content: space-between;
  margin: 0.5em 0;
  width: 100%;
}

.service-name {
  font-weight: bold;
  color: var(--item-text-color);
}

.service-status {
  margin-left: 1em;
}

.service-status.running {
  color: var(--success);
  font-weight: bold;
}

.service-status.stopped {
  color: var(--danger);
}

.error-message {
  color: var(--item-text-color);
}
</style>
