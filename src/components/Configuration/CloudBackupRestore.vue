<template>
  <div class="cloud-backup-restore-wrapper">
    <div class="section intro">
      <h2>{{ $t('cloud-sync.title') }}</h2>
      <p class="intro">
        {{ $t('cloud-sync.intro-l1') }}
        <br><br>
        {{ $t('cloud-sync.intro-l2') }}
        <br>
        {{ $t('cloud-sync.intro-l3') }}
        <a href="https://github.com/Lissy93/dashy/blob/master/docs/backup-restore.md">docs</a>
      </p>
    </div>
    <div class="section backup-section">
      <h3 v-if="backupId">{{ $t('cloud-sync.backup-title-setup') }}</h3>
      <h3 v-else>{{ $t('cloud-sync.backup-title-setup') }}</h3>
      <Input
        v-model="backupPassword"
        name="backup-password"
        :label="backupId
          ? $t('cloud-sync.password-label-update') : $t('cloud-sync.password-label-setup')"
        layout="vertical"
        type="password"
      />
      <Button :click="checkPass">
        <template v-slot:text>
          {{backupId
            ? $t('cloud-sync.backup-button-update') : $t('cloud-sync.backup-button-setup')}}
        </template>
        <template v-slot:icon><IconBackup /></template>
      </Button>
      <div class="results-view" v-if="backupId">
        <span class="backup-id-label">{{ $t('cloud-sync.backup-id-label') }}: </span>
        <pre class="backup-id-value">{{ backupId }}</pre>
        <span class="backup-id-note">{{ $t('cloud-sync.backup-id-note') }}</span>
      </div>
    </div>
    <div class="section restore-section">
      <h3>{{ $t('cloud-sync.restore-title') }}</h3>
      <Input
        v-model="restoreCode"
        name="restore-code"
        :label="$t('cloud-sync.restore-id-label')"
      />
      <Input
        v-model="restorePassword"
        name="restore-password"
        :label="$t('cloud-sync.restore-password-label')"
        type="password"
      />
      <Button :click="restoreBackup">
        <template v-slot:text>{{ $t('cloud-sync.restore-button') }}</template>
        <template v-slot:icon><IconRestore /></template>
      </Button>
    </div>
  </div>
</template>

<script>

import sha256 from 'crypto-js/sha256';
import ProgressBar from 'rsup-progress';
import Button from '@/components/FormElements/Button';
import Input from '@/components/FormElements/Input';
import IconBackup from '@/assets/interface-icons/config-backup.svg';
import IconRestore from '@/assets/interface-icons/config-restore.svg';
import { backup, update, restore } from '@/utils/CloudBackup';
import { localStorageKeys } from '@/utils/defaults';
import { InfoHandler, WarningInfoHandler } from '@/utils/ErrorHandler';

export default {
  name: 'CloudBackupRestore',
  props: {
    config: Object,
  },
  data() {
    return {
      backupPassword: '',
      restorePassword: '',
      restoreCode: '',
      backupId: localStorage[localStorageKeys.BACKUP_ID] || '',
      progress: new ProgressBar({ color: 'var(--progress-bar)' }),
    };
  },
  components: {
    Button,
    Input,
    IconBackup,
    IconRestore,
  },
  methods: {
    restoreBackup() {
      this.progress.start();
      restore(this.restoreCode, this.restorePassword)
        .then((response) => {
          this.restoreFromBackup(response, this.restoreCode);
          this.progress.end();
        }).catch((msg) => {
          this.showErrorMsg(msg);
          this.progress.end();
        });
    },
    checkPass() {
      const savedHash = localStorage[localStorageKeys.BACKUP_HASH] || undefined;
      if (!this.backupPassword) {
        this.showErrorMsg(this.$t('cloud-sync.backup-missing-password'));
      } else if (!savedHash) {
        this.makeBackup();
      } else if (savedHash === this.makeHash(this.backupPassword)) {
        this.makeUpdate();
      } else {
        this.showErrorMsg(this.$t('cloud-sync.backup-error-password'));
      }
    },
    makeBackup() {
      this.progress.start();
      backup(this.config, this.backupPassword)
        .then((response) => {
          if (!response.data || response.data.errorMsg || !response.data.backupId) {
            this.showErrorMsg(response.data.errorMsg || 'Error');
          } else { // All clear, no error
            this.updateUiAfterBackup(response.data.backupId, false);
          }
          this.progress.end();
        }).catch(() => {
          this.showErrorMsg(this.$t('cloud-sync.backup-error-unknown'));
          this.progress.end();
        });
    },
    makeUpdate() {
      this.progress.start();
      update(this.config, this.backupPassword, this.backupId)
        .then((response) => {
          if (!response.data || response.data.errorMsg || !response.data.backupId) {
            this.showErrorMsg(response.data.errorMsg || 'Error');
          } else { // All clear, no error
            this.updateUiAfterBackup(response.data.backupId, true);
          }
          this.progress.end();
        }).catch(() => {
          this.showErrorMsg(this.$t('cloud-sync.backup-error-unknown'));
          this.progress.end();
        });
    },
    restoreFromBackup(config, backupId) {
      localStorage.setItem(localStorageKeys.CONF_SECTIONS, JSON.stringify(config.sections));
      localStorage.setItem(localStorageKeys.APP_CONFIG, JSON.stringify(config.appConfig));
      localStorage.setItem(localStorageKeys.PAGE_INFO, JSON.stringify(config.pageInfo));
      if (config.appConfig.theme) {
        localStorage.setItem(localStorageKeys.THEME, config.appConfig.theme);
      }
      this.setBackupIdLocally(backupId, this.restorePassword);
      this.showSuccessMsg(this.$t('cloud-sync.restore-success-msg'));
      setTimeout(() => { location.reload(); }, 1500); // eslint-disable-line no-restricted-globals
    },
    updateUiAfterBackup(backupId, isUpdate = false) {
      this.setBackupIdLocally(backupId, this.backupPassword);
      this.showSuccessMsg(
        `${isUpdate ? 'Update' : 'Backup'} ${this.$t('cloud-sync.backup-success-msg')}`,
      );
      this.backupPassword = '';
    },
    showErrorMsg(errorMsg) {
      WarningInfoHandler(errorMsg, 'Cloud Backup');
      this.$toasted.show(errorMsg, { className: 'toast-error' });
    },
    showSuccessMsg(msg) {
      InfoHandler(msg, 'Cloud Backup');
      this.$toasted.show(msg, { className: 'toast-success' });
    },
    makeHash(pass) {
      return sha256(pass).toString();
    },
    setBackupIdLocally(backupId, pass) {
      this.backupId = backupId;
      const hash = this.makeHash(pass);
      localStorage.setItem(localStorageKeys.BACKUP_ID, backupId);
      localStorage.setItem(localStorageKeys.BACKUP_HASH, hash);
    },
  },
};
</script>

<style scoped lang="scss">
  @import '@/styles/style-helpers.scss';
  div.cloud-backup-restore-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    text-align: center;
    overflow: auto;
    height: 100%;
    background: var(--config-settings-background);
    color: var(--config-settings-color);
    @extend .scroll-bar;

    .section {
      display: flex;
      flex-direction: column;
      width: fit-content;
      margin: 0 auto 1rem auto;
      padding: 0 0.5rem 1rem 0.5rem;
      &:first-child {
        border-bottom: 1px dashed var(--config-settings-color);
      }
      &.intro {
        width: 100%;
        height: fit-content;
        a {
          color: var(--config-settings-color);
        }
      }
    }

    h2 { font-size: 2rem; }
    h3 { font-size: 1.6rem; }
    p.intro {
      text-align: left;
      font-size: 1rem;
      margin: 0.25rem;
      padding: 0.25rem;
    }
  }

  div.results-view {
    width: 16rem;
    margin: 0.5rem auto;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;
    border: 1px dashed var(--config-settings-color);
    border-radius: var(--curve-factor);
    text-align: left;
    .backup-id-label, .backup-id-value {
      display: inline;
      font-size: 1rem;
      margin-right: 0.5rem;
    }
    .backup-id-note {
      font-size: 0.8rem;
      display: block;
      opacity: 0.8;
      margin-top: 0.5rem;
    }
  }

  /* Overide form element colors, so that config menu can be themed by user */
  input, button {
    color: var(--config-settings-color);
    border: 1px solid var(--config-settings-color);
    background: none;
    width: 16rem;
  }
  input:focus {
    box-shadow: 1px 1px 6px var(--config-settings-color);
  }
  button:hover {
    color: var(--config-settings-background);
    border: 1px solid var(--config-settings-background);
    background: var(--config-settings-color);
  }
  h2, h3 {
    margin: 1rem;
  }

</style>
