<template>
<div class="linkding-outer-wrapper">
  <div class="linkding-wrapper" v-if="links">
    <ul>
      <li
        v-for="link in links"
        v-bind:key="link.id"
        class="lingkding-link"
      >
        <a :href="link.url" target="_blank">
          <span class="linktext" v-tooltip="link.description">{{link.title}}</span>
        </a>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      links: null,
    };
  },
  computed: {
    endpoint() {
      if (!this.options.host) this.error('linkgding Host is required');
      return `${this.options.host}/api/bookmarks`;
    },
    apiKey() {
      if (!this.options.apiKey) this.error('linkgding apiKey is required');
      return this.options.apiKey;
    },
  },
  methods: {
    update() {
      this.startLoading();
      this.fetchData();
      this.finishLoading();
    },
    fetchData() {
      const authHeaders = { Authorization: `Token ${this.apiKey}` };
      this.makeRequest(this.endpoint, authHeaders).then(
        (response) => { this.processData(response); },
      );
    },
    processData(data) {
      this.links = data.results;
    },
  },
};
</script>

<style scoped lang="scss">
.linkdign-wrapper {
}
</style>
<style scoped lang="scss">
.linkding-wrapper {

  ul {
    list-style: none;
    padding: 0px;
    color: var(--widget-text-color);
  li {
    opacity: var(--dimming-factor);
    a, a:hover, a:visited, a:active {
        font-weight: bold;
      color: var(--widget-text-color);
    }
    span.linktext {
      color: var(--widget-text-color);
    }
    padding-top:0.2em;
    padding-bottom:0.2em;
    &:before
    {
        content: '🔗';
        margin: 0 0.7em;    /* any design */
    }
  }
  }
}
</style>
