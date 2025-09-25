<template>
<div class="chuckNorris-wrapper">
  <p class="chuckNorris chuckNorris-line">{{ chuckNorrisLine }}</p>
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
      chuckNorrisLine: null,
    };
  },
  computed: {
    /* Format the users preferred categories  */
    categories() {
      let usersChoice = this.options.categories;
      if (!usersChoice) return '';
      if (Array.isArray(usersChoice)) usersChoice = usersChoice.join(',');
      const categories = ["animal","career","celebrity","dev","explicit","fashion","food","history","money","movie","music","political","religion","science","sport","travel"];
      if (categories.some((cat) => usersChoice.toLowerCase().includes(cat))) return usersChoice;
      return '';
    },
    /* Combine data parameters for the API endpoint */
    endpoint() {
      if (this.categories !== '') return `${widgetApiEndpoints.chuckNorris}?category=${this.categories}`;
      return `${widgetApiEndpoints.chuckNorris}`;
    },
  },
  methods: {
    /* Make GET request to ChuckNorris API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch any Chuck Norris quote', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
        this.chuckNorrisLine = data.value;
    },
  },
};
</script>

<style scoped lang="scss">
.chuckNorris-wrapper {
  p.chuckNorris {
    color: var(--widget-text-color);
    font-size: 1.2rem;
  }
}

</style>