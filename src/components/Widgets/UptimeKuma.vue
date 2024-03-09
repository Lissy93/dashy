<template>
  <div>
    <template v-if="monitors">
      <div v-for="(monitor, index) in monitors" :key="index" class="item-wrapper">
        <div class="item monitor-row">
          <div class="title-title"><span class="text">{{ monitor.name }}</span></div>
          <div class="monitors-container">
            <div class="status-container">
              <span class="status-pill" :class="[monitor.statusClass]">{{ monitor.status }}</span>
            </div>
            <div class="status-container">
              <span class="response-time">{{ monitor.responseTime }}ms</span>
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
/**
 * A simple example which you can use as a template for creating your own widget.
 * Takes two optional parameters (`text` and `count`), and fetches a list of images
 * from dummyapis.com, then renders the results to the UI.
 */
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      monitors: null,
      errorMessage: null,
      errorMessageConstants: {
        missingApiKey: 'No API key set',
        missingUrl: 'No URL set',
      },
    };
  },

  mounted() {
    this.fetchData();
  },
  computed: {
    /* Get API key for access to instance */
    apiKey() {
      const { apiKey } = this.options;

      return apiKey;
    },
    /* Get instance URL */
    url() {
      const { url } = this.options;

      return url;
    },
    /* Create authorisation header for the instance from the apiKey */
    authHeaders() {
      if (!this.options.apiKey) {
        return {};
      }
      const encoded = window.btoa(`:${this.options.apiKey}`);
      return { Authorization: `Basic ${encoded}` };
    },
  },
  methods: {
    /* The update() method extends mixin, used to update the data.
     * It's called by parent component, when the user presses update
     */
    update() {
      this.startLoading();
      this.fetchData();
    },
    /* Make the data request to the computed API endpoint */
    fetchData() {
      const { authHeaders, url } = this;

      if (!this.optionsValid({ authHeaders, url })) {
        return;
      }

      this.makeRequest(url, authHeaders)
        .then(this.processData);
    },
    /* Convert API response data into a format to be consumed by the UI */
    processData(response) {
      const monitorRows = this.getMonitorRows(response);

      const monitors = new Map();

      for (let index = 0; index < monitorRows.length; index += 1) {
        const row = monitorRows[index];
        this.processRow(row, monitors);
      }

      this.monitors = Array.from(monitors.values());
    },
    getMonitorRows(response) {
      return response.split('\n').filter(row => row.startsWith('monitor_'));
    },
    processRow(row, monitors) {
      const dataType = this.getRowDataType(row);
      const monitorName = this.getRowMonitorName(row);

      if (!monitors.has(monitorName)) {
        monitors.set(monitorName, { name: monitorName });
      }

      const monitor = monitors.get(monitorName);
      const value = this.getRowValue(row);

      const updated = this.setMonitorValue(dataType, monitor, value);

      monitors.set(monitorName, updated);
    },
    setMonitorValue(key, monitor, value) {
      const copy = { ...monitor };
      switch (key) {
        case 'monitor_cert_days_remaining': {
          copy.certDaysRemaining = value;
          break;
        }
        case 'monitor_cert_is_valid': {
          copy.certValid = value;
          break;
        }
        case 'monitor_response_time': {
          copy.responseTime = value;
          break;
        }
        case 'monitor_status': {
          copy.status = value === '1' ? 'Up' : 'Down';
          copy.statusClass = copy.status.toLowerCase();
          break;
        }
        default:
          break;
      }

      return copy;
    },
    getRowValue(row) {
      return this.getValueWithRegex(row, /\b\d+\b$/);
    },
    getRowMonitorName(row) {
      return this.getValueWithRegex(row, /monitor_name="([^"]+)"/);
    },
    getRowDataType(row) {
      return this.getValueWithRegex(row, /^(.*?)\{/);
    },
    getValueWithRegex(string, regex) {
      const result = string.match(regex);

      const isArray = Array.isArray(result);

      if (!isArray) {
        return result;
      }

      return result.length > 1 ? result[1] : result[0];
    },
    optionsValid({ url, authHeaders }) {
      const errors = [];
      if (url === undefined) {
        errors.push(this.errorMessageConstants.missingUrl);
      }

      if (authHeaders === undefined) {
        errors.push(this.errorMessageConstants.missingApiKey);
      }

      if (errors.length === 0) { return true; }

      this.errorMessage = errors.join('\n');
      return false;
    },
  },
};
</script>

<style scoped lang="scss">
.status-pill {
  border-radius: 50em;
  box-sizing: border-box;
  font-size: 0.75em;
  display: inline-block;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  padding: .35em .65em;
  margin: 1em 0.5em;
  min-width: 64px;

  &.up {
    background-color: rgb(92, 221, 139);
    color: black;
  }

  &.down {
    background-color: rgb(220, 53, 69);
    color: white;
  }
}

div.item.monitor-row:hover {
  background-color: var(--item-background);
  color: var(--current-color);
  opacity: 1;

  div.title-title>span.text {
    color: var(--current-color);
  }
}

.monitors-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 50%;
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
</style>
