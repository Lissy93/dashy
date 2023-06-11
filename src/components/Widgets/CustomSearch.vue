<template>
  <div class="custom-search">
    <input type="text" v-model="query"
      @keyup.enter="search(defaultEngine)"
      @keyup.stop @keydown.stop
      :placeholder="placeholder">
    <div class="buttons">
      <button
        v-for="(engine, key) in engines" :key="key"
        v-on:click="search(engine)">
        {{ engine.title }}
      </button>
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
  },
  methods: {
    search(engine) {
      if (engine !== undefined && this.query !== '') {
        window.open(engine.url + this.query, '_blank');
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
