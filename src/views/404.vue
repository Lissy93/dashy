<template>
  <main class="not-found-page">
    <h1 class="not-found-title">404</h1>
    <h2 class="not-found-sad-face">:(</h2>
    <p class="not-found-subtitle">Page Not Found</p>
    <p class="not-found-message">
      Facing Issues?
      <a href="https://git.io/JzpL5">Get Support</a>.
    </p>
    <router-link to="/" class="go-home">Back Home</router-link>
  </main>
</template>

<script>

export default {
  name: 'not-found',
  methods: {
    setTheme() {
      document.getElementsByTagName('html')[0].setAttribute('data-theme', 'dashy-docs');
    },
  },
  mounted() {
    this.setTheme();
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';
main.not-found-page {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  cursor: default;
  background: #202020;
  min-height: calc(99vh - var(--footer-height));
  background-color: #202020;
  h1.not-found-title, h2.not-found-sad-face {
    font-size: 20vh;
    font-family: Tahoma, monospace;
    cursor: default;
    color: #0c0c0c;
    text-shadow: 0px 4px 4px #090909, 0 0 0 #000, 0px 2px 2px #000000;
    margin: 1rem 0 0;
  }
  h2.not-found-sad-face {
    font-size: 4rem;
    margin: 0 0 1.5rem 0;
  }
  p {
    font-family: monospace;
    cursor: default;
    color: #0c0c0c;
    margin: 0.2rem 0;
    text-shadow: 0 1px 1px #090909, 0 0 0 #000, 0 1px 1px #000000;
  }
  p.not-found-subtitle {
    font-size: 2.8rem;
  }
  p.not-found-message {
    font-size: 1.4rem;
    font-weight: normal;
    a {
      color: #0c0c0c;
      font-family: monospace;
    }
  }
  a.go-home {
    padding: 0.3rem 1rem;
    border-radius: 3px;
    font-size: 1.7rem;
    cursor: pointer;
    font-family: Tahoma, monospace;
    color: #0c0c0c;
    margin: 2rem 0 0;
    text-decoration: none;
    background: #db78fc;
    box-shadow: 0 4px #b83ddd;
    &:hover { box-shadow: 0 2px #b83ddd; }
  }
  ::selection { background-color: #db78fc; color: #121212; }
}
</style>
