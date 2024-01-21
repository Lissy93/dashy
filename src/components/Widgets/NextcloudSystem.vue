<template>
<div v-if="didLoadData" class="nextcloud-widget nextcloud-system-wrapper">
  <div class="charts">
    <!-- memory gauge -->
    <div class="chart-container">
      <small>{{ tt('overall') }} {{ tt('memory-utilisation') }}</small>
      <GaugeChart :value="memoryGauge.value"
                  :baseColor="memoryGauge.background"
                  :gaugeColor="memoryGauge.color">
        <p class="percentage">{{ memoryGauge.value }}%</p>
      </GaugeChart>
      <small>{{ getMemoryGaugeLabel() }}</small>
    </div>
    <!-- cpu load chart -->
    <div>
      <div
        :id="cpuLoadChartId" class="load-chart"
        v-tooltip="$t('widgets.glances.system-load-desc')"></div>
    </div>
  </div>
  <div>
    <!-- server info: server -->
    <hr />
    <p>
      <i class="fal fa-server"></i>
      <strong>Nextcloud</strong>
      <em>{{ server.nextcloud.system.version }}</em> <small>• </small>
      <strong>{{ server.server.webserver }}/PHP</strong>
      <em>{{ server.server.php.version }}</em>
    </p>
    <hr />
    <!-- server info: database -->
    <p>
      <i class="fal fa-database"></i>
      <strong>{{ server.server.database.type }}</strong>
      <em>{{ server.server.database.version }}</em> <small>{{ tt('using') }}</small>
      <em v-html="convertBytes(server.server.database.size)"></em>
    </p>
    <hr/>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import NextcloudMixin from '@/mixins/NextcloudMixin';
import GaugeChart from '@/components/Charts/Gauge';
import ChartingMixin from '@/mixins/ChartingMixin';

/**
 * NextcloudSystem widget - Visualises CPU load and memory utilisation and shows server versions
 * Used endpoints
 *  - serverinfo: requires Nextcloud admin user
 */
export default {
  mixins: [WidgetMixin, NextcloudMixin, ChartingMixin],
  components: { GaugeChart },
  data() {
    return {
      server: {
        server: {
          database: {
            type: null,
            version: null,
            size: null,
          },
          webserver: null,
          php: {
            version: null,
          },
        },
        nextcloud: {
          system: {
            version: null,
            freespace: null,
            cpuload: [],
            mem_total: null,
            mem_free: null,
            mem_percent: null,
          },
        },
      },
      memoryGauge: {
        value: 0,
        color: '#272f4d',
        showMoreInfo: false,
        moreInfo: null,
        background: '#16161d',
      },
    };
  },
  computed: {
    cpuLoadChartId() {
      return `nextcloud-cpu-load-chart-${Math.random().toString().slice(-4)}`;
    },
    didLoadData() {
      return !!(this.server?.nextcloud?.system?.version);
    },
  },
  methods: {
    allowedStatuscodes() {
      return [200];
    },
    async fetchData() {
      if (!this.hasValidCredentials()) return;
      this.makeRequest(this.endpoint('serverinfo'), this.headers)
        .then(this.processServerInfo)
        .finally(() => this.finishLoading());
    },
    processServerInfo(serverData) {
      const data = this.validateResponse(serverData);
      if (!data || data.length === 0) return;
      this.server.nextcloud.system = data.nextcloud?.system;
      this.server.server.php.version = data.server?.php?.version;
      this.server.server.database = data.server?.database;
      this.server.server.webserver = data.server?.webserver;
    },
    updateMemoryGauge(sys) {
      this.memoryGauge.value = parseFloat(
        (((sys.mem_total - sys.mem_free) / sys.mem_total) * 100).toFixed(2),
      );
      this.memoryGauge.color = this.getMemoryGaugeColor(this.memoryGauge.value);
    },
    updateOpcacheMemory() {
      this.opcache_stats.opcache_hit_rate = parseFloat(
        this.opcache_stats.opcache_hit_rate,
      ).toFixed(3);
      this.opcache.memory_usage.total_memory = (
        this.opcache.memory_usage.used_memory + this.opcache.memory_usage.free_memory
      );
      this.opcache.memory_usage.used_memory_percentage = parseFloat(
        (this.opcache.memory_usage.used_memory / this.opcache.memory_usage.total_memory) * 100,
      ).toFixed(1);
    },
    updateOpcacheInterned() {
      this.opcache.interned_strings_usage.total_memory = (
        this.opcache.interned_strings_usage.used_memory
        + this.opcache.interned_strings_usage.free_memory
      );
      this.opcache.interned_strings_usage.used_memory_percentage = parseFloat(
        (this.opcache.interned_strings_usage.used_memory
        / this.opcache.interned_strings_usage.total_memory) * 100,
      ).toFixed(5);
    },
    getMemoryGaugeColor(memPercent) {
      if (memPercent < 50) return this.getColorRgba('widget-text-color', 0.6);
      if (memPercent < 60) return this.getColorRgba('warning', 0.75);
      if (memPercent < 80) return this.getColorRgba('error', 0.9);
      if (memPercent < 100) return this.getColorRgba('danger');
      return this.getColorRgba('background');
    },
    getMemoryGaugeLabel() {
      const sys = this.server.nextcloud.system;
      return `${this.convertBytes((sys.mem_total - sys.mem_free) * 1024, 2, false)} / `
           + `${this.convertBytes(sys.mem_total * 1024, 2, false)}`;
    },
    updateCpuLoad(load) {
      const chartData = {
        labels: ['1m', '5m', '15m'],
        datasets: [{ values: [load[0], load[1], load[2]] }],
      };
      const chartTitle = this.tt('load-averages');
      this.renderCpuLoadChart(chartData, chartTitle);
    },
    renderCpuLoadChart(loadBarChartData, chartTitle) {
      return new this.Chart(`#${this.cpuLoadChartId}`, {
        title: chartTitle,
        data: loadBarChartData,
        type: 'bar',
        height: 180,
        colors: [this.getColorRgba('widget-text-color', 0.6)],
        barOptions: {
          spaceRatio: 0.2,
        },
        tooltipOptions: {
          formatTooltipY: d => `${d} ${this.tt('tasks')}`,
        },
      });
    },
  },
  created() {
    this.overrideUpdateInterval = 30;
  },
  updated() {
    const load = this.server?.nextcloud?.system?.cpuload;
    if (load) this.updateCpuLoad(load);
    const sys = this.server.nextcloud.system;
    if (sys) this.updateMemoryGauge(sys);
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/widgets/nextcloud-shared.scss';
.nextcloud-system-wrapper {
  div.charts {
    > div {
      float: left;
    }
    > div:first-child {
      max-width: 44%;
      small {
        font-size: 12px;
        color: #666666;
        display: inline-block;
        width: 100%;
        text-align: center;
        margin: .9em 0 1.4em 0;
        opacity: 1;
      }
      small:last-child {
        margin-top: 2em;
        font-size: 10px;
      }
    }
    > div:nth-child(2) {
      min-width: 55%;
    }
    p.percentage {
      color: var(--widget-text-color);
      text-align: center;
      position: absolute;
      font-size: 1.3em;
      margin: .5em 0;
      width: 100%;
      bottom: 0;
    }
  }
}
</style>
