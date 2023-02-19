<template>
  <Tabs :navAuto="true" name="Add Item" ref="tabView" v-bind:class="{ hideTabs: !enableConfig }">
    <!-- Main tab -->
    <TabItem :name="$t('config.main-tab')" class="main-tab">
      <div class="main-options-container">
        <div class="config-buttons">
          <h2>{{ $t('config.heading') }}</h2>
          <!-- Export config button -->
          <Button class="config-button" :disallow="!enableConfig" :click="openExportConfigModal">
            {{ $t('config.download-config-button') }}
            <DownloadIcon class="button-icon"/>
          </Button>
          <!-- Edit config button -->
          <Button class="config-button" :disallow="!enableConfig" :click="openEditConfigTab">
            {{ $t('config.edit-config-button') }}
            <EditIcon class="button-icon"/>
          </Button>
          <!-- Language switcher button -->
          <Button class="config-button" :click="openLanguageSwitchModal">
            {{ $t('config.change-language-button') }}
            <LanguageIcon class="button-icon"/>
          </Button>
          <!-- CSS / Styling button -->
          <Button class="config-button" :disallow="!enableConfig" :click="openEditCssTab">
            {{ $t('config.edit-css-button') }}
            <CustomCssIcon class="button-icon"/>
          </Button>
          <!-- Cloud sync button -->
          <Button class="config-button" :disallow="!enableConfig" :click="openCloudSyncTab">
            {{backupId ? $t('config.edit-cloud-sync-button') : $t('config.cloud-sync-button') }}
            <CloudIcon class="button-icon"/>
          </Button>
          <!-- Rebuild app button -->
          <Button class="config-button" :disallow="!enableConfig" :click="openRebuildAppModal">
            {{ $t('config.rebuild-app-button') }}
            <RebuildIcon class="button-icon"/>
          </Button>
          <!-- Reset local changes button -->
          <Button class="config-button" :click="resetLocalSettings">
            {{ $t('config.reset-settings-button') }}
            <DeleteIcon class="button-icon"/>
          </Button>
          <!-- About modal button -->
          <Button class="config-button" :click="openAboutModal">
            {{ $t('config.app-info-button') }}
            <IconAbout class="button-icon" />
          </Button>
          <!-- Display app version and language -->
          <p class="language">{{ getLanguage() }}</p>
          <p v-if="$store.state.currentConfigInfo" class="config-location">
            Using Config From<br>
            {{ $store.state.currentConfigInfo.confPath }}
          </p>
          <AppVersion />
        </div>
        <!-- Display note if Config disabled, or if on mobile -->
        <p v-if="!enableConfig" class="config-disabled-note">{{ $t('config.disabled-note') }}</p>
        <p class="small-screen-note" style="display: none;">{{ $t('config.small-screen-note') }}</p>
        <div class="config-note">
          <span>{{ $t('config.backup-note') }}</span>
        </div>
      </div>
      <!-- Rebuild App Modal -->
      <RebuildApp />
    </TabItem>
    <TabItem :name="$t('config.edit-config-tab')" v-if="enableConfig">
      <JsonEditor />
    </TabItem>
    <TabItem :name="$t('cloud-sync.title')" v-if="enableConfig">
      <CloudBackupRestore />
    </TabItem>
    <TabItem :name="$t('config.custom-css-tab')" v-if="enableConfig">
      <CustomCssEditor />
    </TabItem>
  </Tabs>
</template>

<script>

import { localStorageKeys, modalNames } from '@/utils/defaults';
import { getUsersLanguage } from '@/utils/ConfigHelpers';
import ErrorHandler from '@/utils/ErrorHandler';
import StoreKeys from '@/utils/StoreMutations';
import JsonEditor from '@/components/Configuration/JsonEditor';
import CustomCssEditor from '@/components/Configuration/CustomCss';
import CloudBackupRestore from '@/components/Configuration/CloudBackupRestore';
import RebuildApp from '@/components/Configuration/RebuildApp';
import AppVersion from '@/components/Configuration/AppVersion';
import Button from '@/components/FormElements/Button';

import DownloadIcon from '@/assets/interface-icons/config-download-file.svg';
import DeleteIcon from '@/assets/interface-icons/config-delete-local.svg';
import EditIcon from '@/assets/interface-icons/config-edit-json.svg';
import CustomCssIcon from '@/assets/interface-icons/config-custom-css.svg';
import CloudIcon from '@/assets/interface-icons/cloud-backup-restore.svg';
import RebuildIcon from '@/assets/interface-icons/application-rebuild.svg';
import LanguageIcon from '@/assets/interface-icons/config-language.svg';
import IconAbout from '@/assets/interface-icons/application-about.svg';

export default {
  name: 'ConfigContainer',
  data() {
    return {
      backupId: localStorage[localStorageKeys.BACKUP_ID] || '',
      appVersion: process.env.VUE_APP_VERSION,
      latestVersion: '',
    };
  },
  props: {
    config: Object,
  },
  computed: {
    sections: function getSections() {
      return this.config.sections;
    },
    enableConfig() {
      return this.$store.getters.permissions.allowViewConfig;
    },
  },
  components: {
    Button,
    JsonEditor,
    CustomCssEditor,
    CloudBackupRestore,
    RebuildApp,
    AppVersion,
    DownloadIcon,
    DeleteIcon,
    EditIcon,
    CloudIcon,
    CustomCssIcon,
    LanguageIcon,
    RebuildIcon,
    IconAbout,
  },
  methods: {
    /* Progamatically navigates to a given tab by index */
    navigateToTab(tabInxex) {
      const itemToSelect = this.$refs.tabView.navItems[tabInxex];
      this.$refs.tabView.activeTabItem(itemToSelect);
    },
    openRebuildAppModal() {
      if (this.enableConfig) {
        this.$modal.show(modalNames.REBUILD_APP);
      } else {
        this.unauthorized();
      }
    },
    openAboutModal() {
      this.$modal.show(modalNames.ABOUT_APP);
    },
    openLanguageSwitchModal() {
      this.$modal.show(modalNames.LANG_SWITCHER);
    },
    openExportConfigModal() {
      if (this.enableConfig) {
        this.$modal.show(modalNames.EXPORT_CONFIG_MENU);
      } else {
        this.unauthorized();
      }
    },
    openEditConfigTab() {
      this.navigateToTab(1);
    },
    openCloudSyncTab() {
      this.navigateToTab(2);
    },
    openEditCssTab() {
      this.navigateToTab(3);
    },
    /* Checks that the user is sure, then resets site-wide local storage, and reloads page */
    resetLocalSettings() {
      const msg = `${this.$t('config.reset-config-msg-l1')} `
      + `${this.$t('config.reset-config-msg-l2')}\n\n${this.$t('config.reset-config-msg-l3')}`;
      const isTheUserSure = confirm(msg); // eslint-disable-line no-alert, no-restricted-globals
      if (isTheUserSure) {
        localStorage.clear();
        this.$toasted.show(this.$t('config.data-cleared-msg'));
        this.$store.dispatch(StoreKeys.INITIALIZE_CONFIG);
      }
    },
    getLanguage() {
      const lang = getUsersLanguage();
      return lang ? `${lang.flag} ${lang.name}` : '';
    },
    /* If launching menu from editor, navigate to correct starting tab */
    navigateToStartingTab() {
      const navToTab = this.$store.state.navigateConfToTab;
      const isValidTabIndex = (indx) => typeof indx === 'number' && indx >= 0 && indx <= 5;
      if (navToTab && isValidTabIndex(navToTab)) this.navigateToTab(navToTab);
      this.$store.commit(StoreKeys.CONF_MENU_INDEX, undefined);
    },
    unauthorized() {
      ErrorHandler('Unauthorized Operation - Config Disabled');
    },
  },
  mounted() {
    this.navigateToStartingTab();
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

pre {
  color: var(--config-code-color);
  font-weight: bold !important;
  padding: 0.5rem 1rem;
}

a.config-button, button.config-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 1.2rem;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  border: 1px solid var(--config-settings-color);
  margin: 0.5rem auto;
  min-width: 15rem;
  width: 100%;
  svg.button-icon {
    path {
      fill: var(--config-settings-color);
    }
    width: 1rem;
    height: 1rem;
    padding: 0.2rem;
  }
  &:hover:not(.disallowed) {
    background: var(--config-settings-color);
    color: var(--config-settings-background);
    svg path {
      fill: var(--config-settings-background);
    }
  }
}

a.hyperlink-wrapper {
  margin: 0 auto;
  text-decoration: none;
  min-width: 18rem;
  width: 100%;
}

p.app-version, p.language, p.config-location {
  margin: 0.5rem auto;
  font-size: 1rem;
  color: var(--transparent-white-50);
  cursor: default;
}

div.code-container {
  background: var(--config-code-background);
  .yaml-action-buttons {
    position: absolute;
    top: 1.5rem;
    right: 0.5rem;
    display: flex;
    flex-direction: column;
    border: 1px dashed;
    padding: 0.5rem;
    border-radius: 4px;
    h2 {
      margin: 0;
      text-align: center;
      color: var(--config-code-color);
    }
    a.yaml-button {
      padding:  0.25rem 0.5rem;
      font-size: 1rem;
      color: var(--config-code-color);
      border-radius: var(--curve-factor);
      cursor: pointer;
      text-decoration: underline;
      border: 1px solid var(--config-code-background);
      &:hover {
        color: var(--config-code-color);
        border-color: var(--config-code-color);
        text-decoration: none;
      }
      &:active {
        color: var(--config-code-background);
        background-color: var(--config-settings-color);
        text-decoration: none;
      }
    }
  }
}

.tab-item {
  overflow-y: auto;
  @extend .scroll-bar;
  background: var(--config-settings-background);
  &.main-tab {
    min-height: 500px;
  }
}

.main-options-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.config-buttons {
  display: flex;
  flex-direction: column;
  background: var(--config-settings-background);
  height: calc(100% + 1rem);
  width: fit-content;
  margin: 0 auto;
  padding: 2rem 1rem 0;
  h2 {
    margin: 0 auto 1rem auto;
    color: var(--config-settings-color);
  }
}

.config-note {
  width: 80%;
  max-width: 700px;
  left: 10%;
  bottom: 1rem;
  margin: 0.5rem auto;
  padding: 0.5rem 0.75rem;
  text-align: center;
  border: 1px dashed var(--config-settings-color);
  border-radius: var(--curve-factor);
  opacity: var(--dimming-factor);
  color: var(--config-settings-color);
  background: var(--config-settings-background);
  cursor: default;
  p.sub-title {
    font-weight: bold;
    margin: 0;
    display: inline;
  }
  &:hover { opacity: 1; }
  display: none;
  @include tablet-up { display: block; }
}
p.config-disabled-note {
  margin: 0.5rem auto;
  padding: 0 0.5rem;
  font-weight: bold;
  color: var(--warning);
  opacity: var(--dimming-factor);
}
p.small-screen-note {
    @include phone {
      display: block !important;
    }
    margin: 0.5rem auto;
    padding: 0 0.5rem;
    text-align: center;
    opacity: 0.8;
    font-size: 0.9rem;
    color: var(--warning);
  }
</style>

<style lang="scss">

.hideTabs .tab__pagination {
  display: none !important;
}

.tabs__content {
  height: -webkit-fill-available;
  height: -moz-available;
  height: stretch;
  height: 100%; // Firefox
}

.tab-item {
  background: var(--config-settings-background) !important;
}

.tab__pagination {
  background: var(--config-settings-background) !important;
  color: var(--config-settings-color) !important;
  .tab__nav__items .tab__nav__item {
    span {
      color: var(--config-settings-color) !important;
    }
    &:hover {
      background: var(--config-settings-color) !important;
      span {
        color: var(--config-settings-background) !important;
      }
    }
    &.active {
      span {
        font-weight: bold !important;
        color: var(--config-settings-color) !important;
      }
      &:hover span {
        color: var(--config-settings-background) !important;
      }
    }
  }
  .tab__nav__items .tab__nav__item.active {
    border-bottom: 2px solid var(--config-settings-color) !important;
  }
  hr.tab__slider {
    background: var(--config-settings-color) !important;
  }
}

</style>
