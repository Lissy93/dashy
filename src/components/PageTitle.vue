<template>
  <div class="page-titles">
    <h1>Alicia App</h1>
    <span class="subtitle">Dashboard of all the things</span>
  </div>
</template>

<script>
export default {
  name: 'PageTitle',
};
</script>

<style scoped lang="scss">
@import '../../src/styles/color-pallet.scss';

.page-titles {
  display: flex;
  flex-direction: column;
  h1 {
    color: $ascent;
    // background: -webkit-linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    // background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    font-size: 3rem;
    margin: 0;
  }
  span.subtitle {
    color: $ascent-with-opacity;
    font-style: italic;
    text-shadow: 1px 1px 2px #130f23;
  }
  @media screen and (max-width: 600px) {
    text-align: center;
    padding: 0.25rem 0;
  }
}
</style>
