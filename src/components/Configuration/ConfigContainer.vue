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
        <button class="config-button center" @click="goToMetaEdit()">
          <MetaDataIcon class="button-icon"/>
          Edit Meta Data
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
    <TabItem name="Edit Site Meta">
      <EditSiteMeta :config="config" />
    </TabItem>
  </Tabs>
</template>

<script>

import JsonToYaml from '@/utils/JsonToYaml';
import EditSiteMeta from '@/components/Configuration/EditSiteMeta';
import JsonEditor from '@/components/Configuration/JsonEditor';
import DownloadIcon from '@/assets/interface-icons/config-download-file.svg';
import DeleteIcon from '@/assets/interface-icons/config-delete-local.svg';
import EditIcon from '@/assets/interface-icons/config-edit-json.svg';
import MetaDataIcon from '@/assets/interface-icons/config-meta-data.svg';

export default {
  name: 'ConfigContainer',
  data() {
    return {
      jsonParser: JsonToYaml,
    };
  },
  props: {
    config: Object,
  },
  computed: {
    sections: function getSections() {
      return this.config.sections;
    },
  },
  components: {
    EditSiteMeta,
    JsonEditor,
    DownloadIcon,
    DeleteIcon,
    EditIcon,
    MetaDataIcon,
  },
  methods: {
    /* Seletcs the edit tab of the tab view */
    goToEdit() {
      const itemToSelect = this.$refs.tabView.navItems[1];
      this.$refs.tabView.activeTabItem({ tabItem: itemToSelect, byUser: true });
    },
    goToMetaEdit() {
      const itemToSelect = this.$refs.tabView.navItems[3];
      this.$refs.tabView.activeTabItem({ tabItem: itemToSelect, byUser: true });
    },
    /* Checks that the user is sure, then resets site-wide local storage, and reloads page */
    resetLocalSettings() {
      const msg = 'This will remove all user settings from local storage, '
          + 'but won\'t effect your \'conf.yml\' file. '
          + 'It is recommend to make a backup of your modified YAML settings first.\n\n'
          + 'Are you sure you want to proceed?';
      const isTheUserSure = confirm(msg); // eslint-disable-line no-alert, no-restricted-globals
      if (isTheUserSure) {
        localStorage.clear();
        this.$toasted.show('Data cleared succesfully');
        setTimeout(() => {
          location.reload(); // eslint-disable-line no-restricted-globals
        }, 1900);
      }
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
    margin-right: 0.5rem;
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
    color: var(--config-settings-color);
  }
}
</style>

<style lang="scss">
.tab__pagination {
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  .tab__nav__items .tab__nav__item {
    span {
      color: var(--config-settings-color);
    }
    &:hover {
      background: var(--config-settings-color) !important;
      span {
        color: var(--config-settings-background);
      }
    }
    &.active {
      span {
        font-weight: bold;
        color: var(--config-settings-color) !important;
      }
    }
  }
  .tab__nav__items .tab__nav__item.active {
    border-bottom: 2px solid var(--config-settings-color);
  }
  hr.tab__slider {
    background: var(--config-settings-color);
  }
}
</style>
