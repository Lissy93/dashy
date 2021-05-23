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
      <h3>Backup</h3>
      <Input
        v-model="backupPassword"
        name="backup-password"
        label="Choose a Password"
        layout="vertical"
        type="password"
      />
      <Button>
        <template v-slot:text>Backup</template>
        <template v-slot:icon><IconBackup /></template>
      </Button>
    </div>
    <div class="section restore-section">
      <h3>Restore</h3>
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

import Button from '@/components/FormElements/Button';
import Input from '@/components/FormElements/Input';
import IconBackup from '@/assets/interface-icons/config-backup.svg';
import IconRestore from '@/assets/interface-icons/config-restore.svg';

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
    };
  },
  components: {
    Button,
    Input,
    IconBackup,
    IconRestore,
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
