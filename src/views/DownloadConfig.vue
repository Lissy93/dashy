<template>
  <pre><code>{{ jsonParser(config) }}</code></pre>
</template>

<script>
import JsonToYaml from '@/utils/JsonToYaml';

export default {
  name: 'DownloadConfig',
  props: {
    sections: Array,
    appConfig: Object,
    pageInfo: Object,
  },
  data() {
    return {
      config: {
        appConfig: this.appConfig,
        pageInfo: this.pageInfo,
        sections: this.sections,
      },
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
