<template>
  <div id="app">

    <router-view/>
    <Footer />
  </div>
</template>
<script>

import Footer from '@/components/Footer.vue'

export default {
  name: 'app',
  components: {
    Footer
  }
}
</script>

<style lang="scss">
@import url('../src/global-styles.scss');

#app {
  .footer {
    text-align: center;
  }
}

</style>
