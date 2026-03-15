<template>
<div class="rss-wrapper">
  <!-- Feed Meta Info -->
  <component
    :is="meta && meta.link ? 'a' : 'div'"
    class="meta-container"
    v-if="meta"
    :href="meta.link || undefined"
    :title="meta.description"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img class="feed-icon" :src="meta.image" v-if="meta.image" alt="Feed Image" />
    <div class="feed-text">
      <p class="feed-title">{{ meta.title }}</p>
      <p class="feed-author" v-if="meta.author">By {{ meta.author }}</p>
    </div>
  </component>
  <!-- Feed Content -->
  <div class="post-wrapper" v-if="posts">
    <div class="post-row" v-for="(post, indx) in posts" :key="indx">
      <component
        :is="post.link ? 'a' : 'div'"
        class="post-top"
        :href="post.link || undefined"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img class="post-img" :src="post.image" v-if="post.image" alt="Post Image">
        <div class="post-title-wrap">
          <p class="post-title">{{ post.title }}</p>
          <p class="post-date">
            {{ post.date | formatDate }} {{ post.author | formatAuthor }}
          </p>
        </div>
      </component>
      <div class="post-body" v-html="post.description"></div>
      <a
        class="continue-reading-btn"
        v-if="post.link"
        :href="post.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('widgets.general.open-link') }}
      </a>
    </div>
  </div>
  <!-- End Feed Content -->
</div>
</template>

<script>
import * as Parser from 'rss-parser';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { sanitizeRssItem, sanitizeRssMeta } from '@/utils/Sanitizer';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      meta: null,
      posts: null,
    };
  },
  computed: {
    /* The URL to users atom-format RSS feed */
    rssUrl() {
      if (!this.options.rssUrl) this.error('Missing feed URL');
      return this.options.rssUrl || '';
    },
    apiKey() {
      return this.parseAsEnvVar(this.options.apiKey);
    },
    parseLocally() {
      return this.options.parseLocally;
    },
    limit() {
      const usersChoice = this.options.limit;
      if (usersChoice) return usersChoice;
      return 10;
    },
    orderBy() {
      const usersChoice = this.options.orderBy;
      const options = ['title', 'pubDate', 'author'];
      if (usersChoice && options.includes(usersChoice)) return usersChoice;
      return 'pubDate';
    },
    orderDirection() {
      const usersChoice = this.options.orderDirection;
      if (usersChoice && (usersChoice === 'desc' || usersChoice === 'asc')) return usersChoice;
      return 'desc';
    },
    endpoint() {
      const apiKey = this.apiKey ? `&api_key=${this.apiKey}` : '';
      const limit = this.limit && this.apiKey ? `&count=${this.limit}` : '';
      const orderBy = this.orderBy && this.apiKey ? `&order_by=${this.orderBy}` : '';
      const direction = this.orderDirection ? `&order_dir=${this.orderDirection}` : '';
      if (this.parseLocally) {
        return this.rssUrl;
      } else {
        return `${widgetApiEndpoints.rssToJson}?rss_url=${encodeURIComponent(this.rssUrl)}`
          + `${apiKey}${limit}${orderBy}${direction}`;
      }
    },
  },
  filters: {
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      // Check if date is valid
      if (Number.isNaN(date.getTime())) return '';
      const localFormat = navigator.language;
      const dateFormat = { weekday: 'short', day: 'numeric', month: 'short' };
      return date.toLocaleDateString(localFormat, dateFormat);
    },
    formatAuthor(author) {
      return author ? `by ${author}` : '';
    },
  },
  methods: {
    /* Make GET request to whatever endpoint we are using */
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    /* Assign data variables to the returned data */
    async processData(data) {
      if (this.parseLocally) {
        const parser = new Parser();
        const {
          link, title, items, author, description, image,
        } = await parser.parseString(data);
        this.meta = sanitizeRssMeta({
          title,
          link,
          author,
          description,
          image,
        });
        this.processItems(items);
      } else {
        const { feed, items } = data;
        this.meta = sanitizeRssMeta({
          title: feed.title,
          link: feed.link,
          author: feed.author,
          description: feed.description,
          image: feed.image,
        });
        this.processItems(items);
      }
    },
    processItems(items) {
      const posts = [];
      let { length } = items;
      if (this.limit) {
        length = Math.min(length, this.limit);
      }
      for (let i = 0; length > i; i += 1) {
        const sanitized = sanitizeRssItem(items[i]);
        posts.push({
          title: sanitized.title,
          description: sanitized.description,
          image: sanitized.thumbnail,
          author: sanitized.author,
          date: sanitized.pubDate,
          link: sanitized.link,
        });
      }
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
