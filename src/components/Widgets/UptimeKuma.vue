<template>
  <div class="example-wrapper">
    <template v-if="monitors">
      <div v-for="(monitor, index) in monitors" :key="index" class="">
        <div class="title-title"><span class="text">{{ monitor.name }}</span></div>
        <div class="monitors-container">
          <div class="status-container">
            <span class="status-pill" :class="{ up: monitor.status == 1, down: monitor.status != 1 }">{{ monitor.status
      ==
      1
      ? "Up" : "Down" }}</span>
          </div>
          <div class="status-container">
            <span class="status-pill">{{ monitor.responseTime }}ms</span>
          </div>
          <div class="status-container">
            <span class="status-pill" :class="{ up: monitor.certValid == 1, down: monitor.certValid != 1 }">{{
      monitor.certValid }}</span>
          </div>
        </div>
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
      monitors: null, // Will store our results from the API
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    /* Get the users chosen number of results, from this.options.count
     * If not present, or not a number, then return the default (5)
     */
    apiKey() {
      const { apiKey } = this.options;

      if (!apiKey) throw new Error('No API key set');

      return apiKey;
    },
    /* Get users desired image text, or return `Dashy` */
    url() {
      const { url } = this.options;

      if (!url) throw new Error('No URL set');

      return url;
    },
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
      this.makeRequest(this.url, this.authHeaders)
        .then(this.processData);
    },
    /* Convert API response data into a format to be consumed by the UI */
    processData(response) {
      const rows = response.split('\n').filter(row => row.startsWith('monitor_'));

      const monitors = new Map();

      const regex = /monitor_name='([^']+)'/;

      const getValue = (row) => row.match(/\b\d+\b$/)[0];

      for (let index = 0; index < rows.length; index++) {
        const row = rows[x];

        const key = row.match(/^(.*?)\{/)[1];
        const monitorName = row.match(regex)[1];

        if (!monitors.has(monitorName)) {
          monitors.set(monitorName, { name: monitorName });
        }

        const monitor = monitors.get(monitorName);
        const value = getValue(row);

        this.setMonitorValue(key, monitor, value);
        this.monitors = Array.from(monitors.values());
      }
    },
    setMonitorValue(key, monitor, value) {
      switch (key) {
        case 'monitor_cert_days_remaining': {
          monitor.certDaysRemaining = value;
          break;
        }
        case 'monitor_cert_is_valid': {
          monitor.certValid = value;
          break;
        }
        case 'monitor_response_time': {
          monitor.responseTime = value;
          break;
        }
        case 'monitor_status': {
          monitor.status = value;
          break;
        }
        default:
          break;
      }
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
}

.up {
  background-color: rgb(92, 221, 139);
}

.down {
  background-color: rgb(220, 53, 69);
}

.monitors-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
