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
      status: null,
      dataTable: null,
      blockPercentChart: null,
    };
  },
  computed: {
    /* Let user select which comic to display: random, latest or a specific number */
    hostname() {
      const usersChoice = this.options.hostname;
      if (!usersChoice) this.error('You must specify the hostname for your Pi-Hole server');
      return usersChoice || 'http://pi.hole';
    },
    endpoint() {
      return `${this.hostname}/admin/api.php?overTimeData10mins`;
    },
  },
  methods: {
    /* Make GET request to local pi-hole instance */
    fetchData() {
      this.makeRequest(this.endpoint)
        .then((response) => {
          if (this.validate(response)) {
            this.processData(response);
          }
        });
    },
    validate(response) {
      if (!response.ads_over_time || !response.domains_over_time) {
        this.error('Expected data was not returned from Pi-Hole');
        return false;
      } else if (response.ads_over_time.length < 1) {
        this.error('Request completed succesfully, but no data in Pi-Hole yet');
        return false;
      }
      return true;
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const timeData = [];
      const domainsData = [];
      Object.keys(data.domains_over_time).forEach((time) => {
        timeData.push(this.formatTime(time * 1000));
        domainsData.push(data.domains_over_time[time]);
      });
      const adsData = [];
      Object.keys(data.ads_over_time).forEach((time) => {
        adsData.push(data.ads_over_time[time]);
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
