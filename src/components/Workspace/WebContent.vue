<template>
  <div class="web-content">
    <iframe :src="url" />
  </div>
</template>

<script>

export default {
  name: 'WebContent',
  props: {
    url: String,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

iframe {
  position: absolute;
  left: 3rem;
  height: calc(100% - 6.3rem);
  width: calc(100% - 3rem);
  border: none;
  background: white;
}

</style>
