<template>
  <div class="widget-error"></div>
</template>

<script>

export default {
  name: 'WidgetError',
  props: {
    errorMessage: String,
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.widget-error {}
</style>
