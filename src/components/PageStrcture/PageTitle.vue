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

.page-titles {
  display: flex;
  flex-direction: column;
  h1 {
    color: var(--primary);
    // background: -webkit-linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    // background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    font-size: 2.5rem;
    margin: 0;
  }
  span.subtitle {
    color: var(--primary);
    font-style: italic;
    text-shadow: 1px 1px 2px #130f23;
    opacity: var(--dimming-factor);
  }
  @media screen and (max-width: 600px) {
    text-align: center;
    padding: 0.25rem 0;
  }
}
</style>
