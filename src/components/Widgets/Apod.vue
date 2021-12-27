<template>
<div class="apod-wrapper" v-if="image">
  <a :href="link" class="title" target="__blank" title="View Article">
    {{ title }}
  </a>
  <a :href="hdImage" title="View HD Image" class="picture" target="__blank">
    <img :src="image" :alt="title" />
  </a>
  <p class="copyright">{{ copyright }}</p>
  <p class="description">{{ truncatedDescription }}</p>
  <p @click="toggleShowFull" class="expend-details-btn">
    {{ showFullDesc ? $t('widgets.general.show-less') : $t('widgets.general.show-more') }}
  </p>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      title: null,
      image: null,
      hdImage: null,
      link: null,
      description: null,
      copyright: null,
      showFullDesc: false,
    };
  },
  computed: {
    truncatedDescription() {
      return this.showFullDesc ? this.description : `${this.description.substring(0, 100)}...`;
    },
  },
  methods: {
    fetchData() {
      axios.get(widgetApiEndpoints.astronomyPictureOfTheDay)
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
    processData(data) {
      this.title = data.title;
      this.image = data.url;
      this.hdImage = data.hdurl;
      this.link = data.apod_site;
      this.description = data.description;
      this.copyright = data.copyright;
    },
    toggleShowFull() {
      this.showFullDesc = !this.showFullDesc;
    },
  },
};
</script>

<style scoped lang="scss">
.apod-wrapper {
  a.title {
    font-size: 1.5rem;
    margin: 0.5rem 0;
    color: var(--widget-text-color);
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
  a.picture img {
    width: 100%;
    margin: 0.5rem auto;
    border-radius: var(--curve-factor);
  }
  p.copyright {
    font-size: 0.8rem;
    margin: 0.2rem 0;
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
  }
  p.description {
    color: var(--widget-text-color);
    font-size: 1rem;
    margin: 0.5rem 0;
  }
  p.expend-details-btn {
    cursor: pointer;
    float: right;
    margin: 0;
    padding: 0.1rem 0.25rem;
    border: 1px solid transparent;
    color: var(--widget-text-color);
    opacity: var(--dimming-factor);
    border-radius: var(--curve-factor);
    &:hover {
      border: 1px solid var(--widget-text-color);
    }
    &:focus, &:active {
      background: var(--widget-text-color);
      color: var(--widget-background-color);
    }
  }
}

</style>
