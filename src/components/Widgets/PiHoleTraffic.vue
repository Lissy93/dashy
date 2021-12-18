<template>
  <div :id="chartId" class="pi-hole-traffic"></div>
</template>

<script>
import axios from 'axios';
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
      axios.get(this.endpoint)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch data', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
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
