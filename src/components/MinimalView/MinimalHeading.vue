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
  margin-bottom: 0;
  background: var(--minimal-view-section-heading-background);
  border: 1px solid var(--minimal-view-section-heading-color);
  border-bottom: none;
  border-radius: var(--curve-factor) var(--curve-factor) 0 0;
  h3 {
    margin: 0;
    color: var(--minimal-view-section-heading-color);
  }
  &.selected {
    background: var(--minimal-view-section-heading-color);
    h3 {
      color: var(--minimal-view-section-heading-background);
    }
  }
}

</style>
