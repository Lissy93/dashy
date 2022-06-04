<template>
<div class="code-stats-wrapper">
  <!-- User Info -->
  <div class="user-meta" v-if="basicInfo && !hideMeta">
    <div class="user-info-wrap">
      <p class="username">{{ basicInfo.username }}</p>
      <p class="user-level">{{ basicInfo.level }}</p>
    </div>
    <div class="total-xp-wrap">
      <p class="total-xp">{{ basicInfo.totalXp | formatTotalXp }}</p>
      <p class="new-xp">{{ basicInfo.newXp | formatNewXp }}</p>
    </div>
  </div>
  <!-- XP History Heatmap -->
  <div :id="`xp-history-${chartId}`" class="xp-heat-chart"></div>
  <!-- Language Breakdown -->
  <div :id="`languages-${chartId}`" class="language-pie-chart"></div>
  <!-- Machines Percentage -->
  <div :id="`machines-${chartId}`" class="machine-percentage-chart"></div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { putCommasInBigNum, showNumAsThousand } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  data() {
    return {
      basicInfo: null,
    };
  },
  computed: {
    /* The username to fetch data from - REQUIRED */
    username() {
      if (!this.options.username) this.error('You must specify a username');
      return this.options.username;
    },
    /* Optionally override hostname, if using a self-hosted instance */
    hostname() {
      if (this.options.hostname) return this.options.hostname;
      return widgetApiEndpoints.codeStats;
    },
    hideMeta() {
      return this.options.hideMeta || false;
    },
    hideHistory() {
      return this.options.hideHistory || false;
    },
    hideLanguages() {
      return this.options.hideLanguages || false;
    },
    hideMachines() {
      return this.options.hideMachines || false;
    },
    monthsToShow() {
      return this.options.monthsToShow || 5;
    },
    endpoint() {
      return `${this.hostname}/api/users/${this.username}`;
    },
    chartStartDate() {
      const now = new Date();
      return new Date((now.setMonth(now.getMonth() - this.monthsToShow)));
    },
  },
  filters: {
    formatTotalXp(bigNum) {
      return showNumAsThousand(bigNum);
    },
    formatNewXp(newXp) {
      return `+${putCommasInBigNum(newXp)} XP`;
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch data from CodeStats.net', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      // Make basic info data
      if (!this.hideMeta) {
        this.basicInfo = {
          username: data.user,
          level: this.makeLevel(data.total_xp),
          totalXp: data.total_xp,
          newXp: data.new_xp,
        };
      }
      // Make language breakdown pie chart data
      if (!this.hideLanguages) {
        const langLabels = [];
        const langXpValues = [];
        Object.keys(data.languages).forEach((lang) => {
          langLabels.push(lang);
          langXpValues.push(data.languages[lang].xps);
        });
        const languagesPieData = {
          labels: langLabels,
          datasets: [{ values: langXpValues }],
        };
        this.drawLanguagePieChart(languagesPieData);
      }
      // Make day-by-day historical XP heat chart data
      if (!this.hideHistory) {
        const xpHistoryChartData = {};
        Object.keys(data.dates).forEach((date) => {
          const timestamp = Math.round(new Date(date).getTime() / 1000);
          xpHistoryChartData[timestamp] = data.dates[date];
        });
        this.drawXpHistoryChart(xpHistoryChartData);
      }
      // Make machine proportion percentage chart data
      if (!this.hideMachines) {
        const machinesLabels = [];
        const machinesXpValues = [];
        Object.keys(data.machines).forEach((machine) => {
          machinesLabels.push(machine);
          machinesXpValues.push(data.machines[machine].xps);
        });
        const machinesPercentageData = {
          labels: machinesLabels,
          datasets: [{ values: machinesXpValues }],
        };
        this.drawMachinesPercentageChart(machinesPercentageData);
      }
    },
    drawLanguagePieChart(languagesPieData) {
      return new this.Chart(`#languages-${this.chartId}`, {
        title: 'Languages',
        type: 'donut',
        data: languagesPieData,
        height: 250,
        strokeWidth: 15,
        tooltipOptions: {
          formatTooltipY: d => showNumAsThousand(d),
        },
      });
    },
    drawXpHistoryChart(xpHistoryData) {
      return new this.Chart(`#xp-history-${this.chartId}`, {
        title: 'Historical XP',
        type: 'heatmap',
        data: {
          dataPoints: xpHistoryData,
          start: this.chartStartDate,
          end: new Date(),
        },
        discreteDomains: 0,
        radius: 2,
        colors: ['#caf0f8', '#48cae4', '#0077b6', '#023e8a', '#090a79'],
      });
    },
    drawMachinesPercentageChart(machineChartData) {
      return new this.Chart(`#machines-${this.chartId}`, {
        title: 'Machines',
        type: 'percentage',
        data: machineChartData,
        height: 180,
        strokeWidth: 15,
        tooltipOptions: {
          formatTooltipY: d => showNumAsThousand(d),
        },
        colors: ['#f9c80e', '#43bccd', '#ea3546', '#662e9b', '#f86624'],
      });
    },
    /* Given a users XP score, return text level */
    makeLevel(xp) {
      if (xp < 100) return 'New Joiner';
      if (xp < 1000) return 'Noob';
      if (xp < 10000) return 'Intermediate';
      if (xp < 50000) return 'Code ninja in the making';
      if (xp < 100000) return 'Expert Developer';
      if (xp < 500000) return 'Ultra Expert Developer';
      if (xp < 1000000) return 'Code Super Hero';
      if (xp < 1500000) return 'Super Epic Code Hero';
      if (xp >= 15000000) return 'God Level';
      return xp;
    },
  },
};
</script>

<style scoped lang="scss">
.code-stats-wrapper {
  p {
    margin: 0;
    font-size: 1rem;
    color: var(--widget-text-color);
  }
  .user-meta {
    display: flex;
    margin: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px dashed var(--widget-text-color);
    justify-content: space-between;
    .user-info-wrap {
      .username {
        font-size: 1.4rem;
        text-transform: capitalize;
      }
      .user-level {
        font-size: 0.8rem;
        text-transform: capitalize;
        opacity: var(--dimming-factor);
        color: var(--widget-text-color);
      }
    }
    .total-xp-wrap {
      display: flex;
      align-items: flex-start;
      .total-xp {
        font-size: 1.4rem;
        font-family: var(--font-monospace);
      }
      .new-xp {
        font-size: 0.8rem;
        margin: 0 0 0 0.5rem;
        color: var(--success);
        font-family: var(--font-monospace);
      }
    }
  }
  .xp-heat-chart,
  .language-pie-chart,
  .machine-percentage-chart {
    &:not(:last-child) { border-bottom: 1px dashed var(--widget-text-color); }
  }
}
</style>
