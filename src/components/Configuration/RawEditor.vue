<template>
  <div>
    <v-jsoneditor
      v-model="json"
      :options="options"
      :plus="false"
      height="650px"
      @error="onError"
    />
  </div>
</template>

<script>

import VJsoneditor from 'v-jsoneditor';

export default {
  name: 'RawEditor',
  props: {
    sections: Array,
  },
  components: {
    VJsoneditor,
  },
  data() {
    return {
      json: this.sections,
    };
  },
  methods: {
    onError() {
      console.log('error');
    },
  },
};
</script>

<style scoped lang="scss">

</style>
