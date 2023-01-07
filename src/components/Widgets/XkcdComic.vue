<template>
<div class="xkcd-wrapper" v-tooltip="toolTip(alt)">
  <h3 class="xkcd-title">{{ title }}</h3>
  <a :href="`https://xkcd.com/${comicNum}/`">
    <img :src="image" :alt="alt" class="xkcd-comic"/>
  </a>
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
      image: null,
      title: '',
      alt: '',
      comicNum: '',
    };
  },
  computed: {
    /* Let user select which comic to display: random, latest or a specific number */
    comicNumber() {
      const usersChoice = this.options.comic;
      if (!usersChoice) {
        return 'latest';
      } else if (usersChoice === 'random') {
        return Math.abs(Math.floor(Math.random() * (1 - 2553)));
      }
      return usersChoice;
    },
    endpoint() {
      return `${widgetApiEndpoints.xkcdComic}?comic=${this.comicNumber}`;
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch data', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.image = data.img;
      this.title = data.safe_title;
      this.alt = data.alt;
      this.comicNum = data.num;
    },
    toolTip(alt) {
      const content = alt;
      return {
        content, html: false, trigger: 'hover focus', delay: 250, classes: 'xkcd-alt-tt',
      };
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
<style lang="scss">
.xkcd-alt-tt {
  min-width: 20rem;
}
</style>
