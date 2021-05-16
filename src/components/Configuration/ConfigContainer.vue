<template>
  <Tabs>
    <TabItem name="Edit">
      <div class="first-tab">Todo</div>
    </TabItem>
    <TabItem name="Download">
      <div class="second-tab">
        <pre>{{this.jsonParser(this.sections)}}</pre>
      </div>
    </TabItem>
    <TabItem name="Add Item">
      <div class="third-tab">
        <AddItem :sections="sections" />
      </div>
    </TabItem>
  </Tabs>
</template>

<script>

import JsonToYaml from '@/utils/JsonToYaml';
import AddItem from '@/components/Configuration/AddItem';

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
