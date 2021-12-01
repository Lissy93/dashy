<template>
  <pre><code>{{ jsonParser(config) }}</code></pre>
</template>

<script>
import JsonToYaml from '@/utils/JsonToYaml';

export default {
  name: 'DownloadConfig',
  computed: {
    config() {
      return this.$store.state.config;
    },
  },
  data() {
    return {
      jsonParser: JsonToYaml,
    };
  },
};

</script>

<style scoped lang="scss">
pre {
  background: var(--code-editor-background);
  color: var(--code-editor-color);
  padding: 1rem;
}
</style>
