<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
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
  margin: 1em;
  .footer {
    text-align: center;
  }
}

</style>
