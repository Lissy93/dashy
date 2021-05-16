<template>
  <div class="config-options">
    <span>Config</span>
    <div class="config-buttons">
      <IconSpanner v-tooltip="tooltip('Update configuration locally')" @click="showEditor()" />
    </div>
    <modal :name="modalName" :resizable="true" width="80%" height="80%">
      <Tabs>
        <TabItem name="Edit">
          <div class="first-tab">Todo</div>
        </TabItem>
        <TabItem name="Download">
          <div class="second-tab">
            <pre>{{this.jsonParser(this.sections)}}</pre>
          </div>
        </TabItem>
      </Tabs>
    </modal>
  </div>
</template>

<script>

import IconSpanner from '@/assets/interface-icons/config-editor.svg';
import JsonToYaml from '@/utils/JsonToYaml';

export default {
  name: 'ConfigEditor',
  data() {
    return {
      modalName: 'CONF-EDITOR',
      input: '',
      jsonParser: JsonToYaml,
    };
  },
  components: {
    IconSpanner,
  },
  props: {
    sections: Array,
  },
  methods: {
    showEditor: function show() {
      this.$modal.show(this.modalName);
    },
    updateConfig() {
      // this.$emit('iconSizeUpdated', iconSize);
    },
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
    },
  },
};
</script>

<style scoped lang="scss">

.config-options {
  display: flex;
  flex-direction: column;
  color: var(--settings-text-color);
  svg {
    path {
      fill: var(--settings-text-color);
    }
    width: 1rem;
    height: 1rem;
    margin: 0.2rem;
    padding: 0.2rem;
    text-align: center;
    background: var(--background);
    border: 1px solid currentColor;
    border-radius: var(--curve-factor);
    cursor: pointer;
    &:hover, &.selected {
      background: var(--settings-text-color);
      path { fill: var(--background); }
    }
  }
}

</style>
