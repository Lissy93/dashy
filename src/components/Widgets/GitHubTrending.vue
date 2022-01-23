<template>
<div class="trending-repos-wrapper" v-if="trendingRepos">
  <div v-for="repo in trendingRepos" :key="repo.idx" class="repo-row">
    <img class="repo-img" v-if="repo.avatar" :src="repo.avatar" alt="Repo" />
    <div class="repo-info">
      <p class="repo-name">{{ repo.name }}</p>
      <div class="star-wrap">
        <p class="all-stars" v-if="repo.stars">{{ repo.stars | formatStars }}</p>
        <p class="new-stars" v-if="repo.newStars">↑{{ repo.newStars | formatStars }}</p>
      </div>
      <a class="repo-link" :href="repo.link">{{ repo.slug }}</a>
      <p class="repo-desc">{{ repo.desc }}</p>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { capitalize, showNumAsThousand } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      trendingRepos: null,
    };
  },
  filters: {
    formatStars(starCount) {
      if (!starCount) return null;
      const numericCount = typeof starCount === 'string'
        ? parseInt(starCount.replaceAll(',', ''), 10) : starCount;
      return `${showNumAsThousand(numericCount) || starCount} ★`;
    },
  },
  computed: {
    since() {
      const usersChoice = this.options.since;
      const options = ['daily', 'weekly', 'monthly'];
      if (usersChoice && options.includes(usersChoice)) return usersChoice;
      return options[0];
    },
    lang() {
      return this.options.lang || '';
    },
    limit() {
      return this.options.limit || 10;
    },
    endpoint() {
      return `${widgetApiEndpoints.githubTrending}repo?since=${this.since}&lang=${this.lang}`;
    },
  },
  methods: {
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          if (response.data.items) {
            this.processData(response.data.items);
          }
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch data', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    processData(repos) {
      const mkeName = (r) => capitalize(r.split('/')[1].replaceAll('-', ' ').replaceAll('_', ' '));
      let results = [];
      repos.forEach((repo) => {
        results.push({
          name: mkeName(repo.repo),
          slug: repo.repo,
          desc: repo.desc,
          lang: repo.lang,
          link: repo.repo_link,
          stars: repo.stars,
          forks: repo.forks,
          newStars: parseInt(repo.added_stars, 10),
          avatar: repo.avatars[0] || 'https://github.com/fluidicon.png',
        });
      });
      if (this.limit && this.limit < results.length) {
        results = results.slice(0, this.limit);
      }
      this.trendingRepos = results;
    },
  },
};
</script>

<style scoped lang="scss">
.trending-repos-wrapper {
 .repo-row {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
    cursor: default;
    img.repo-img {
      width: 2.5rem;
      border-radius: var(--curve-factor-small);
    }
    .repo-info {
      display: grid;
      width: 100%;
      grid-template-columns: auto 1fr;
      padding-left: 0.5rem;
      p.repo-name {
        margin: 0.1rem 0;
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--widget-text-color);
      }
      a.repo-link {
        margin: 0.1rem 0;
        font-size: 0.8rem;
        text-decoration: underline;
        color: var(--widget-text-color);
        opacity: var(--dimming-factor);
      }
      p.repo-desc {
        grid-column-start: span 2;
        margin: 0.1rem 0 0.25rem;
        font-size: 0.8rem;
        color: var(--widget-text-color);
      }
      .star-wrap {
        grid-row-start: span 2;
        min-width: 3rem;
        text-align: right;
        p {
          font-family: var(--font-monospace);
           margin: 0;
           &.all-stars {
            color: var(--widget-text-color);
            font-size: 1.2rem;
            font-weight: bold;
          }
          &.new-stars {
            font-size: 0.8rem;
            color: var(--success);
            opacity: var(--dimming-factor);
          }
        }
      }
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
 }
}

</style>
