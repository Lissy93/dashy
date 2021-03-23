<template>
  <div id="app">
    <router-view/>
    <Footer />
  </div>
</template>
<script>

// const jsyaml = require("js-yaml");
import Footer from '@/components/Footer.vue';
// import defaultConfig from '../src/data/conf.yml';

export default {
  name: 'app',
  components: {
    Footer,
  },
  // methods: {
  //   getConfig: async function () {
  //     // const defaults = jsyaml.load(defaultConfig);

  //   },
  // }
};
</script>

<style lang="scss">
@import '../src/styles/global-styles.scss';
@import '../src/styles/color-pallet.scss';

body {
  background: $background;
  margin: 0;
  padding: 0;
}

#app {
  .footer {
    text-align: center;
  }
}

</style>
