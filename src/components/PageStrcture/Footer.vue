<template>
  <!-- User Footer -->
  <footer v-if="text && text !== ''">{{text}}</footer>
  <!-- Default Footer -->
  <footer v-else>
      Developed by <a :href="authorUrl">{{authorName}}</a>.
      Licensed under <a :href="licenseUrl">{{license}}</a>
      {{ showCopyright? '©': '' }} {{date}}.
      Get the <a :href="repoUrl">Source Code</a>.
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    authorName: { type: String, default: 'Alicia Sykes' },
    authorUrl: { type: String, default: 'https://aliciasykes.com' },
    license: { type: String, default: 'MIT' },
    licenseUrl: { type: String, default: 'https://gist.github.com/Lissy93/143d2ee01ccc5c052a17' },
    date: { type: String, default: `${new Date().getFullYear()}` },
    showCopyright: { type: Boolean, default: true },
    repoUrl: { type: String, default: 'https://github.com/lissy93/dashy' },
    text: String,
  },
};
</script>

<style scoped lang="scss">

footer {
  padding: 0.25rem;
  text-align: center;
  color: var(--medium-grey);
  opacity: var(--dimming-factor);
  background: var(--background-darker);
  margin-top: 1.5rem;
  border-top: 1px solid var(--outline-color);
}

footer a{
  color: var(--footer-text-color);
  &:hover {
    color: var(--footer-text-color-link);
  }
}

</style>
