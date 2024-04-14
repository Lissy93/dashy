<template>
  <footer v-if="visible">
    <!-- User-defined footer -->
    <span v-if="text" v-html="text"></span>
    <!-- Default footer -->
    <span v-else>
      <a :href="defaultInfo.projectUrl">Dashy</a> is free & open source
      - licensed under <a :href="defaultInfo.licenseUrl">{{defaultInfo.license}}</a>,
      © <a :href="defaultInfo.authorUrl">{{defaultInfo.authorName}}</a> {{defaultInfo.date}}.
      Get support on GitHub, at <a :href="defaultInfo.repoUrl">{{defaultInfo.repoName}}</a>.
    </span>
  </footer>
</template>

<script>

import { shouldBeVisible } from '@/utils/SectionHelpers';

export default {
  name: 'Footer',
  props: {
    text: String,
  },
  data() {
    return {
      defaultInfo: {
        authorName: 'Alicia Sykes',
        authorUrl: 'https://as93.net',
        license: 'MIT',
        licenseUrl: 'https://gist.github.com/Lissy93/143d2ee01ccc5c052a17',
        date: `${new Date().getFullYear()}`,
        repoUrl: 'https://github.com/lissy93/dashy',
        repoName: 'Lissy93/Dashy',
        projectUrl: 'https://dashy.to',
      },
    };
  },
  computed: {
    visible() {
      return shouldBeVisible(this.$route.name);
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

footer {
  width: calc(100% - 0.5rem);
  bottom: 0;
  padding: 0.25rem;
  text-align: center;
  color: var(--medium-grey);
  opacity: var(--dimming-factor);
  background: var(--footer-background);
  margin-top: 1.5rem;
  border-top: 1px solid var(--outline-color);
  @include tablet-down {
    display: none;
  }
  span.path-to-config {
    float: left;
    font-size: 0.75rem;
    margin: 0.1rem 0.5rem 0 0;
    opacity: var(--dimming-factor);
    max-width: 10rem;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    max-height: 1rem;
  }
}

footer a{
  color: var(--footer-text-color);
  &:hover {
    color: var(--footer-text-color-link);
  }
}

</style>
