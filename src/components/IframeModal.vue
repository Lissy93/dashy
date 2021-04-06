<template>
  <modal name="iframe-modal" :resizable="true"
    :adaptive="true" width="80%" height="80%">
    <iframe :src="url" class="frame" />
  </modal>
</template>

<script>
export default {
  name: 'IframeModal',
  props: {
    url: String,
  },
  methods: {
    show: function show() {
      this.$modal.show('iframe-modal');
    },
  },
};
</script>

<style scoped lang="scss">

.frame {
  width: 100%;
  height: 100%;
  border: none;
}

</style>
