import jsYaml from 'js-yaml';
import { Progress } from 'rsup-progress';
import request from '@/utils/request';
import ErrorHandler, { InfoHandler } from '@/utils/logging/ErrorHandler';
import { localStorageKeys, serviceEndpoints } from '@/utils/config/defaults';
import {
  configScope, stripRootOwnedFields, clearScopedLocalConfig,
} from '@/utils/config/ConfigHelpers';
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
      const { state } = this.$store;
      if (state.config?.appConfig?.preventWriteToDisk) {
        ErrorHandler('Unable to write changes to disk, as this functionality is disabled');
        return Promise.resolve(false);
      }
      const isSubPag = !!state.currentConfigInfo.confId;
      if (isSubPag && state.currentConfigInfo.confPath?.includes('http')) {
        ErrorHandler('Cannot save to an external URL');
        return Promise.resolve(false);
      }
      // Strip runtime-only `filteredItems` and (for sub-pages) root-owned fields.
      // Spread to avoid mutating the caller's object (may be state.configSource)
      const base = isSubPag ? stripRootOwnedFields(config) : { ...(config || {}) };
      const jsonConfig = {
        ...base,
        sections: (base.sections || []).map(({ filteredItems: _filteredItems, ...s }) => s),
      };
      const yaml = jsYaml.dump(JSON.parse(JSON.stringify(jsonConfig)));
      const baseUrl = import.meta.env.VITE_APP_DOMAIN || window.location.origin;
      const endpoint = `${baseUrl}${serviceEndpoints.save}`;
      const filename = isSubPag ? (state.currentConfigInfo.confPath || '') : '';
      const body = { config: yaml, timestamp: new Date(), filename };
      const saveRequest = request.post(endpoint, body);
      this.progress.start();
      return saveRequest.then((response) => {
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
        return this.saveSuccess;
      })
        .catch((error) => {
          this.saveSuccess = false;
          this.responseText = error;
          this.showToast(error, false);
          ErrorHandler(`Failed to save config. ${error}`);
          this.progress.end();
          return false;
        });
    },
    /* Persist the given config to localStorage under keys scoped to the active page */
    saveConfigLocally(config) {
      if (!this.permissions.allowSaveLocally) {
        ErrorHandler('Unable to save changes locally, this feature has been disabled');
        return;
      }
      const { confId } = this.$store.state.currentConfigInfo;
      const scope = configScope(confId);
      const clean = confId ? stripRootOwnedFields(config) : (config || {});
      const appConfig = clean.appConfig || {};

      localStorage.setItem(scope.APP_CONFIG, JSON.stringify(appConfig));
      localStorage.setItem(scope.PAGE_INFO, JSON.stringify(clean.pageInfo || {}));
      localStorage.setItem(scope.CONF_SECTIONS, JSON.stringify(clean.sections || []));
      const setOrClear = (key, value) => {
        if (value) localStorage.setItem(key, value);
        else localStorage.removeItem(key);
      };
      setOrClear(scope.THEME, appConfig.theme);
      setOrClear(scope.LAYOUT, appConfig.layout);
      setOrClear(scope.ICON_SIZE, appConfig.iconSize);
      setOrClear(scope.LANGUAGE, appConfig.language);
      // pages is root-owned - only persisted from root context
      if (!confId) {
        localStorage.setItem(localStorageKeys.CONF_PAGES, JSON.stringify(clean.pages || []));
      }

      InfoHandler('Config has successfully been saved in browser storage', 'Config Update');
      this.showToast(this.$t('config-editor.success-msg-local'), true);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
    },
    /* After a successful disk write clear local overrides */
    carefullyClearLocalStorage() {
      clearScopedLocalConfig(this.$store.getters.pages);
    },
  },
};
