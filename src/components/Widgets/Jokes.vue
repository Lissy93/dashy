<template>
<div v-if="jokeType" class="joke-wrapper">
  <p class="joke joke-line-1">{{ jokeLine1 }}</p>
  <p class="joke joke-line-2" v-if="jokeLine2">{{ jokeLine2 }}</p>
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
      jokeType: null,
      jokeLine1: null,
      jokeLine2: null,
    };
  },
  computed: {
    /* Language code to fetch jokes for */
    language() {
      const supportedLanguages = ['en', 'cs', 'de', 'es', 'fr', 'pt'];
      const usersChoice = this.options.language;
      if (usersChoice && supportedLanguages.includes(usersChoice)) return usersChoice;
      const localLanguage = this.$store.getters.appConfig.lang;
      if (localLanguage && supportedLanguages.includes(localLanguage)) return localLanguage;
      return 'en';
    },
    /* Should enable safe mode, to disallow NSFW jokes */
    safeMode() {
      return !!this.options.safeMode;
    },
    /* Format the users preferred category  */
    category() {
      let usersChoice = this.options.category;
      if (!usersChoice) return 'any';
      if (Array.isArray(usersChoice)) usersChoice = usersChoice.join();
      const categories = ['any', 'misc', 'programming', 'dark', 'pun', 'spooky', 'christmas'];
      if (categories.some((cat) => usersChoice.toLowerCase().includes(cat))) return usersChoice;
      return 'any';
    },
    /* Combine data parameters for the API endpoint */
    endpoint() {
      return `${widgetApiEndpoints.jokes}${this.category}`
      + `?lang=${this.language}${this.safeMode ? '&safe-mode' : ''}`;
    },
  },
  methods: {
    /* Make GET request to Jokes API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          if (response.data.error) {
            this.error('No matching jokes returned', response.data.additionalInfo);
          }
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch any jokes', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.jokeType = data.type;
      if (this.jokeType === 'twopart') {
        this.jokeLine1 = data.setup;
        this.jokeLine2 = data.delivery;
      } else if (this.jokeType === 'single') {
        this.jokeLine1 = data.joke;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.joke-wrapper {
  p.joke {
    color: var(--widget-text-color);
    font-size: 1.2rem;
  }
}

</style>
