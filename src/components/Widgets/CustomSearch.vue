<template>
  <div class="custom-search">
    <input type="text" v-model="query"
      @keyup.enter="search(defaultEngine)"
      @keyup.stop @keydown.stop
      :placeholder="placeholder">
    <div class="buttons">
      <button
        v-for="(engine, key) in engines" :key="key"
        v-on:click="search(engine, openingMethod)">
        {{ engine.title }}
      </button>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import WidgetMixin from '@/mixins/WidgetMixin';
import ErrorHandler from '@/utils/ErrorHandler';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      query: '',
    };
  },
  computed: {
    placeholder() {
      return this.options.placeholder || '';
    },
    engines() {
      return this.options.engines || [];
    },
    defaultEngine() {
      return this.engines[0];
    },
    openingMethod() {
      return this.options.openingMethod || '';
    },
  },
  methods: {
    search(engine, openingMethod) {
      if (engine !== undefined && this.query !== '') {
        const url = engine.url + this.query;
        switch (openingMethod) {
          case 'newtab':
            window.open(url, '_blank');
            break;
          case 'sametab':
            window.open(url, '_self');
            break;
          case 'workspace':
            router.push({ name: 'workspace', query: { url } });
            break;
          default:
            ErrorHandler(`Unknown opening method: ${openingMethod}`);
            window.open(url, '_blank');
        }
      }
    },
  },
};

</script>

<style scoped lang="scss">

.custom-search {
  font-size: 1.2rem;
  input {
    width: 80%;
    margin: 1rem 10%;
    padding: 0.5rem;
    font-size: 1.2rem;
  }
  .buttons {
    text-align:center;
    button{
      margin: 0.5rem;
      padding: 0.5rem;
      border: none;
      color: var(--item-text-color);
      background: var(--item-background);
      font-size: 1.2rem;
    }

  }

}
</style>
