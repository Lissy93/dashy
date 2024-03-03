<template>
  <div class="example-wrapper">
    <template v-if="monitors">
    <div v-for="(monitor, index) in monitors" :key="index" class="">
      <p>{{monitor.name}}</p>
      <p>{{monitor.status }}</p>
      <p>{{monitor.responseTime }}</p>

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
import axios from "axios";
import WidgetMixin from "@/mixins/WidgetMixin";

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
      const apiKey = this.options.apiKey;

      if (!apiKey) throw "No API key set";

      return apiKey;
    },
    /* Get users desired image text, or return `Dashy` */
    url() {
      const apiUrl = this.options.url;

      if (!apiUrl) throw "No URL set";

      return apiUrl;
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
      const rows = response.split('\n').filter(row => row.startsWith("monitor_"));

      const monitors = new Map();

      const regex = /monitor_name="([^"]+)"/;

      const getValue = (row) => row.match(/\b\d+\b$/);

      for (const row of rows) {
        const key = row.match(/^(.*?)\{/);
        const monitorName = row.match(regex);

        if (!monitors.has(monitorName)) {
          monitors.set(monitorName, {name: monitorName});
        }

        const existingMonitor = monitors.get(monitorName);

        const value = getValue(row);
        switch (key) {
          case "monitor_cert_days_remaining": {
            existingMonitor.certDaysRemaining = value;
            break;
          }
          case "monitor_cert_is_valid": {
            existingMonitor.certValid = value;
            break;
          }
          case "monitor_response_time": {
            existingMonitor.responseTime = value;
            break;
          }
          case "monitor_status": {
            existingMonitor.status= value;
            break;
          }
          default:
            console.log("not matched", key);
            break;
        }

      }

      console.log(monitors);
      this.monitors = Array.from(monitors.values());
    },
  },
};
</script>
<style scoped lang="scss">
.example-wrapper {
  .image-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    p.picture-title {
      font-size: 1.2rem;
      color: var(--widget-text-color);
    }
    img.picture-result {
      width: 4rem;
      margin: 0.5rem 0;
      border-radius: var(--curve-factor);
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}
</style>
