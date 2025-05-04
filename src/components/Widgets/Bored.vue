<template>
<div v-if="activity.activity" class="bored-container">
  <h2 v-if="title" class="bored-title">{{ title }}</h2>
  <h2>
    {{ activity.activity }}
    <a v-if="activity.link" :href="activity.link" target="_blank"> &#128712;</a>
  </h2>

  <p v-if="metadata">
    <span v-if="activity.type" class="metadata">
      <strong>Type:</strong> {{ activity.type }}
    </span>
    <span v-if="activity.participants" class="metadata">
    <strong>Participants:</strong> {{ activity.participants }}
    </span>
    <span v-if="activity.key" class="metadata">
      <strong>Key:</strong> {{ activity.key }}
    </span>
    <span v-if="activity.price" class="metadata">
      <strong>Price:</strong> {{ activity.price }}
    </span>
    <span v-if="activity.accessibility" class="metadata">
      <strong>accessibility:</strong> {{ activity.accessibility }}
    </span>
  </p>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      activity: null,
    };
  },
  computed: {
    type() {
      if (this.options.type !== undefined) {
        return this.options.type;
      }
      return '';
    },
    participants() {
      if (this.options.participants !== undefined) {
        return this.options.participants;
      }
      return '';
    },
    title() {
      if (this.options.title !== undefined) {
        return this.options.title;
      }
      return '';
    },
    metadata() {
      if (this.options.metadata !== undefined) {
        return this.options.metadata;
      }
      return true;
    },
    price() {
      if (this.options.price !== undefined) {
        return this.options.price;
      }
      return '';
    },
    minprice() {
      if (this.options.minprice !== undefined) {
        return this.options.minprice;
      }
      return '';
    },
    maxprice() {
      if (this.options.maxprice !== undefined) {
        return this.options.maxprice;
      }
      return '';
    },
    accessibility() {
      if (this.options.accessibility !== undefined) {
        return this.options.accessibility;
      }
      return '';
    },
    minaccessibility() {
      if (this.options.minaccessibility !== undefined) {
        return this.options.minaccessibility;
      }
      return '';
    },
    maxaccessibility() {
      if (this.options.maxaccessibility !== undefined) {
        return this.options.maxaccessibility;
      }
      return '';
    },
    endpoint() {
      let url = `http://www.boredapi.com/api/activity?type=${this.type}`;
      if (this.participants !== '') {
        url += `&participants=${this.participants}`;
      }
      if (this.accessibility !== '') {
        url += `&accessibility=${this.accessibility}`;
      } else {
        if (this.minaccessibility !== '') {
          url += `&minaccessibility=${this.minaccessibility}`;
        }
        if (this.maxaccessibility !== '') {
          url += `&maxaccessibility=${this.maxaccessibility}`;
        }
      }
      if (this.price !== '') {
        url += `&price=${this.price}`;
      } else {
        if (this.minprice !== '') {
          url += `&minprice=${this.minprice}`;
        }
        if (this.maxprice !== '') {
          url += `&maxprice=${this.maxprice}`;
        }
      }
      return url;
    },
  },
  methods: {
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          if (response.data.error) {
            this.error('No matching activities returned', response.data.additionalInfo);
          }
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch any activities', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      this.activity = data;
    },
  },
};
</script>

<style scoped lang="scss">
.bored-container {
  h2 {
    color: var(--widget-text-color);
  }
  .bored-title {
    outline: 2px solid transparent;
    border: 1px solid var(--outline-color);
    border-radius: var(--curve-factor);
    box-shadow: var(--item-shadow);
    color: var(--item-text-color);
    margin: .5rem;
    padding: 0.3rem;
    background: var(--item-background);
    text-align: center;

    a {
      text-decoration: none;
      color: var(--item-text-color);
    }
  }
  span.metadata {
    display:inline-block;
    width: 50%;
    color: var(--widget-text-color);
  }
}
</style>
