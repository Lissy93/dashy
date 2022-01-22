<template>
<div class="news-wrapper" v-if="news">
  <div class="article" v-for="article in news" :key="article.id">
    <a class="headline" :href="article.url">{{ article.title }}</a>
    <div class="article-meta">
      <span class="publisher">{{ article.author }}</span>
      <span class="date">{{ article.published | date }}</span>
    </div>
    <p class="description">{{ article.description }}</p>
    <img class="thumbnail" v-if="article.image && !hideImages" :src="article.image" alt="Image" />
  </div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { timestampToDate } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      news: null,
    };
  },
  computed: {
    apiKey() {
      if (!this.options.apiKey) this.error('An API key is required, see docs for more info');
      return this.options.apiKey;
    },
    country() {
      return this.options.country ? `&country=${this.options.country}` : '';
    },
    category() {
      return this.options.category ? `&category=${this.options.category}` : '';
    },
    lang() {
      return this.options.lang ? `&language=${this.options.lang}` : '';
    },
    count() {
      return this.options.count ? `&page_size=${this.options.count}` : '';
    },
    keywords() {
      return this.options.keywords ? `&keywords=${this.options.keywords}` : '';
    },
    hideImages() {
      return this.options.hideImages;
    },
    endpoint() {
      return `${widgetApiEndpoints.news}?apiKey=${this.apiKey}`
      + `${this.country}${this.category}${this.lang}${this.count}`;
    },
  },
  filters: {
    date(date) {
      return timestampToDate(date);
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          if (!response.data.news || response.data.news.length === 0) {
            this.error('API didn\'t return any results for your query');
          }
          this.news = response.data.news;
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch data', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
  },
};
</script>

<style scoped lang="scss">
.news-wrapper {
  .article {
    padding-bottom: 1rem;
    a.headline {
      color: var(--widget-text-color);
      display: inline-block;
      font-weight: bold;
      font-size: 1.2rem;
      padding: 0.5rem 0;
      text-decoration: none;
      &:hover { text-decoration: underline; }
    }
    p.description {
      color: var(--widget-text-color);
    }
    img.thumbnail {
      width: 100%;
      max-width: 24rem;
      display: flex;
      margin: 0 auto;
      border-radius: var(--curve-factor);
    }
    .article-meta {
      display: flex;
      justify-content: space-between;
      color: var(--widget-text-color);
      opacity: var(--dimming-factor);
      font-size: 0.8rem;
    }
    &:not(:last-child) { border-bottom: 1px dashed var(--widget-text-color); }
  }
}
</style>
