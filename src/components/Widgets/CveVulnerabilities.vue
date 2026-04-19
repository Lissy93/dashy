<template>
<div class="cve-wrapper" v-if="cveList">
  <div v-for="cve in cveList" :key="cve.id" class="cve-row">
    <a class="upper" :href="cve.url" target="_blank">
      <p :class="`score ${makeScoreColor(cve.score)}`">{{ cve.score }}</p>
      <div class="title-wrap">
        <p class="title">{{ cve.id }}</p>
        <span class="date">{{ formatDate(cve.publishDate) }}</span>
        <span class="last-updated">Last Updated: {{ formatDate(cve.updateDate) }}</span>
        <span :class="`exploit-count ${makeExploitColor(cve.numExploits)}`">
          {{ formatExploitCount(cve.numExploits) }}
        </span>
      </div>
    </a>
    <p class="cve-description">
      {{ formatDescription(cve.description) }}
      <a v-if="cve.description.length > 350" class="read-more" :href="cve.url" target="_blank">
        {{ $t('widgets.general.open-link') }}
      </a>
    </p>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { timestampToDate, truncateStr } from '@/utils/MiscHelpers';
import { widgetApiEndpoints } from '@/utils/config/defaults';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      cveList: null,
      total: 10,
    };
  },
  computed: {
    endpointTotal() {
      let apiUrl = `${widgetApiEndpoints.cveVulnerabilities}?resultsPerPage=1&startIndex=1&noRejected`;
      apiUrl = this.appendQuery(apiUrl, this.options, 'cveTag', 'cveTag');
      apiUrl = this.appendQuery(apiUrl, this.options, 'cvssV2Severity', 'cvssV2Severity');
      apiUrl = this.appendQuery(apiUrl, this.options, 'cvssV3Severity', 'cvssV3Severity');
      apiUrl = this.appendQuery(apiUrl, this.options, 'cvssV4Severity', 'cvssV4Severity');
      apiUrl = this.appendQuery(apiUrl, this.options, 'keywordSearch', 'keywordSearch');
      apiUrl = this.appendQuery(apiUrl, this.options, 'sourceIdentifier', 'sourceIdentifier');

      return apiUrl;
    },
    endpointPage() {
      const page = Math.max(this.total - (this.options.limit ?? 5), 1);
      let apiUrl = `${widgetApiEndpoints.cveVulnerabilities}`
      + `?resultsPerPage=${(this.options.limit ?? 5)}`
      + `&startIndex=${page}`
      + '&noRejected';

      apiUrl = this.appendQuery(apiUrl, this.options, 'cveTag', 'cveTag');
      apiUrl = this.appendQuery(apiUrl, this.options, 'cvssV2Severity', 'cvssV2Severity');
      apiUrl = this.appendQuery(apiUrl, this.options, 'cvssV3Severity', 'cvssV3Severity');
      apiUrl = this.appendQuery(apiUrl, this.options, 'cvssV4Severity', 'cvssV4Severity');
      apiUrl = this.appendQuery(apiUrl, this.options, 'keywordSearch', 'keywordSearch');
      apiUrl = this.appendQuery(apiUrl, this.options, 'sourceIdentifier', 'sourceIdentifier');

      return apiUrl;
    },
  },
  methods: {
    formatDate(date) {
      return timestampToDate(date);
    },
    formatDescription(description) {
      return truncateStr(description, 350);
    },
    formatExploitCount(numExploits) {
      if (!numExploits) return 'Number of exploits not known';
      if (numExploits === '0') return 'No published exploits';
      return `${numExploits} known exploit${numExploits !== '1' ? 's' : ''}`;
    },
    appendQuery(url = '', opts = {}, property = '', paramUrl = '') {
      const allowedKeys = [
        'cveTag',
        'cvssV2Severity',
        'cvssV3Severity',
        'cvssV4Severity',
        'keywordSearch',
        'sourceIdentifier',
      ];

      if (allowedKeys.includes(property)) {
        // eslint-disable-next-line no-prototype-builtins
        if (opts.hasOwnProperty(property)) {
          return `${url}&${paramUrl}=${opts[property]}`;
        }
      }

      return url;
    },
    /* Make GET request to NIST NVD API endpoint */
    fetchData() {
      this.defaultTimeout = 12000;
      this.makeRequest(this.endpointTotal)
        .then(sample => {
          this.total = sample.totalResults;
          this.makeRequest(this.endpointPage)
            .then(this.processData);
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const cveList = [];
      data.vulnerabilities.forEach(({ cve = {} }) => {
        cveList.push({
          id: cve.id,
          score: this.parseScore(cve.metrics),
          url: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
          description: this.parseDescriptions(cve.descriptions),
          publishDate: cve.published,
          updateDate: cve.lastModified,
        });
      });
      this.cveList = cveList;
    },
    parseScore(metrics = {}) {
      if (!metrics) {
        return 'Unset';
      }
      if (metrics.cvssMetricV40 !== undefined) {
        for (let i = 0; i < metrics.cvssMetricV40.length; i += 1) {
          if (metrics.cvssMetricV40[i].cvssData !== undefined
              && metrics.cvssMetricV40[i].cvssData.baseSeverity !== undefined
              && metrics.cvssMetricV40[i].cvssData.baseSeverity !== '') {
            return metrics.cvssMetricV40[i].cvssData.baseSeverity;
          }
        }
      }
      if (metrics.cvssMetricV31 !== undefined) {
        for (let i = 0; i < metrics.cvssMetricV31.length; i += 1) {
          if (metrics.cvssMetricV31[i].cvssData !== undefined
              && metrics.cvssMetricV31[i].cvssData.baseSeverity !== undefined
              && metrics.cvssMetricV31[i].cvssData.baseSeverity !== '') {
            return metrics.cvssMetricV31[i].cvssData.baseSeverity;
          }
        }
      }
      if (metrics.cvssMetricV30 !== undefined) {
        for (let i = 0; i < metrics.cvssMetricV30.length; i += 1) {
          if (metrics.cvssMetricV30[i].cvssData !== undefined
              && metrics.cvssMetricV30[i].cvssData.baseSeverity !== undefined
              && metrics.cvssMetricV30[i].cvssData.baseSeverity !== '') {
            return metrics.cvssMetricV30[i].cvssData.baseSeverity;
          }
        }
      }
      if (metrics.cvssMetricV2 !== undefined) {
        for (let i = 0; i < metrics.cvssMetricV2.length; i += 1) {
          if (metrics.cvssMetricV2[i].baseSeverity !== undefined && metrics.cvssMetricV2[i].baseSeverity !== '') {
            return metrics.cvssMetricV2[i].baseSeverity;
          }
        }
      }
      return 'Unset';
    },
    parseDescriptions(cveDescriptions = []) {
      for (let i = 0; i < cveDescriptions.length; i += 1) {
        if (cveDescriptions[i].lang === 'en') {
          return cveDescriptions[i].value;
        }
      }
      return 'Unset';
    },
    makeScoreColor(inputScore) {
      if (!inputScore) return 'bg-grey';
      if (inputScore === 'CRITICAL') return 'bg-red';
      if (inputScore === 'HIGH') return 'bg-orange';
      if (inputScore === 'MEDIUM') return 'bg-yellow';
      if (inputScore === 'LOW') return 'bg-green';
      return 'bg-blue';
    },
  },
};
</script>

<style scoped lang="scss">
.cve-wrapper {
  .cve-row {
    p, span, a {
      font-size: 1rem;
      margin: 0.5rem 0;
      color: var(--widget-text-color);
      &.bg-green { background: var(--success); }
      &.bg-yellow { background: var(--warning); }
      &.bg-orange { background: var(--error); }
      &.bg-red { background: var(--danger); }
      &.bg-blue { background: var(--info); }
      &.bg-grey { background: var(--neutral); }
    }
    a.upper {
      display: flex;
      margin: 0.25rem 0 0 0;
      align-items: center;
      text-decoration: none;
    }
    .score {
      font-size: 1rem;
      font-weight: bold;
      padding: 0.25rem 0.5rem;
      margin-right: 0.5rem;
      border-radius: 30px;
      font-family: var(--font-monospace);
      background: var(--widget-text-color);
      color: var(--widget-background-color);
    }
    .title {
      font-family: var(--font-monospace);
      font-size: 1.2rem;
      font-weight: bold;
      margin: 0;
    }
    .date, .last-updated {
      font-size: 0.8rem;
      margin: 0;
      opacity: var(--dimming-factor);
      padding-right: 0.5rem;
    }
    .seperator {
      font-size: 0.8rem;
      margin: 0;
      opacity: var(--dimming-factor);
    }
    .cve-description {
      font-size: 0.9rem;
      margin: 0 0.25rem 0.5rem 0.25rem;
    }
    a.read-more {
      opacity: var(--dimming-factor);
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
    .last-updated {
      display: none;
    }
    &:hover {
      .date { display: none; }
      .last-updated { display: inline; }
    }
  }
}

</style>
