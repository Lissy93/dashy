<template>
  <div class="custom-list">
    <div class="custom-list-title" v-if="title">
        {{ title }}
    </div>
    <div v-for="(item, key) in data" :key="key" class="custom-list-row">
      <div v-if="item.link" class="custom-list-cell">
        <a :href="item.link.url" :title="item.link.title" target="_blank">
          {{ item.link.text }}
        </a>
      </div>
      <div v-if="item.value" class="custom-list-cell" :title="item.value.title">
        {{ item.value.text }}
        <span v-if="item.isNew" class="custom-list-new-value"></span>
      </div>
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
      data: [],
    };
  },
  computed: {
    url() {
      return this.options.url || '';
    },
    title() {
      return this.options.title || '';
    },
    daysForNew() {
      return parseInt(Number(this.options.daysForNew), 10) || false;
    },
  },
  methods: {
    fetchData() {
      if (this.url) {
        this.startLoading();
        this.makeRequest(this.options.url).then(this.processData);
      }
    },
    processData(data) {
      const today = new Date();
      this.data = data.sort((a, b) => new Date(a.date) < new Date(b.date));
      if (this.daysForNew) {
        const threshold = this.daysForNew * 1000 * 60 * 60 * 24;
        this.data = this.data.map((item) => ({
          ...item,
          isNew: (today - new Date(item.date) < threshold),
        }));
      }
      this.finishLoading();
    },
  },
};

</script>

<style scoped lang="scss">

.custom-list {
  .custom-list-title {
    outline: 2px solid transparent;
    border: 1px solid var(--outline-color);
    border-radius: var(--curve-factor);
    box-shadow: var(--item-shadow);
    color: var(--item-text-color);
    margin: .5rem;
    padding: 0.3rem;
    background: var(--item-background);
    text-align: center;

  }
  .custom-list-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--widget-text-color);
    font-size: 1.1rem;
    .custom-list-cell {
      display: inline-block;
      a {
        text-decoration: none;
        color: var(--item-text-color);
      }
      .custom-list-new-value{
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
        background-color: var(--success);
        display: inline-block;
      }
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}
</style>
