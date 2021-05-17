<template>
  <Tabs :navAuto="true" name="Add Item" ref="tabView">
    <TabItem name="Config">
      <div class="main-options-container">
        <h2>Configuration Options</h2>
        <a href="/conf.yml" download class="hyperlink-wrapper">
          <button class="config-button center">
          <DownloadIcon class="button-icon"/>
          Download Config
          </button>
        </a>
        <button class="config-button center" @click="goToEdit()">
          <EditIcon class="button-icon"/>
          Edit Sections
        </button>
        <button class="config-button center" @click="resetLocalSettings()">
          <DeleteIcon class="button-icon"/>
          Reset Local Settings
        </button>
      </div>
    </TabItem>
    <TabItem name="Edit Sections">
      <JsonEditor :sections="sections" />
    </TabItem>
    <TabItem name="View Raw YAML">
      <pre>{{this.jsonParser(this.config)}}</pre>
      <a class="download-button" href="/conf.yml" download>Download Config</a>
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
import DownloadIcon from '@/assets/interface-icons/config-download-file.svg';
import DeleteIcon from '@/assets/interface-icons/config-delete-local.svg';
import EditIcon from '@/assets/interface-icons/config-edit-json.svg';

export default {
  name: 'ConfigContainer',
  data() {
    return {
      jsonParser: JsonToYaml,
    };
  },
  props: {
    sections: Array,
    config: Object,
  },
  components: {
    AddItem,
    JsonEditor,
    DownloadIcon,
    DeleteIcon,
    EditIcon,
  },
  methods: {
    goToEdit() {
      const itemToSelect = this.$refs.tabView.navItems[1];
      this.$refs.tabView.activeTabItem({ tabItem: itemToSelect, byUser: true });
    },
    resetLocalSettings() {
      /* eslint-disable no-alert, no-restricted-globals */
      const isTheUserSure = confirm('Are you sure?');
      if (isTheUserSure) {
        localStorage.clear();
      }
      /* eslint-enable no-alert, no-restricted-globals */
    },
  },
};
</script>

<style scoped lang="scss">

pre {
  color: var(--config-code-color);
  background: var(--config-code-background);
}

a.config-button, button.config-button {
  display: flex;
  align-items: center;
  padding:  0.5rem 1rem;
  margin: 0.25rem auto;
  font-size: 1.2rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  border: 1px solid var(--config-settings-color);
  border-radius: var(--curve-factor);
  text-decoration: none;
  cursor: pointer;
  margin: 0.5rem auto;
  width: 18rem;
  svg.button-icon {
    path {
      fill: var(--config-settings-color);
    }
    width: 1rem;
    height: 1rem;
    padding: 0.2rem;
  }
  &:hover {
    background: var(--config-settings-color);
    color: var(--config-settings-background);
    svg path {
      fill: var(--config-settings-background);
    }
  }
}

a.download-button {
  position: absolute;
  top: 2px;
  right: 2px;
  padding:  0.25rem 0.5rem;
  font-size: 1rem;
  color: var(--config-settings-background);
  border-radius: var(--curve-factor);
  cursor: pointer;
  &:hover {
    background: var(--config-settings-color);
  }
}

.tab-item {
  overflow-y: auto;
}

a.hyperlink-wrapper {
  margin: 0 auto;
  text-decoration: none;
}

.main-options-container {
  display: flex;
  flex-direction: column;
  padding-top: 2rem;
  background: var(--background-darker);
  height: calc(100% - 2rem);
  h2 {
    margin: 1rem auto;
  }
}

</style>
