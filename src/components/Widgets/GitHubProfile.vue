<template>
<div class="readme-stats">
  <a v-if="!hideProfileCard" :href="profileCardLink" target="_blank">
    <img class="stats-card" :src="profileCard" alt="Profile Card" />
  </a>
  <a v-if="!hideLanguagesCard" :href="profileCardLink" target="_blank">
    <img class="stats-card" :src="topLanguagesCard" alt="Languages" />
  </a>
  <template v-if="repos">
    <a v-for="(repo, i) in repoCards" :key="i" :href="repo.cardHref" target="_blank">
      <img class="stats-card" :src="repo.cardSrc" :alt="repo" />
    </a>
  </template>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  computed: {
    hideProfileCard() {
      return this.options.hideProfileCard;
    },
    hideLanguagesCard() {
      return this.options.hideLanguagesCard;
    },
    username() {
      const usersChoice = this.options.username;
      if ((!this.hideProfileCard || !this.hideLanguagesCard) && !usersChoice) {
        this.error('You must specify a GitHub username');
      }
      return usersChoice;
    },
    repos() {
      const usersChoice = this.options.repos;
      if (!usersChoice) return null;
      if (typeof usersChoice === 'string') return [usersChoice];
      if (Array.isArray(usersChoice)) return usersChoice;
      this.error('Invalid format for repositories input');
      return null;
    },
    colors() {
      const cssVars = getComputedStyle(document.documentElement);
      const getColor = (colorVar) => cssVars.getPropertyValue(`--${colorVar}`).trim().replace('#', '');
      const primary = getColor('widget-text-color') || '7cd6fd';
      const accent = getColor('widget-accent-color') || '7cd6fd';
      const background = getColor('widget-background-color') || '7cd6fd';
      const radius = getColor('curve-factor').replace('px', '') || '6';
      const white = getColor('white') || 'fff';
      return {
        primary, accent, background, white, radius,
      };
    },
    locale() {
      if (this.options.lang) return this.options.lang;
      return this.$store.getters.appConfig.lang || 'en';
    },
    cardConfig() {
      const c = this.colors;
      return `&title_color=${c.primary}&text_color=${c.white}&icon_color=${c.primary}`
        + `&bg_color=${c.background}&border_radius=${c.radius}&locale=${this.locale}`
        + '&count_private=true&show_icons=true&hide_border=true';
    },
    profileCard() {
      return `${widgetApiEndpoints.readMeStats}?username=${this.username}${this.cardConfig}`;
    },
    profileCardLink() {
      return `https://github.com/${this.username}`;
    },
    topLanguagesCard() {
      return `${widgetApiEndpoints.readMeStats}/top-langs/?username=${this.username}`
      + `${this.cardConfig}&langs_count=12`;
    },
    repoCards() {
      const cards = [];
      this.repos.forEach((repo) => {
        const username = repo.split('/')[0];
        const repoName = repo.split('/')[1];
        cards.push({
          cardSrc: `${widgetApiEndpoints.readMeStats}/pin/?username=${username}`
            + `&repo=${repoName}${this.cardConfig}&show_owner=true`,
          cardHref: `https://github.com/${username}/${repoName}`,
        });
      });
      return cards;
    },
  },
};
</script>

<style scoped lang="scss">
.readme-stats {
  img.stats-card {
    width: 100%;
  }
}

</style>
