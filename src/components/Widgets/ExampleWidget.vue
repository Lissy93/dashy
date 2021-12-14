<template>
<div class="example-wrapper">
  <template v-if="images">
    <div v-for="(image, index) in images" :key="index" class="image-row">
      <p class="picture-title">{{ image.title }}</p>
      <img class="picture-result" :src="image.path"/>
    </div>
  </template>
</div>
</template>

<script>
/**
 * A simple example which you can use as a template for creating your own widget.
 * Takes two optional parameters (`text` and `count`), and fetches a list of images
 * from dummyapis.com, then renders the results to the UI.
 */

import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      images: null, // Will store our results from the API
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    /* Get the users chosen number of results, from this.options.count
     * If not present, or not a number, then return the default (5)
     */
    count() {
      const usersChoice = this.options.count;
      if (!usersChoice || !Number.isNaN(usersChoice)) {
        return 5;
      }
      return usersChoice;
    },
    /* Get users desired image text, or return `Dashy` */
    text() {
      const usersChoice = this.options.text;
      if (!usersChoice) return 'Dashy';
      return usersChoice;
    },
    /* Generate the data endpoint for the API request */
    endpoint() {
      return `${widgetApiEndpoints.exampleEndpoint}?text=${this.text}&noofimages=${this.count}`;
    },
  },
  methods: {
    /* The update() method extends mixin, used to update the data.
     * It's called by parent component, when the user presses update
     */
    update() {
      this.startLoading();
      this.fetchData();
    },
    /* Make the data request to the computed API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          // The request has completed successfully, call function to process the data
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          // If an error occurs, then calling this.error() will handle this gracefully
          this.error('Unable to fetch data', dataFetchError);
        })
        .finally(() => {
          // When the request is done, hide the loader
          this.finishLoading();
        });
    },
    /* Convert API response data into a format to be consumed by the UI */
    processData(response) {
      const results = [];
      response.forEach((image, index) => {
        results.push({
          path: image,
          title: `Image ${index + 1}`,
        });
      });
      // Now, in the HTML, we can reference the `images` array
      this.images = results;
    },
  },
};
</script>

<style scoped lang="scss">
.example-wrapper {
 .image-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    p.picture-title {
      font-size: 1.2rem;
      color: var(--widget-text-color);
    }
    img.picture-result {
      width: 4rem;
      margin: 0.5rem 0;
      border-radius: var(--curve-factor);
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}

</style>
