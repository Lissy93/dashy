<template>
  <div class="page-titles">
    <h1>{{ title }}</h1>
    <span class="subtitle">{{ description }}</span>
  </div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    title: String,
    description: String,
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

.page-titles {
  display: flex;
  flex-direction: column;
  h1 {
    color: var(--heading-text-color);
    font-size: 2.5rem;
    margin: 0;
  }
  span.subtitle {
    color: var(--heading-text-color);
    font-style: italic;
    text-shadow: 1px 1px 2px #130f23;
    opacity: var(--dimming-factor);
  }
  @include phone {
    text-align: center;
    padding: 0.25rem 0;
  }
}
</style>
