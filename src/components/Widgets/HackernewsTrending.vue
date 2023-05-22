<template>
<div class="hackernews-wrapper">
  <h3>Hackernews Trending</h3>

  <!-- Hackernews Trending Posts-->
  <div class="posts-wrapper">

  </div>
</div>
</template>

<script>
// import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      trendingPosts: null,
    };
  },
  filters: {
    debug() { console.debug('Not implemented'); },
  },
  computed: {
    storyType() {
      // This can be `beststories`, `topstories` or newstories
      return this.options.stories || 'beststories';
    },
    limit() {
      return this.options.limit || 10;
    },
    endpoint() {
      return `${widgetApiEndpoints.hackernewsTrending}/${this.storyType}.json`
    },
  },
  methods: {
    fetchData() {
      console.log("Let's fetch some Data");
      this.makeRequest(this.endpoint).then(this.fetchPostDetails)
    },
    async fetchPostDetails(data) {
      const topPosts = data.slice(0, this.limit)
      const allData = topPosts.map((post) => {
        const url = `${widgetApiEndpoints.hackernewsTrending}/item/${post}.json`;
        return this.makeRequest(url);
      })
      Promise.all(allData).then((values) => console.log(values))
    },
  },
};
</script>
