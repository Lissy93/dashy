<template>
    <div class="rescuetime-wrapper">
    <div class="title-row">
        <p class="title-rank">Rank</p>
        <p class="title-name">Category</p>
        <p class="title-time">Time spent</p>
    </div>
      <div
        v-for="(category, indx) in categories"
        :key="indx"
        class="category-row"
      >
        <p class="category-rank">{{ category.rank }}</p>
        <p class="category-name">{{ indx }}</p>
        <p class="category-time">{{ category.minutes }} min</p>
      </div>
    </div>
    </template>
<script>

import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      categories: [],
    };
  },
  mounted() {
    this.checkOptions();
  },
  computed: {
    endpoint() {
      const todaystring = this.getDate();
      return `${widgetApiEndpoints.rescueTime}?key=${this.options.apiKey}&restrict_begin=${todaystring}&restrict_end=${todaystring}&restrict_kind=overview&format=json`;
    },
  },
  methods: {
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    processData(data) {
      const formateddata = this.calculateTimeCategories(data);
      this.categories = formateddata;
    },
    checkOptions() {
      const ops = this.options;
      if (!ops.apiKey) this.error('Missing API key for RescueTime');
    },
    getDate() {
      const today = new Date();
      let day = today.getDate();
      let month = today.getMonth() + 1;
      const year = today.getFullYear();
      if (day < 10) {
        day = `0${day}`;
      }
      if (month < 10) {
        month = `0${month}`;
      }
      return `${day}-${month}-${year}`;
    },
    calculateTimeCategories(timeArray) {
      const results = {};
      for (let i = 0; i < timeArray.rows.length; i += 1) {
        const [rank, seconds, persons, category] = timeArray.rows[i];
        const minutes = (parseInt(seconds, 10) / 60).toFixed(2);
        results[category] = { minutes, rank, persons };
      }
      return results;
    },
  },
};

</script>

<style scoped lang="scss">
.rescuetime-wrapper {
  padding: 0.5rem 0;
    .title-row {
        display: flex;
        justify-content: space-between;
        p {
            margin: 0.25rem 0;
            color: var(--widget-text-color);
            font-weight: 700;
            font-size: 1.15rem;
        }
        &:not(:last-child) {
            border-bottom: 1px dashed var(--widget-text-color);
        }
    }
    .category-rank {
        font-weight: 700;
    }
  .category-row {
    display: flex;
    justify-content: space-between;
    p {
      margin: 0.25rem 0;
      color: var(--widget-text-color);
      opacity: var(--dimming-factor);
    }
  }
}

</style>
