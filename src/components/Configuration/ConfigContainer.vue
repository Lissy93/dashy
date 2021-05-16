<template>
  <Tabs>
    <TabItem name="Edit">
      <div class="first-tab">Todo</div>
    </TabItem>
    <TabItem name="Raw Editor">
         <RawEditor :sections="sections" />
    </TabItem>
    <TabItem name="Download">
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
import RawEditor from '@/components/Configuration/RawEditor';

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
    RawEditor,
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
