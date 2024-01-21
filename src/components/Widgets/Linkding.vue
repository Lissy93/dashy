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
    filtertags() {
      return this.options.tags;
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
      const self = this;
      const fltr = (entry) => {
        if (self.filtertags === null) return true;
        for (let i = 0; i < self.filtertags.length; i += 1) {
          if (entry.tag_names.includes(self.filtertags[i])) return true;
        }
        return false;
      };
      this.links = data.results.filter(
        entry => fltr(entry),
      );
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
