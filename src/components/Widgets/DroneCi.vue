<template>
<div class="droneci-builds-wrapper" v-if="builds">
  <div
    class="build-row"
    v-for="build in builds" :key="build.id"
    v-tooltip="infoTooltip(build)"
  >
    <div class="status">
      <p :class="build.build.status">{{ build.build.status | formatStatus }}</p>
    </div>
    <div class="info">
      <p class="build-name"><a :href="build.git_http_url" target="_blank">{{ build.name }}</a></p>
      <p class="build-desc">
        <a :href="build.baseurl + '/' + build.slug + '/' +build.build.number" target="_blank">{{ build.build.number }}</a>
        <template v-if="build.event == 'pull_request'">
          <a :href="build.build.link" target="_blank" class="droneci-extra-info">#{{ formatPrId(build.build.link) }}</a> to <span class="droneci-info-link">{{ build.build.target }}</span>
        </template>
        <template v-if="build.event == 'push'">
          <a :href="build.build.link" target="_blank" class="droneci-extra-info">push</a> to <span class="droneci-extra-info">{{ build.build.target }}</span>
        </template>
        <template v-else>
          <span class="droneci-extra-info">{{ build.build.target }}</span>
        </template>
        <span v-if="build.status == 'running'">{{ build.build.started*1000 | formatTimeAgo }}</span>
        <span v-else-if="build.status != 'running' || build.status != 'pending' ">{{ formatBuildDuration(build) }}</span>
        <span v-else>Missing Time</span>
      </p>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { getTimeAgo, getTimeDifference, timestampToDateTime } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      builds: null,
    };
  },
  filters: {
    formatStatus(status) {
      let symbol = '';
      if (status === 'success') symbol = '✔';
      if (status === 'failure' || status === 'error') symbol = '✘';
      if (status === 'running') symbol = '❖';
      if (status === 'skipped') symbol = '↠';
      return `${symbol}`;
    },
    formatDate(timestamp) {
      return timestampToDateTime(timestamp);
    },
    formatTimeAgo(timestamp) {
      return getTimeAgo(timestamp);
    },
  },
  computed: {
    /* API endpoint, either for self-hosted or managed instance */
    endpoint() {
      if (this.options.host) return `${this.options.host}/api/user/builds`;
      this.error('Drone CI Host is required');
    },
    apiKey() {
      if (!this.options.apiKey) {
        this.error('An API key is required, please see the docs for more info');
      }
      return this.options.apiKey;
    },
  },
  methods: {
    /* Make GET request to Drone CI API endpoint */
    fetchData() {
      this.overrideProxyChoice = true;
      const authHeaders = { 'Authorization': `Bearer ${this.apiKey}` };
      this.makeRequest(this.endpoint, authHeaders).then(
        (response) => { this.processData(response); },
      );
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const results = data.slice(0, this.options.limit).map(obj => {
        return {...obj, baseurl: this.options.host};
      });
      this.builds = results;
    },
    infoTooltip(build) {
      const content = `<b>Trigger:</b> ${build.build.event} by ${build.build.trigger}<br>`
        + `<b>Repo:</b> ${build.slug}<br>`
        + `<b>Branch:</b> ${build.build.target}<br>`
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'build-info-tt',
      };
    },
    formatPrId(link) {
      return link.split('/').pop();
    },
    formatBuildDuration(build){
      return getTimeDifference(build.build.started*1000, build.build.finished*1000);
    },
  },
};
</script>

<style scoped lang="scss">
.droneci-builds-wrapper {
  color: var(--widget-text-color);
  .build-row {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 0.25rem 0;
    .status {
      min-width: 5rem;
      font-size: 1rem;
      font-weight: bold;
      p {
        margin: 0;
        color: var(--info);
        &.success { color: var(--success); }
        &.failure { color: var(--danger); }
        &.error { color: var(--danger); }
        &.running { color: var(--neutral); }
      }
    }
    .info {
      p.build-name {
        margin: 0.25rem 0;
        font-weight: bold;
        color: var(--widget-text-color);
        a, a:hover, a:visited, a:active {
          color: inherit;
          text-decoration: none;
        }
      }
      p.build-desc {
        margin: 0;
        color: var(--widget-text-color);
        opacity: var(--dimming-factor);
        a, a:hover, a:visited, a:active {
          color: inherit;
          text-decoration: none;
        }
        .droneci-extra-info {
          margin: 0.25em;
          padding: 0.25em;
          background: var(--item-background);
          border: 1px solid var(--primary);
          border-radius: 5px;
        }
      }
      p.build-desc::before {
        content: "#";
      }
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}

</style>

<style lang="scss">
.build-info-tt {
  min-width: 20rem;
}
</style>
