<template>
<div class="xkcd-wrapper">
  <h3 class="xkcd-title">{{ title }}</h3>
  <a :href="`https://xkcd.com/${comicNum}/`">
    <img :src="image" :alt="alt" class="xkcd-comic" />
  </a>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import ErrorHandler from '@/utils/ErrorHandler';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      image: null,
      title: '',
      alt: '',
      comicNum: '',
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    /* Let user select which comic to display: random, latest or a specific number */
    comicNumber() {
      const usersChoice = this.options.comic;
      if (!usersChoice) {
        return 'latest';
      } else if (usersChoice === 'random') {
        return Math.abs(Math.floor(Math.random() * (1 - 2553)));
      } else if (!Number.isNaN(usersChoice)) {
        return usersChoice;
      }
      return 'latest';
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(`${widgetApiEndpoints.xkcdComic}?comic=${this.comicNumber}`)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          ErrorHandler('Unable to fetch data', dataFetchError);
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.image = data.img;
      this.title = data.safe_title;
      this.alt = data.alt;
      this.comicNum = data.num;
    },
  },
};
</script>

<style scoped lang="scss">
.xkcd-wrapper {
 .xkcd-title {
    font-size: 1.2rem;
    margin: 0.25rem auto;
    color: var(--widget-text-color);
  }
  .xkcd-comic {
    display: flex;
    width: 100%;
    max-width: 380px;
    margin: 0.25rem auto;
    border-radius: var(--curve-factor);
  }
}

</style>
