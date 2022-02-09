<template>
  <pre><code>{{ yamlConfig }}</code></pre>
</template>

<script>
import JsYaml from 'js-yaml';

export default {
  name: 'DownloadConfig',
  computed: {
    config() {
      return this.$store.state.config;
    },
    yamlConfig() {
      return JsYaml.dump(this.config);
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
