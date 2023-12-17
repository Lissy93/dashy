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
      const isSubPag = !!this.$store.state.currentConfigInfo;
      const jsonConfig = config;
      if (isSubPag) delete jsonConfig.appConfig;
      // 2. Convert JSON into YAML
      const yamlOptions = {};
      const yaml = jsYaml.dump(jsonConfig, yamlOptions);
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
    async CommitConfigToGithub(config) {
      // 1. Get the config, and strip appConfig if is sub-page
      const isSubPag = !!this.$store.state.currentConfigInfo;
      const jsonConfig = config;
      if (isSubPag) delete jsonConfig.appConfig;
      // 2. Convert JSON into YAML
      const yamlOptions = {};
      const configFileYaml = jsYaml.dump(jsonConfig, yamlOptions);

      const accessToken = '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';
      const repoName = 'Musubi42/dashy-commit-config-from-ui';
      const filePath = 'public/conf.yml';
      // 3. Prepare the request
      const baseUrl = `https://api.github.com/repos/${repoName}`;
      // const endpoint = `${baseUrl}${serviceEndpoints.save}`;
      const headers = {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      };

      // Declare all the variables
      let lastCommitSha = null;
      let baseTreeSha = null;
      let blobSha = null;
      let treeSha = null;
      let newCommitSha = null;
      let referenceUpdated = null;

      // Step 1: Get the last commit sha
      try {
        const endpointLastCommitSha = `${baseUrl}/git/refs/heads/master`;
        const requestLastCommitSha = await axios.get(endpointLastCommitSha, headers);

        if (requestLastCommitSha.status !== 200) {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
          return;
        }

        lastCommitSha = requestLastCommitSha.data.object.sha;
      } catch (error) {
        this.showToast(error, false);
        ErrorHandler(`Failed to get last commit SHA. ${error}`);
      }

      // Step 2: Get the base tree SHA
      try {
        const endpointBaseTreeSha = `${baseUrl}/git/commits/${lastCommitSha}`;
        const requestBaseTreeSha = await axios.get(endpointBaseTreeSha, headers);

        if (requestBaseTreeSha.status !== 200) {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
          return;
        }

        baseTreeSha = requestBaseTreeSha.data.tree.sha;
      } catch (error) {
        this.showToast(error, false);
        ErrorHandler(`Failed to get base tree SHA. ${error}`);
      }

      // Step 3: Create a blob
      try {
        const endpointCreateBlob = `${baseUrl}/git/blobs`;
        const blobData = { content: configFileYaml, encoding: 'utf-8' };
        const requestCreateBlob = await axios.post(endpointCreateBlob, blobData, headers);

        if (requestCreateBlob.status !== 201) {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
          return;
        }

        blobSha = requestCreateBlob.data.sha;
      } catch (error) {
        this.showToast(error, false);
        ErrorHandler(`Failed to create blob. ${error}`);
      }

      // Step 4: Create a tree
      try {
        const endpointCreateTree = `${baseUrl}/git/trees`;
        const treeData = {
          base_tree: baseTreeSha,
          tree: [
            {
              path: filePath, mode: '100644', type: 'blob', sha: blobSha,
            },
          ],
        };

        const requestCreateTree = await axios.post(endpointCreateTree, treeData, headers);

        if (requestCreateTree.status !== 201) {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
          return;
        }

        treeSha = requestCreateTree.data.sha;
      } catch (error) {
        this.showToast(error, false);
        ErrorHandler(`Failed to create blob. ${error}`);
      }

      // Step 5: Create a commit
      try {
        const endpointCreateCommit = `${baseUrl}/git/commits`;
        const commitData = {
          message: 'Add file via API',
          tree: treeSha,
          parents: [lastCommitSha],
        };
        const requestCreateCommit = await axios.post(endpointCreateCommit, commitData, headers);

        if (requestCreateCommit.status !== 201) {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
          return;
        }

        newCommitSha = requestCreateCommit.data.sha;
      } catch (error) {
        this.showToast(error, false);
        ErrorHandler(`Failed to create commit. ${error}`);
      }

      // // Step 6: Update the reference
      try {
        const endpointUpdateReference = `${baseUrl}/git/refs/heads/master`;
        const refData = { sha: newCommitSha };
        const requestCreateCommit = await axios.patch(endpointUpdateReference, refData, headers);

        if (requestCreateCommit.status !== 200) {
          this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
          return;
        }

        referenceUpdated = requestCreateCommit.data;
      } catch (error) {
        this.showToast(error, false);
        ErrorHandler(`Failed to update reference. ${error}`);
      }

      if (referenceUpdated) {
        this.carefullyClearLocalStorage();
        this.showToast(`Config has been commit to ${repoName}/${filePath}`, true);
      } else {
        this.showToast(this.$t('config-editor.error-msg-cannot-save'), false);
      }

      InfoHandler(`Config has been commit to ${filePath}`, referenceUpdated);
    },
    saveConfigLocally(config) {
      if (!this.permissions.allowSaveLocally) {
        ErrorHandler('Unable to save changes locally, this feature has been disabled');
        return;
      }
      localStorage.setItem(localStorageKeys.CONF_SECTIONS, JSON.stringify(config.sections));
      localStorage.setItem(localStorageKeys.PAGE_INFO, JSON.stringify(config.pageInfo));
      localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(config.appConfig));
      if (config.appConfig.theme) {
        localStorage.setItem(localStorageKeys.THEME, config.appConfig.theme);
      }
      InfoHandler('Config has succesfully been saved in browser storage', 'Config Update');
      this.showToast(this.$t('config-editor.success-msg-local'), true);
      this.$store.commit(StoreKeys.SET_EDIT_MODE, false);
    },
    carefullyClearLocalStorage() {
      localStorage.removeItem(localStorageKeys.PAGE_INFO);
      localStorage.removeItem(localStorageKeys.APP_CONFIG);
      localStorage.removeItem(localStorageKeys.CONF_SECTIONS);
    },
  },
};
