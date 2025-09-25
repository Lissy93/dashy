<template>
<div :id="chartId" class="pi-hole-traffic"></div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  components: {},
  data() {
    return {
      csrfToken: null,
      sid: null,
    };
  },
  computed: {
    /* Let user select which comic to display: random, latest or a specific number */
    hostname() {
      const usersChoice = this.parseAsEnvVar(this.options.hostname);
      if (!usersChoice) this.error('You must specify the hostname for your Pi-Hole server');
      return usersChoice;
    },
    apiKey() {
      const usersChoice = this.parseAsEnvVar(this.options.apiKey);
      if (!usersChoice) this.error('App Password is required, please see the docs');
      return usersChoice;
    },
    authHeader() {
      return {
        'X-FTL-SID': this.sid,
        'X-FTL-CSRF': this.csrfToken,
        Accept: 'application/json',
      };
    },
    authEndpoint() {
      return `${this.hostname}/api/auth`;
    },
    historyEndpoint() {
      return `${this.hostname}/api/history`;
    },
  },
  methods: {
    fetchData() {
      this.makeRequest(
        this.authEndpoint,
        { 'Content-Type': 'application/json' },
        'POST',
        { password: this.apiKey },
      )
        .then(this.processAuthData)
        .then(
          () => {
            if (!this.sid || !this.csrfToken) return;

            this.fetchHistory().then((response) => {
              if (this.validate(response)) {
                this.processData(response);
              }
            });
          },
        );
    },
    processAuthData({ session }) {
      if (!session) {
        this.error('Missing session info in auth response');
      } else if (session.valid !== true) {
        this.error('Authentication failed: Invalid credentials or 2FA token required');
      } else {
        const { sid, csrf } = session;
        if (!sid || !csrf) {
          this.error('No CSRF token or SID received');
        } else {
          this.sid = sid;
          this.csrfToken = csrf;
        }
      }
    },
    fetchHistory() {
      return this.makeRequest(this.historyEndpoint, this.authHeader);
    },
    validate(data) {
      if (!data || !Array.isArray(data['history'])) {
        this.error('Got success, but found no results, possible authorization error');
      } else if (data.history.length < 1) {
        this.error('Request completed succesfully, but no data in Pi-Hole yet');
        return false;
      }
      return true;
    },
    processData({ history }) {
      const timeData = [];
      const domainsData = [];
      const adsData = [];
      history.forEach(({ timestamp, total, blocked }) => {
        timeData.push(this.formatTime(timestamp * 1000));
        domainsData.push(total - blocked);
        adsData.push(blocked);
      });
      const chartData = {
        labels: timeData,
        datasets: [
          { name: 'Queries', type: 'bar', values: domainsData },
          { name: 'Ads Blocked', type: 'bar', values: adsData },
        ],
      };
      this.generateChart(chartData);
    },
    generateChart(chartData) {
      return new this.Chart(`#${this.chartId}`, {
        title: 'Recent Queries & Ads',
        data: chartData,
        type: 'axis-mixed',
        height: this.chartHeight,
        colors: ['#20e253', '#f80363'],
        truncateLegends: true,
        lineOptions: {
          regionFill: 1,
          hideDots: 1,
        },
        axisOptions: {
          xIsSeries: true,
          xAxisMode: 'tick',
        },
      });
    },
  },
};
</script>
