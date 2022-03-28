<template>
  <div class="web-content" :id="id">
    <iframe :src="url" allow="fullscreen" />
  </div>
</template>

<script>

export default {
  name: 'WebContent',
  props: {
    url: String,
    id: {
      type: String,
      default: 'web-app-view',
    },
  },
};
</script>

<style lang="scss" scoped>

iframe {
  position: absolute;
  left: var(--side-bar-width);
  height: calc(100% - var(--header-height));
  width: calc(100% - var(--side-bar-width));
  border: none;
  background: var(--workspace-web-content-background);
}

.web-content.hide {
  display: none;
}

</style>
