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
      <span v-if="service.online" class="status-online">
        {{ $t('widgets.stat-ping.up') }}
      </span>
      <span v-else class="status-offline">
        {{ $t('widgets.stat-ping.down') }}
      </span>
      <Button v-on:click="service.infoHidden = !service.infoHidden"
              class="far fa-info"></Button>
      <Button v-on:click="service.chartHidden = !service.chartHidden"
              class="far fa-chart-line"></button>
    </p>
    <!-- Charts -->
    <div v-if="!service.chartHidden" class="charts">
      <img
        class="uptime-pie-chart" alt="24 Hour Uptime Chart"
        :src="makeChartUrl(service.uptime24, '24 Hours')" />
      <img class="uptime-pie-chart" alt="7 Day Uptime Chart"
        :src="makeChartUrl(service.uptime7, '7 Days')" />
    </div>
    <!-- Info -->
    <div v-if="!service.infoHidden" class="info">
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
import { serviceEndpoints } from '@/utils/defaults';
import { showNumAsThousand, getTimeAgo } from '@/utils/MiscHelpers';
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
    groupId() {
      return this.options.groupId || 0;
    },
    showChart() {
      return typeof this.options.showChart !== 'boolean' ? true : this.options.showChart;
    },
    showInfo() {
      return typeof this.options.showInfo !== 'boolean' ? true : this.options.showInfo;
    },
  },
  methods: {
    fetchData() {
      this.overrideProxyChoice = true;
      this.makeRequest(this.endpoint).then(this.processData);
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
    processData(data) {
      let services = [];
      data.forEach((service) => {
        if (this.groupId && this.groupId !== service.group_id) return;
        services.push({
          name: service.name,
          online: service.online,
          uptime7: service.online_7_days,
          uptime24: service.online_24_hours,
          responseTime: Math.round(service.avg_response / 1000),
          totalSuccess: showNumAsThousand(service.stats.hits),
          totalFailure: showNumAsThousand(service.stats.failures),
          lastSuccess: getTimeAgo(service.last_success),
          lastFailure: getTimeAgo(service.last_error),
          chartHidden: this.showChart ? 0 : 1,
          infoHidden: this.showInfo ? 0 : 1,
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
    button {
      float: right;
      color: var(--widget-text-color);
      top: 4px;
      background: none;
      border: none;
      position: relative;
      opacity: .4;
    }
    button:hover {
      opacity: .75;
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
