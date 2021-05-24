<template>
  <div class="cloud-backup-restore-wrapper">
    <div class="section intro">
      <h2>Cloud Backup & Restore</h2>
      <p class="intro">
        The cloud backup and restore feature, allows you to upload your config to the internet,
        and then restore it on any other device or instance of Dashy. This provides an alternative
        method of configuring, without the need to write YAML, and also means you don't necessarily
        need to host your own instance of the application.
        <br><br>
        All data is fully end-to-end encrypted with AES, using your password as the key.
        Both encryption and decryption happens on your device so your data cannot be
        accessed by anyone other than you.
      </p>
    </div>
    <div class="section backup-section">
      <h3 v-if="backupId">Update Backup</h3>
      <h3 v-else>Make a Backup</h3>
      <Input
        v-model="backupPassword"
        name="backup-password"
        :label="backupId ? 'Enter your Password' : 'Choose a Password'"
        layout="vertical"
        type="password"
      />
      <Button :click="checkPass">
        <template v-slot:text>{{backupId ? 'Update Backup' : 'Backup'}}</template>
        <template v-slot:icon><IconBackup /></template>
      </Button>
      <div class="results-view" v-if="backupId">
        <span class="backup-id-label">Your Backup ID: </span>
        <pre class="backup-id-value">{{ backupId }}</pre>
        <span class="backup-id-note">
          This is used to restore from backups later.
          So keep it, along with your password somewhere safe.
        </span>
      </div>
    </div>
    <div class="section restore-section">
      <h3>Restore a Backup</h3>
      <Input
        v-model="restoreCode"
        name="restore-code"
        label="Restore ID"
      />
      <Input
        v-model="restorePassword"
        name="restore-password"
        label="Password"
        type="password"
      />
      <Button>
        <template v-slot:text>Restore</template>
        <template v-slot:icon><IconRestore /></template>
      </Button>
    </div>
  </div>
</template>

<script>

import sha256 from 'crypto-js/sha256';
import Button from '@/components/FormElements/Button';
import Input from '@/components/FormElements/Input';
import IconBackup from '@/assets/interface-icons/config-backup.svg';
import IconRestore from '@/assets/interface-icons/config-restore.svg';
import { backup } from '@/utils/CloudBackup';
import { localStorageKeys } from '@/utils/defaults';

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
    };
  },
  components: {
    Button,
    Input,
    IconBackup,
    IconRestore,
  },
  methods: {
    checkPass() {
      const savedHash = localStorage[localStorageKeys.BACKUP_HASH] || undefined;
      if (!savedHash || savedHash === this.makeHash(this.backupPassword)) {
        this.makeBackup();
      } else {
        this.showErrorMsg('Incorrect password. Please enter the password you used last time.');
      }
    },
    makeBackup() {
      backup(this.config, this.backupPassword)
        .then((response) => {
          if (!response.data || response.data.errorMsg || !response.data.backupId) {
            this.showErrorMsg(response.data.errorMsg || 'Error');
          } else { // All clear, no error
            this.updateAfterBackup(response.data.backupId);
          }
        }).catch(() => {
          this.showErrorMsg('Unable to process request');
        });
    },
    updateAfterBackup(backupId) {
      const hash = this.makeHash(this.backupPassword);
      localStorage.setItem(localStorageKeys.BACKUP_ID, backupId);
      localStorage.setItem(localStorageKeys.BACKUP_HASH, hash);
      this.showSuccessMsg('Backup Completed Succesfully');
      this.backupPassword = '';
    },
    showErrorMsg(errorMsg) {
      this.$toasted.show(errorMsg, { className: 'toast-error' });
    },
    showSuccessMsg(msg) {
      this.$toasted.show(msg, { className: 'toast-success' });
    },
    makeHash(pass) {
      return sha256(pass).toString();
    },
  },
};
</script>

<style scoped lang="scss">
  div.cloud-backup-restore-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    text-align: center;
    height: 100%;
    background: var(--config-settings-background);
    color: var(--config-settings-color);

    .section {
      display: flex;
      flex-direction: column;
      width: fit-content;
      min-width: 400px;
      margin: 0 auto 1rem auto;
      padding-bottom: 1rem;
      &:first-child {
        border-bottom: 1px dashed var(--config-settings-color);
      }
      &.intro {
        width: 100%;
        height: fit-content;
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
  input, button, {
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
