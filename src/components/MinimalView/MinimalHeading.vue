<template>
  <div
    @click="selectSection(index)"
    :class="`minimal-section-heading ${selected ? 'selected' : ''}`">
    <h3>{{ title }}</h3>
  </div>
</template>

<script>

export default {
  name: 'MinimalHeadings',
  props: {
    index: Number,
    title: String,
    selected: Boolean,
  },
  methods: {
    selectSection(index) {
      this.$emit('sectionSelected', index);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

div.minimal-section-heading {
  cursor: pointer;
  padding: 0.5rem 0.25rem;
  border-radius: var(--curve-factor);
  border: 1px solid var(--primary);
  border-bottom: none;
  border-radius: var(--curve-factor) var(--curve-factor) 0 0;
  margin-bottom: 0;
  h3 {
    margin: 0;
    color: var(--primary);
  }
  &.selected {
    background: var(--primary);
    h3 {
      color: var(--item-group-heading-text-color);
    }
  }
}

</style>
