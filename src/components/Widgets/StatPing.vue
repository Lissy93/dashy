<template>
<div class="stat-ping-wrapper">
  <div
    class="service-row"
    v-for="(service, indx) in services"
    :key="indx"
    v-tooltip="makeTooltip(service)"
  >
    <!-- Title -->
    <p class="service-name">
      {{ service.name }}:
      <span v-if="service.online" class="status-online">Online</span>
      <span v-else class="status-offline">Offline</span>
    </p>
    <!-- Charts -->
    <div class="charts">
      <img class="uptime-pie-chart" :src="makeChartUrl(service.uptime24, '24 Hours')" />
      <img class="uptime-pie-chart" :src="makeChartUrl(service.uptime7, '7 Days')" />
    </div>
    <!-- Info -->
    <div class="info">
      <div class="info-row">
        <span class="lbl">Failed Pings</span>
        <span class="val">{{ service.totalFailure }}/{{ service.totalSuccess }}</span>
      </div>
      <div class="info-row">
        <span class="lbl">Last Success</span><span class="val">{{ service.lastSuccess }}</span>
      </div>
      <div class="info-row">
        <span class="lbl">Last Failure</span><span class="val">{{ service.lastFailure }}</span>
      </div>
      <div class="info-row">
        <span class="lbl">Avg Response Time</span>
        <span class="val">{{ service.responseTime }} ms</span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import { serviceEndpoints } from '@/utils/defaults';
import { showNumAsThousand } from '@/utils/MiscHelpers';
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      services: null,
    };
  },
  computed: {
    hostname() {
      if (!this.options.hostname) this.error('A hostname is required');
      return this.options.hostname;
    },
    limit() {
      return this.options.limit;
    },
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
    endpoint() {
      return `${this.hostname}/api/services`;
    },
  },
  methods: {
    fetchData() {
      const requestConfig = {
        method: 'GET',
        url: this.proxyReqEndpoint,
        headers: {
          'Target-URL': this.endpoint,
        },
      };
      axios.request(requestConfig)
        .then((response) => {
          this.processData(response.data);
        }).catch((error) => {
          this.error('Unable to fetch cron data', error);
        }).finally(() => {
          this.finishLoading();
        });
    },
    makeChartUrl(uptime, title) {
      const host = 'https://quickchart.io';
      const chartId = 'zm-d3d5134f-5920-49d1-92ab-303aaaf8cb0b';
      return `${host}/chart/render/${chartId}?data1=${uptime},${100 - uptime}&title=${title}`;
    },
    makeTooltip(service) {
      const {
        responseTime, totalFailure, totalSuccess, lastSuccess, lastFailure,
      } = service;
      const content = `<b>Failed Pings:</b> ${totalFailure}/${totalSuccess}<br>`
        + `<b>Response Time:</b> ${responseTime}ms<br>`
        + `<b>Last Success:</b> ${lastSuccess}<br>`
        + `<b>Last Failure:</b> ${lastFailure}`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'ping-times-tt',
      };
    },
    getTimeAgo(dateTime) {
      const now = new Date().getTime();
      const then = new Date(dateTime).getTime();
      if (then < 0) return 'Never';
      const diff = (now - then) / 1000;
      const divide = (time, round) => Math.round(time / round);
      if (diff < 60) return `${divide(diff, 1)} seconds ago`;
      if (diff < 3600) return `${divide(diff, 60)} minutes ago`;
      if (diff < 86400) return `${divide(diff, 3600)} hours ago`;
      if (diff < 604800) return `${divide(diff, 86400)} days ago`;
      if (diff >= 604800) return `${divide(diff, 604800)} weeks ago`;
      return 'unknown';
    },
    processData(data) {
      let services = [];
      data.forEach((service) => {
        services.push({
          name: service.name,
          online: service.online,
          uptime7: service.online_7_days,
          uptime24: service.online_24_hours,
          responseTime: Math.round(service.avg_response / 1000),
          totalSuccess: showNumAsThousand(service.stats.hits),
          totalFailure: showNumAsThousand(service.stats.failures),
          lastSuccess: this.getTimeAgo(service.last_success),
          lastFailure: this.getTimeAgo(service.last_error),
        });
      });
      if (this.limit) services = services.slice(0, this.limit);
      this.services = services;
    },
  },
};
</script>

<style scoped lang="scss">
.stat-ping-wrapper {
  p {
    color: var(--widget-text-color);
    margin: 0.5rem 0;
  }
  .service-row {
    p.service-name {
      font-size: 1.2rem;
      font-weight: bold;
      span {
        margin-left: 0.25rem;
        font-family: var(--font-monospace);
        &.status-online { color: var(--success); }
        &.status-offline { color: var(--danger); }
      }
    }
    .charts {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      img.uptime-pie-chart {
        width: 35%;
        margin: 0.5rem;
      }
    }
    .info {
      opacity: var(--dimming-factor);
      margin: 1rem auto;
      width: fit-content;
      background: var(--background);
      padding: 0.5rem;
      border-radius: var(--curve-factor);
      .info-row {
        display: flex;
        span {
          color: var(--widget-text-color);
          font-size: 0.8rem;
          &.lbl {
            font-weight: bold;
            margin-right: 0.25rem;
            min-width: 8rem;
          }
          &.val {
            font-family: var(--font-monospace);
          }
        }
      }
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}

</style>
