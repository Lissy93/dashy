<template>
  <footer>
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
    repoUrl: { type: String, default: 'https://github.com/lissy93/panel' },
  },
};
</script>

<style scoped lang="scss">

footer {
  padding: 0.5rem;
  text-align: center;
  color: #5e6474;
  opacity: 0.5;
  background: #05070e;
  margin-top: 1rem;
}

footer a{
  color: #5e6474;
  &:hover {
    color: #9F86FF;
  }
}

</style>
