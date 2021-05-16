<template>
  <Tabs>
    <TabItem name="Config Editor">
         <JsonEditor :sections="sections" />
    </TabItem>
    <TabItem name="View/ Save YAML">
        <pre>{{this.jsonParser(this.sections)}}</pre>
    </TabItem>
    <TabItem name="Add Item">
        <AddItem :sections="sections" />
    </TabItem>
  </Tabs>
</template>

<script>

import JsonToYaml from '@/utils/JsonToYaml';
import AddItem from '@/components/Configuration/AddItem';
import JsonEditor from '@/components/Configuration/JsonEditor';

export default {
  name: 'ConfigContainer',
  data() {
    return {
      jsonParser: JsonToYaml,
    };
  },
  props: {
    sections: Array,
  },
  components: {
    AddItem,
    JsonEditor,
  },
};
</script>

<style scoped lang="scss">

pre {
  color: var(--config-code-color);
  background: var(--config-code-background);
}

.tab-item {
  overflow-y: auto;
}
</style>
