import axios from 'axios';
import jsYaml from 'js-yaml';
import { Progress } from 'rsup-progress';

import ErrorHandler, { InfoHandler } from '@/utils/ErrorHandler';
import { localStorageKeys, serviceEndpoints } from '@/utils/defaults';
import StoreKeys from '@/utils/StoreMutations';

export default {
  data() {
    return {
      saveSuccess: undefined,
      responseText: '',
      progress: new Progress({ color: 'var(--progress-bar)' }),
    };
  },
  methods: {
    writeConfigToDisk(config) {
      if (config.appConfig.preventWriteToDisk) {
        ErrorHandler('Unable to write changed to disk, as this functionality is disabled');
        return;
      }
      // 1. Get the config, and strip appConfig if is sub-page
      const isSubPag = !!this.$store.state.currentConfigInfo.confId;
      const jsonConfig = config;
      jsonConfig.sections = jsonConfig.sections.map(({ filteredItems, ...section }) => section);
      // If a sub-config, then remove appConfig, and check path isn't an external URL
      if (isSubPag) {
        delete jsonConfig.appConfig;
        if (this.$store.state.currentConfigInfo.confPath.includes('http')) {
          ErrorHandler('Cannot save to an external URL');
          return;
        }
      }
      // 2. Convert JSON into YAML
      const yamlOptions = {};
      const strjsonConfig = JSON.stringify(jsonConfig);
      const jsonObj = JSON.parse(strjsonConfig);
      const yaml = jsYaml.dump(jsonObj, yamlOptions);
      // 3. Prepare the request
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      const endpoint = `${baseUrl}${serviceEndpoints.save}`;
      const headers = { 'Content-Type': 'text/plain' };
      const filename = isSubPag
        ? (this.$store.state.currentConfigInfo.confPath || '') : '';
      const body = { config: yaml, timestamp: new Date(), filename };
      const request = axios.post(endpoint, body, headers);
      // 4. Make the request, and handle response
      this.progress.start();
      request.then((response) => {
        this.saveSuccess = response.data.success || false;
        this.responseText = response.data.message;
        if (this.saveSuccess) {
          this.carefullyClearLocalStorage();
          this.showToast(this.$t('config-editor.success-msg-disk'), true);
        } else {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
        }
        InfoHandler('Config has been written to disk successfully', 'Config Update');
        this.progress.end();
        this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
      })
        .catch((error) => { // fucking hell
          this.saveSuccess = false;
          this.responseText = error;
          this.showToast(error, false);
          ErrorHandler(`Failed to save config. ${error}`);
          this.progress.end();
        });
    },
    saveConfigLocally(config) {
      if (!this.permissions.allowSaveLocally) {
        ErrorHandler('Unable to save changes locally, this feature has been disabled');
        return;
      }

      const isSubPag = !!this.$store.state.currentConfigInfo.confId;
      if (isSubPag) { // Save for sub-page only
        const configId = this.$store.state.currentConfigInfo.confId;
        const localStorageKeySections = `${localStorageKeys.CONF_SECTIONS}-${configId}`;
        const localStorageKeyPageInfo = `${localStorageKeys.PAGE_INFO}-${configId}`;
        localStorage.setItem(localStorageKeySections, JSON.stringify(config.sections));
        localStorage.setItem(localStorageKeyPageInfo, JSON.stringify(config.pageInfo));
      } else { // Or save to main config
        localStorage.setItem(localStorageKeys.CONF_SECTIONS, JSON.stringify(config.sections));
        localStorage.setItem(localStorageKeys.PAGE_INFO, JSON.stringify(config.pageInfo));
        localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(config.appConfig));
      }

      if (config.appConfig.theme) {
        localStorage.setItem(localStorageKeys.THEME, config.appConfig.theme);
      }
      InfoHandler('Config has successfully been saved in browser storage', 'Config Update');
      this.showToast(this.$t('config-editor.success-msg-local'), true);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
    },
    carefullyClearLocalStorage() {
      // Delete the main keys
      localStorage.removeItem(localStorageKeys.PAGE_INFO);
      localStorage.removeItem(localStorageKeys.APP_CONFIG);
      localStorage.removeItem(localStorageKeys.CONF_SECTIONS);
      // Then, if we've got any sub-pages, delete those too
      (this.$store.getters.pages || []).forEach((page) => {
        const localStorageKeySections = `${localStorageKeys.CONF_SECTIONS}-${page.id}`;
        const localStorageKeyPageInfo = `${localStorageKeys.PAGE_INFO}-${page.id}`;
        localStorage.removeItem(localStorageKeySections);
        localStorage.removeItem(localStorageKeyPageInfo);
      });
    },
  },
};
