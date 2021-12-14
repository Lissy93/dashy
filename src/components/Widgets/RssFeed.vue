<template>
<div class="rss-wrapper">
  <!-- Feed Meta Info -->
  <a class="meta-container" v-if="meta" :href="meta.link" :title="meta.description">
    <img class="feed-icon" :src="meta.image" v-if="meta.image" />
    <div class="feed-text">
      <p class="feed-title">{{ meta.title }}</p>
      <p class="feed-author" v-if="meta.author">By {{ meta.author }}</p>
    </div>
  </a>
  <!-- Feed Content -->
  <div class="post-wrapper" v-if="posts">
    <div class="post-row" v-for="(post, indx) in posts" :key="indx">
      <a class="post-top" :href="post.link">
        <img class="post-img" :src="post.image" v-if="post.image">
        <div class="post-title-wrap">
          <p class="post-title">{{ post.title }}</p>
          <p class="post-date">
            {{ post.date | formatDate }} {{ post.author | formatAuthor }}
          </p>
        </div>
      </a>
      <div class="post-body" v-html="post.description"></div>
      <a class="continue-reading-btn" :href="post.link">Continue Reading</a>
    </div>
  </div>
  <!-- End Feed Content -->
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      meta: null,
      posts: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    /* The URL to users atom-format RSS feed */
    rssUrl() {
      if (!this.options.rssUrl) this.error('Missing feed URL');
      return encodeURIComponent(this.options.rssUrl || '');
    },
    apiKey() {
      return this.options.apiKey;
    },
    limit() {
      const usersChoice = this.options.limit;
      if (usersChoice && !Number.isNaN(usersChoice)) return usersChoice;
      return 10;
    },
    orderBy() {
      const usersChoice = this.options.orderBy;
      const options = ['title', 'pubDate', 'author'];
      if (usersChoice && options.includes(usersChoice)) return usersChoice;
      return 'pubDate';
    },
    orderDirection() {
      const usersChoice = this.options.orderBy;
      if (usersChoice && (usersChoice === 'desc' || usersChoice === 'asc')) return usersChoice;
      return 'desc';
    },
    endpoint() {
      const apiKey = this.apiKey ? `&api_key=${this.apiKey}` : '';
      const limit = this.limit && this.apiKey ? `&count=${this.limit}` : '';
      const orderBy = this.orderBy && this.apiKey ? `&order_by=${this.orderBy}` : '';
      const direction = this.orderDirection ? `&order_dir=${this.orderDirection}` : '';
      return `${widgetApiEndpoints.rssToJson}?rss_url=${this.rssUrl}`
        + `${apiKey}${limit}${orderBy}${direction}`;
    },
  },
  filters: {
    formatDate(timestamp) {
      const localFormat = navigator.language;
      const dateFormat = { weekday: 'short', day: 'numeric', month: 'short' };
      const date = new Date(timestamp).toLocaleDateString(localFormat, dateFormat);
      return date;
    },
    formatAuthor(author) {
      return author ? `by ${author}` : '';
    },
  },
  methods: {
    /* Extends mixin, and updates data. Called by parent component */
    update() {
      this.startLoading();
      this.fetchData();
    },
    /* Make GET request to Rss2Json */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((error) => {
          this.error('Unable to RSS feed', error);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const { feed, items } = data;
      this.meta = {
        title: feed.title,
        link: feed.link,
        author: feed.author,
        description: feed.description,
        image: feed.image,
      };
      const posts = [];
      items.forEach((post) => {
        posts.push({
          title: post.title,
          description: post.description,
          image: post.thumbnail,
          author: post.author,
          date: post.pubDate,
          link: post.link,
        });
      });
      this.posts = posts;
    },
  },
};
</script>

<style scoped lang="scss">
.rss-wrapper {
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
      .post-title-wrap {}
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
    a.continue-reading-btn {
      width: 100%;
      display: block;
      font-size: 0.9rem;
      text-align: right;
      margin: 0 0 0.25rem;
      padding: 0.1rem 0.25rem;
      text-decoration: none;
      opacity: var(--dimming-factor);
      color: var(--widget-text-color);
      &:hover, &:focus {
        opacity: 1;
        text-decoration: underline;
      }
    }
  }
}
</style>
