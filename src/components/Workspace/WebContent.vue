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
  left: var(--side-bar-width);
  height: calc(100% - var(--header-height));
  width: calc(100% - var(--side-bar-width));
  border: none;
  background: white;
}

</style>
