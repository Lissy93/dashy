<template>
<div class="tfl-status">
  <template v-if="lineStatuses">
    <div v-for="line in filterLines" :key="line.index" class="line-row">
      <p class="row name">{{ line.line }}</p>
      <p :class="`row status ${getStatusColor(line.statusCode)}`">{{ line.status }}</p>
      <p class="row disruption" v-if="line.disruption">{{ line.disruption | format }}</p>
    </div>
    <div v-if="!showAll" class="line-row">
      <p class="row all-other">
        {{
          filterLines.length > 0 ?
          $t('widgets.tfl-status.good-service-rest') :
          $t('widgets.tfl-status.good-service-all')
        }}
      </p>
    </div>
    <p class="more-details-btn" @click="toggleAllLines">
      {{ showAll ? $t('widgets.general.show-less') : $t('widgets.general.show-more') }}
    </p>
  </template>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      lineStatuses: null,
      showAll: false,
    };
  },
  computed: {
    /* Return only the lines without a good service, unless showing all */
    filterLines() {
      if (this.showAll) { return this.lineStatuses; }
      return this.lineStatuses.filter((line) => line.statusCode !== 10);
    },
  },
  filters: {
    format(description) {
      const parts = description.split(':');
      return parts.length > 1 ? parts[1] : parts[0];
    },
  },
  methods: {
    /* Makes GET request to the TFL API */
    fetchData() {
      axios.get(widgetApiEndpoints.tflStatus)
        .then((response) => {
          this.lineStatuses = this.processData(response.data);
        })
        .catch(() => {
          this.error('Unable to fetch data from TFL API');
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Processes the results to be rendered by the UI */
    processData(data) {
      let results = [];
      data.forEach((line, index) => {
        results.push({
          index,
          line: line.name,
          statusCode: line.lineStatuses[0].statusSeverity,
          status: line.lineStatuses[0].statusSeverityDescription,
          disruption: line.lineStatuses[0].reason,
        });
      });
      if (!this.options.sortAlphabetically) {
        results = this.sortByStatusCode(results);
      }
      if (this.options.linesToShow && Array.isArray(this.options.linesToShow)) {
        results = this.filterByLineName(results, this.options.linesToShow);
      }
      return results;
    },
    /* Get color, depending on the status code */
    getStatusColor(code) {
      if (code === 20) return 'dark'; // Strike action
      if (code === 0) return 'info'; // Special service or upcoming planned works
      if (code <= 6) return 'red'; // Closed, part-closed or severe delays
      if (code <= 9) return 'orange'; // Minor delays, planned bus replacement
      return 'green'; // Good Service - Everything is awesome!
    },
    /* If user only wants to see results from certain lines, filter the rest out */
    filterByLineName(allLines, usersLines) {
      const chosenLines = usersLines.map(name => name.toLowerCase());
      const filtered = allLines.filter((line) => chosenLines.includes(line.line.toLowerCase()));
      if (filtered.length < 1) {
        this.error('No TFL lines match your filter');
        return allLines;
      }
      return filtered;
    },
    /* Sort results in order of most-delayed first */
    sortByStatusCode(lines) {
      return lines.reverse().sort((a, b) => (a.statusCode > b.statusCode ? 1 : -1));
    },
    /* Toggle show/ hide all lines */
    toggleAllLines() {
      this.showAll = !this.showAll;
    },
  },
};
</script>

<style scoped lang="scss">

.tfl-status {
  .line-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0.5rem 0.25rem;
    .row {
      margin: 0.2rem 0;
    }
    .status {
      font-weight: bold;
      text-align: right;
      &.green { color: var(--success); }
      &.orange { color: var(--warning); }
      &.red { color: var(--danger); }
      &.info { color: var(--info); }
      &.dark { color: #fa360f; }
    }
    .disruption {
      opacity: var(--dimming-factor);
      font-size: 0.85rem;
      grid-column-start: span 2;
    }
    .all-other {
      grid-column-start: span 2;
      font-weight: bold;
      text-align: center;
      color: var(--success)
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
  p {
    color: var(--widget-text-color);
    cursor: default;
    margin: 0;
  }
  // Show more details button
  .more-details-btn {
    cursor: pointer;
    text-align: center;
    margin: 0.5rem 0.25rem 0.25rem;
    padding: 0.1rem 0.25rem;
    border: 1px solid transparent;
    border-radius: var(--curve-factor);
    &:hover {
      border: 1px solid var(--widget-text-color);
    }
    &:focus, &:active {
      background: var(--widget-text-color);
      color: var(--widget-background-color);
    }
  }
}

</style>
