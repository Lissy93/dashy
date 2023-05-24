<template>
<div class="hackernews-wrapper">
  <!-- Hackernews Trending Posts-->
  <div class="posts-wrapper" v-if="trendingPosts">
    <div class="post-row" v-for="(trendingPosts, index) in trendingPosts" :key="index">
      <a class="post-top" :href="trendingPosts.originURL">
        <div class="post-title-wrap">
          <p class="post-title">{{ trendingPosts.title }}</p>
          <div class="score-wrap">
            <p class="post-date">
              {{ formatDate(trendingPosts.time) }}
            </p>
            <p class="post-date" v-if="trendingPosts.score">score: {{ trendingPosts.score }}</p>
          </div>
        </div>
      </a>
    </div>
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
  computed: {
    storyType() {
      // This can be `beststories`, `topstories` or newstories
      // TODO: display error message if another string not matching the keywords was insert
      return this.options.stories || 'topstories';
    },
    limit() {
      return this.options.limit || 10;
    },
    endpoint() {
      return `${widgetApiEndpoints.hackernewsTrending}/${this.storyType}.json`;
    },
  },
  methods: {
    fetchData() {
      this.makeRequest(this.endpoint).then(this.fetchPostDetails);
    },
    async fetchPostDetails(data) {
      const topPosts = data.slice(0, this.limit);
      const allData = topPosts.map((post) => {
        const url = `${widgetApiEndpoints.hackernewsTrending}/item/${post}.json`;
        return this.makeRequest(url);
      })
      Promise.all(allData).then((resolvedPostValues) => {
        this.trendingPosts = resolvedPostValues.map((element, index) => {
          element.originURL = `https://news.ycombinator.com/item?id=${topPosts.at(index)}`
          return element
        });
        console.log(this.trendingPosts)
      });
    },
    formatDate(unixTime) {
            const date = new Date(unixTime * 1000);
                // Then specify how you want your dates to be formatted
            return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
        }
  },
};
</script>

<style scoped lang="scss">
.hackernews-wrapper {
 .meta-container {
    display: flex;
    align-items: center;
    text-decoration: none;
    margin: 0.25rem 0 0.5rem 0;
    p.feed-title {
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--widget-text-color);
    }
    p.feed-author {
      margin: 0;
      font-size: 0.8rem;
      opacity: var(--dimming-factor);
      color: var(--widget-text-color);
    }
    img.feed-icon {
      border-radius: var(--curve-factor);
      width: 2rem;
      height: 2rem;
      margin-right: 0.5rem;
    }
  }

  .post-row {
    border-top: 1px dashed var(--widget-text-color);
    padding: 0.5rem 0 0.25rem 0;
    .post-top {
      display: flex;
      align-items: center;
      text-decoration: none;
      p.post-title {
        margin: 0;
        font-size: 1rem;
        font-weight: bold;
        color: var(--widget-text-color);
      }
      p.post-date {
        font-size: 0.8rem;
        margin: 0;
        opacity: var(--dimming-factor);
        color: var(--widget-text-color);
      }
      img.post-img {
        border-radius: var(--curve-factor);
        width: 2rem;
        height: 2rem;
        margin-right: 0.5rem;
      }
    }
    .post-body {
      font-size: 0.85rem;
      color: var(--widget-text-color);
      max-height: 400px;
      overflow: hidden;
      ::v-deep p {
        margin: 0.5rem 0;
      }
      ::v-deep img {
        max-width: 80%;
        display: flex;
        margin: 0 auto;
        border-radius: var(--curve-factor);
      }
      ::v-deep a {
        color: var(--widget-text-color);
      }
      ::v-deep svg path {
        fill: var(--widget-text-color);
      }
      ::v-deep blockquote {
        margin-left: 0.5rem;
        padding-left: 0.5rem;
        border-left: 4px solid var(--widget-text-color);
      }
      ::v-deep .avatar.avatar-user { display: none; }
    }
  }
}
</style>
