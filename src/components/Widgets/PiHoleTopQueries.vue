<template>
<div class="pi-hole-queries-wrapper" v-if="results">
  <div v-for="section in results" :key="section.id" class="query-section">
    <p class="section-title">{{ section.title }}</p>
    <div v-for="(query, i) in section.results" :key="i" class="query-row">
      <p class="domain">{{ query.domain }}</p>
      <p class="count">{{ query.count }}</p>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { showNumAsThousand } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      results: null,
    };
  },
  computed: {
    /* Let user select which comic to display: random, latest or a specific number */
    hostname() {
      const usersChoice = this.options.hostname;
      if (!usersChoice) this.error('You must specify the hostname for your Pi-Hole server');
      return usersChoice || 'http://pi.hole';
    },
    apiKey() {
      if (!this.options.apiKey) this.error('API Key is required, please see the docs');
      return this.options.apiKey;
    },
    count() {
      const usersChoice = this.options.count;
      if (usersChoice && typeof usersChoice === 'number') return usersChoice;
      return 10;
    },
    endpoint() {
      return `${this.hostname}/admin/api.php?topItems=${this.count}&auth=${this.apiKey}`;
    },
  },
  methods: {
    /* Make GET request to local pi-hole instance */
    fetchData() {
      this.makeRequest(this.endpoint)
        .then((response) => {
          if (Array.isArray(response)) {
            this.error('Got success, but found no results, possible authorization error');
          } else {
            this.processData(response);
          }
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const topAds = [];
      Object.keys(data.top_ads).forEach((domain) => {
        topAds.push({ domain, count: showNumAsThousand(data.top_ads[domain]) });
      });
      const topQueries = [];
      Object.keys(data.top_queries).forEach((domain) => {
        topQueries.push({ domain, count: showNumAsThousand(data.top_queries[domain]) });
      });
      this.results = [
        { id: '01', title: 'Top Ads Blocked', results: topAds },
        { id: '02', title: 'Top Queries', results: topQueries },
      ];
    },
  },
};
</script>

<style scoped lang="scss">
.pi-hole-queries-wrapper {
  color: var(--widget-text-color);
  .query-section {
    display: inline-block;
    width: 100%;
    p.section-title {
      margin: 0.75rem 0 0.25rem;
      font-size: 1.2rem;
      font-weight: bold;
    }
    .query-row {
      display: flex;
      justify-content: space-between;
      margin: 0.25rem;
      p.domain {
        margin: 0.25rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p.count {
        margin: 0.25rem 0;
        font-family: var(--font-monospace);
      }
      &:not(:last-child) {
        border-bottom: 1px dashed var(--widget-text-color);
      }
    }
  }
}

</style>
