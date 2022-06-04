<template>
<div class="covid-stats-wrapper">
  <div class="basic-stats" v-if="basicStats">
    <div class="active-cases stat-wrap">
      <span class="lbl">Active Cases</span>
      <span class="val">{{ basicStats.active | numberFormat }}</span>
    </div>
    <div class="more-stats">
      <div class="stat-wrap">
        <span class="lbl">Total Confirmed</span>
        <span class="val total">{{ basicStats.cases | numberFormat }}</span>
      </div>
      <div class="stat-wrap">
        <span class="lbl">Total Recovered</span>
        <span class="val recovered">{{ basicStats.recovered | numberFormat }}</span>
      </div>
      <div class="stat-wrap">
        <span class="lbl">Total Deaths</span>
        <span class="val deaths">{{ basicStats.deaths | numberFormat }}</span>
      </div>
    </div>
  </div>
  <!-- Chart -->
  <div class="case-history-chart" :id="chartId" v-if="showChart"></div>
  <!-- Country Data -->
  <div class="country-data" v-if="countryData">
    <div class="country-row" v-for="country in countryData" :key="country.name">
      <p class="name">
        <img :src="country.flag" alt="Flag" class="flag" />
        {{ country.name }}
      </p>
      <div class="country-case-wrap">
        <div class="stat-wrap">
          <span class="lbl">Confirmed</span>
          <span class="val total">{{ country.cases | showInK }}</span>
        </div>
        <div class="stat-wrap">
          <span class="lbl">Recovered</span>
          <span class="val recovered">{{ country.recovered | showInK }}</span>
        </div>
        <div class="stat-wrap">
          <span class="lbl">Deaths</span>
          <span class="val deaths">{{ country.deaths | showInK }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import ChartingMixin from '@/mixins/ChartingMixin';
import { putCommasInBigNum, showNumAsThousand, timestampToDate } from '@/utils/MiscHelpers';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin, ChartingMixin],
  computed: {
    showChart() {
      return this.options.showChart || false;
    },
    showCountries() {
      if (this.options.countries) return true;
      return this.options.showCountries;
    },
    numDays() {
      return this.options.numDays || 120;
    },
    countries() {
      return this.options.countries;
    },
    limit() {
      return this.options.limit || 15;
    },
    basicStatsEndpoint() {
      return `${widgetApiEndpoints.covidStats}/all`;
    },
    timeSeriesEndpoint() {
      return `${widgetApiEndpoints.covidStats}/historical/all?lastdays=${this.numDays}`;
    },
    countryInfoEndpoint() {
      return 'https://covidapi.yubrajpoudel.com.np/stat';
    },
  },
  data() {
    return {
      basicStats: null,
      countryData: null,
    };
  },
  filters: {
    numberFormat(caseNumber) {
      return putCommasInBigNum(caseNumber);
    },
    showInK(caseNumber) {
      return showNumAsThousand(caseNumber);
    },
  },
  methods: {
    fetchData() {
      this.makeRequest(this.basicStatsEndpoint).then(this.processBasicStats);
      if (this.showChart) {
        this.makeRequest(this.timeSeriesEndpoint).then(this.processTimeSeries);
      }
      if (this.showCountries) {
        this.makeRequest(this.countryInfoEndpoint).then(this.processCountryInfo);
      }
    },
    processBasicStats(data) {
      this.basicStats = data;
    },
    processCountryInfo(data) {
      const countryData = [];
      data.forEach((country) => {
        const iso = country.countryInfo.iso3;
        if (!this.countries || this.countries.includes(iso)) {
          countryData.push({
            name: country.country,
            flag: country.countryInfo.flag,
            cases: country.cases,
            deaths: country.deaths,
            recovered: country.recovered,
          });
        }
      });
      this.countryData = countryData.slice(0, this.limit);
    },
    processTimeSeries(data) {
      const timeLabels = Object.keys(data.cases);
      const totalCases = [];
      const totalDeaths = [];
      const totalRecovered = [];
      timeLabels.forEach((date) => {
        totalCases.push(data.cases[date]);
        totalDeaths.push(data.deaths[date]);
        totalRecovered.push(data.recovered[date]);
      });
      const chartData = {
        labels: timeLabels,
        datasets: [
          { name: 'Cases', type: 'bar', values: totalCases },
          { name: 'Recovered', type: 'bar', values: totalRecovered },
          { name: 'Deaths', type: 'bar', values: totalDeaths },
        ],
      };
      return new this.Chart(`#${this.chartId}`, {
        title: 'Cases, Recoveries and Deaths',
        data: chartData,
        type: 'axis-mixed',
        height: this.chartHeight,
        colors: ['#f6f000', '#20e253', '#f80363'],
        truncateLegends: true,
        lineOptions: {
          hideDots: 1,
        },
        axisOptions: {
          xIsSeries: true,
          xAxisMode: 'tick',
        },
        tooltipOptions: {
          formatTooltipY: d => putCommasInBigNum(d),
          formatTooltipX: d => timestampToDate(d),
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.covid-stats-wrapper {
  .basic-stats {
    padding: 0.5rem 0;
    margin: 0.5rem 0;
    background: var(--widget-accent-color);
    border-radius: var(--curve-factor);
  }
  .country-row {
    display: flex;
    justify-content: space-between;
    p.name {
      display: flex;
      align-items: center;
      margin: 0.5rem 0;
      color: var(--widget-text-color);
      img.flag {
        width: 2.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
        border-radius: var(--curve-factor);
      }
    }
    .country-case-wrap {
      min-width: 60%;
    }
    &:not(:last-child) { border-bottom: 1px dashed var(--widget-text-color); }
  }
  .stat-wrap {
      color: var(--widget-text-color);
      display: flex;
      flex-direction: column;
      width: 33%;
      margin: 0.25rem auto;
      text-align: center;
      cursor: default;
      span.lbl {
        font-size: 0.8rem;
        opacity: var(--dimming-factor);
      }
      span.val {
        font-weight: bold;
        margin: 0.1rem 0;
        font-family: var(--font-monospace);
        &.total { color: var(--warning); }
        &.recovered { color: var(--success); }
        &.deaths { color: var(--danger); }
      }
      &.active-cases {
        span.lbl { font-size: 1.1rem; }
        span.val { font-size: 1.3rem; }
      }
    }
    .more-stats, .country-case-wrap {
      display: flex;
      justify-content: space-around;
    }
}
</style>
