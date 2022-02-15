<template>
  <pre v-if="allowViewConfig"><code>{{ yamlConfig }}</code></pre>
  <AccessError v-else />
</template>

<script>
import JsYaml from 'js-yaml';
import AccessError from '@/components/Configuration/AccessError';

export default {
  name: 'DownloadConfig',
  components: {
    AccessError,
  },
  computed: {
    config() {
      return this.$store.state.config;
    },
    yamlConfig() {
      return JsYaml.dump(this.config);
    },
    allowViewConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
};

</script>

<style scoped lang="scss">
pre {
  margin: 0;
  padding: 1rem;
  color: var(--code-editor-color);
  background: var(--code-editor-background);
}
</style>
