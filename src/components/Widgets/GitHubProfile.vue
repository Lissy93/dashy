<template>
<div class="readme-stats">
  <img class="stats-card" v-if="!hideProfileCard" :src="profileCard" alt="Profile Card" />
  <img class="stats-card" v-if="!hideLanguagesCard" :src="topLanguagesCard" alt="Languages" />
  <template v-if="repos">
    <img class="stats-card" v-for="(repo, i) in repoCards" :key="i" :src="repo" :alt="repo" />
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
    topLanguagesCard() {
      return `${widgetApiEndpoints.readMeStats}/top-langs/?username=${this.username}`
      + `${this.cardConfig}&langs_count=12`;
    },
    repoCards() {
      const cards = [];
      this.repos.forEach((repo) => {
        const username = repo.split('/')[0];
        const repoName = repo.split('/')[1];
        cards.push(`${widgetApiEndpoints.readMeStats}/pin/?username=${username}&repo=${repoName}`
        + `${this.cardConfig}&show_owner=true`);
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
