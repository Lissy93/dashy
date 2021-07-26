<template>
  <router-link to="/" class="page-titles">
    <img v-if="logo" :src="logo" class="site-logo" />
    <div class="text">
    <h1>{{ title }}</h1>
    <span class="subtitle">{{ description }}</span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    title: String,
    description: String,
    logo: String,
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

.page-titles {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
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
  img.site-logo {
    margin: 0.2rem 0.5rem 0.2rem 0;
    max-width: 3.5rem;
    height: fit-content;
  }
  @include phone {
    flex-direction: column;
    text-align: center;
    padding: 0.25rem 0;
  }
}
</style>
