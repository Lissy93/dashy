<template>
<div class="synology-download-wrapper" v-if="tasks">
  <div v-for="(task, key) in tasks" :key="key" class="task-row">
    <PercentageChart :title="task.DisplayTitle"
      :showAsPercent=false
      :showLegend=false
      :values="[
      { label: $t('widgets.synology-download.downloaded'),
        size: task.Progress, color: '#20e253' },
      { label: $t('widgets.synology-download.remaining'),
        size: 100 - task.Progress, color: '#6092d1' },
      ]" />
    <p class="info">
      <strong>{{ $t('widgets.synology-download.downloaded') }}</strong>:
       {{ task.Downloaded | formatSize }}
      / {{ task.TotalSize | formatSize }} ({{ task.Progress }}%)
      ({{ task.DownSpeed | formatSize }}/s)<br/>
      <strong>{{ $t('widgets.synology-download.uploaded') }}</strong>:
       {{ task.Uploaded | formatSize }}
      ({{ task.UpSpeed | formatSize }}/s)
      (ratio : {{ Math.floor( task.Uploaded / task.Downloaded * 100 ) / 100 }})
    </p>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import PercentageChart from '@/components/Charts/PercentageChart';
import { getValueFromCss, convertBytes } from '@/utils/MiscHelpers';
import { serviceEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  components: {
    PercentageChart,
  },
  data() {
    return {
      tasks: null,
      sid: null,
    };
  },
  computed: {
    hostname() {
      if (!this.options.hostname) this.error('A hostname is required');
      return this.options.hostname;
    },
    username() {
      if (!this.options.username) this.error('A username is required');
      return this.options.username;
    },
    password() {
      if (!this.options.password) this.error('A password is required');
      return this.options.password;
    },
    endpointLogin() {
      return `${this.hostname}/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=${this.username}&passwd=${this.password}&session=DownloadStation&format=sid`;
    },
    endpointTasks() {
      return `${this.hostname}/webapi/DownloadStation/task.cgi?api=SYNO.DownloadStation.Task&version=1&method=list&additional=transfer,detail&_sid=${this.sid}`;
    },
    endpointLogout() {
      return `${this.hostname}/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=logout&session=DownloadStation&_sid=${this.sid}`;
    },
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
  },
  filters: {
    formatSize(byteValue) {
      return convertBytes(byteValue);
    },
  },
  methods: {
    login() {
      axios.request({
        method: 'GET',
        url: this.proxyReqEndpoint,
        headers: { 'Target-URL': this.endpointLogin },
      })
        .then(this.processLogin);
    },
    getTasks() {
      axios.request({
        method: 'GET',
        url: this.proxyReqEndpoint,
        headers: { 'Target-URL': this.endpointTasks },
      })
        .then(this.processTask);
    },
    logout() {
      axios.request({
        method: 'GET',
        url: this.proxyReqEndpoint,
        headers: { 'Target-URL': this.endpointLogout },
      });
    },
    fetchData() {
      this.startLoading();
      this.login();
    },
    update() {
      this.startLoading();
      this.login();
    },
    processLogin(loginData) {
      if (loginData.status !== 200 || !loginData.data.success) {
        this.error('Auth failed, check hostname, username & password (OTP not supported yet)');
      }
      this.sid = loginData.data.data.sid;
      this.getTasks();
    },
    processTask(taskData) {
      this.tasks = taskData.data.data.tasks.map(item => ({
        Title: item.title,
        DisplayTitle: `[${item.status}] ${item.title}`,
        Status: item.status,
        TotalSize: item.size,
        CreatedTime: item.additional.detail.create_time,
        Downloaded: item.additional.transfer.size_downloaded,
        Uploaded: item.additional.transfer.size_uploaded,
        DownSpeed: item.additional.transfer.speed_download,
        UpSpeed: item.additional.transfer.speed_upload,
        Progress: Math.floor((item.additional.transfer.size_downloaded / item.size) * 10000) / 100,
      })).sort((a, b) => this.statusToInt(b) - this.statusToInt(a)
        || b.CreatedTime - a.CreatedTime);
      this.finishLoading();
      this.logout();
    },
    statusToInt(status) {
      switch (status) {
        case 'downloading':
          return 1;
        case 'seeding':
          return 2;
        case 'finished':
          return 4;
        default:
          return 0;
      }
    },
  },
  mounted() {
    this.background = getValueFromCss('widget-accent-color');
  },
};
</script>

<style scoped lang="scss">
.synology-download-wrapper {
  color: var(--widget-text-color);
  .task-row {
    padding: 0.25rem 0 0.5rem 0;
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
    p.info {
      font-size: 0.8rem;
      margin: 0.25rem 0;
      color: var(--widget-text-color);
      opacity: var(--dimming-factor);
      font-family: var(--font-monospace);
    }
  }
  max-height: 350px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: none;
}
.synology-download-wrapper::-webkit-scrollbar {
    display: none;
}
</style>
