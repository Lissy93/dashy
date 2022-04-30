<template>
<div class="cve-wrapper" v-if="cveList">
  <div v-for="cve in cveList" :key="cve.id" class="cve-row">
    <a class="upper" :href="cve.url" target="_blank">
      <p :class="`score ${makeScoreColor(cve.score)}`">{{ cve.score }}</p>
      <div class="title-wrap">
        <p class="title">{{ cve.id }}</p>
        <span class="date">{{ cve.publishDate | formatDate }}</span>
        <span class="last-updated">Last Updated: {{ cve.updateDate | formatDate }}</span>
        <span :class="`exploit-count ${makeExploitColor(cve.numExploits)}`">
          {{ cve.numExploits | formatExploitCount }}
        </span>
      </div>
    </a>
    <p class="cve-description">
      {{ cve.description | formatDescription }}
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
import { widgetApiEndpoints, serviceEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      cveList: null,
    };
  },
  filters: {
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
  },
  computed: {
    /* Get sort order, defaults to publish date */
    sortBy() {
      const usersChoice = this.options.sortBy;
      let sortCode;
      switch (usersChoice) {
        case ('publish-date'): sortCode = 1; break;
        case ('last-update'): sortCode = 2; break;
        case ('cve-code'): sortCode = 3; break;
        default: sortCode = 1;
      }
      return `&orderby=${sortCode}`;
    },
    /* The minimum CVE score to fetch/ show, defaults to 4 */
    minScore() {
      const usersChoice = this.options.minScore;
      let minScoreVal = 4;
      if (usersChoice && (usersChoice >= 0 || usersChoice <= 10)) {
        minScoreVal = usersChoice;
      }
      return `&cvssscoremin=${minScoreVal}`;
    },
    vendorId() {
      return (this.options.vendorId) ? `&vendor_id=${this.options.vendorId}` : '';
    },
    productId() {
      return (this.options.productId) ? `&product_id=${this.options.productId}` : '';
    },
    /* Should only show results with exploits, defaults to false */
    hasExploit() {
      const shouldShow = this.options.hasExploit ? 1 : 0;
      return `&hasexp=${shouldShow}`;
    },
    /* The number of results to fetch/ show, defaults to 10 */
    limit() {
      const usersChoice = this.options.limit;
      let numResults = 10;
      if (usersChoice && (usersChoice >= 5 || usersChoice <= 30)) {
        numResults = usersChoice;
      }
      return `&numrows=${numResults}`;
    },
    endpoint() {
      return `${widgetApiEndpoints.cveVulnerabilities}?${this.sortBy}${this.limit}`
        + `${this.minScore}${this.vendorId}${this.hasExploit}`;
    },
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      this.defaultTimeout = 12000;
      this.makeRequest(this.endpoint).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const cveList = [];
      data.forEach((cve) => {
        cveList.push({
          id: cve.cve_id,
          score: cve.cvss_score,
          url: cve.url,
          description: cve.summary,
          numExploits: cve.exploit_count,
          publishDate: cve.publish_date,
          updateDate: cve.update_date,
        });
      });
      this.cveList = cveList;
    },
    makeExploitColor(numExploits) {
      if (!numExploits || Number.isNaN(parseInt(numExploits, 10))) return 'fg-grey';
      const count = parseInt(numExploits, 10);
      if (count === 0) return 'fg-green';
      if (count === 1) return 'fg-orange';
      if (count > 1) return 'fg-red';
      return 'fg-grey';
    },
    makeScoreColor(inputScore) {
      if (!inputScore || Number.isNaN(parseFloat(inputScore))) return 'bg-grey';
      const score = parseFloat(inputScore);
      if (score >= 9) return 'bg-red';
      if (score >= 7) return 'bg-orange';
      if (score >= 4) return 'bg-yellow';
      if (score >= 0.1) return 'bg-green';
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
      &.fg-green { color: var(--success); }
      &.fg-yellow { color: var(--warning); }
      &.fg-orange { color: var(--error); }
      &.fg-red { color: var(--danger); }
      &.fg-blue { color: var(--info); }
      &.fg-grey { color: var(--neutral); }
    }
    a.upper {
      display: flex;
      margin: 0.25rem 0 0 0;
      align-items: center;
      text-decoration: none;
    }
    .score {
      font-size: 1.1rem;
      font-weight: bold;
      padding: 0.45rem 0.25rem 0.25rem 0.25rem;
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
    .exploit-count {
      display: none;
      font-size: 0.8rem;
      margin: 0;
      padding-left: 0.5rem;
      opacity: var(--dimming-factor);
      border-left: 1px solid var(--widget-text-color);
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
      .exploit-count, .last-updated { display: inline; }
    }
  }
}

</style>
