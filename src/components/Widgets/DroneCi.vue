<template>
<div class="droneci-builds-wrapper" v-if="builds">
  <div
    class="build-row"
    v-for="build in builds" :key="build.id"
    v-tooltip="infoTooltip(build)"
  >
    <div class="status">
      <p :class="build.build.status">{{ build.build.status | formatStatus }}</p>
      <span v-if="build.build.status == 'running'">
        {{ build.build.started*1000 | formatTimeAgo }} ago
      </span>
      <span v-else-if="build.build.status != 'pending' ">
        {{ formatBuildDuration(build) }}
      </span>
      <span v-else>
        {{ build.build.created*1000 | formatTimeAgo }} ago
      </span>
    </div>
    <div class="info">
      <div class="build-name">
        {{ build.name }}
        <a
          class="droneci-build-number"
          :href="build.baseurl + '/' + build.slug + '/' +build.build.number"
          target="_blank"
        >{{ build.build.number }}</a>
      </div>
      <div class="build-desc">
        <span class="droneci-extra">
          <template v-if="build.build.event == 'pull_request'">
            <a
              :href="build.build.link"
              target="_blank"
              class="droneci-extra-info"
            >#{{ formatPrId(build.build.link) }}</a> to
          </template>
          <template v-else-if="build.build.event == 'push'">
            <a
              :href="build.build.link"
              target="_blank"
              class="droneci-extra-info"
            >push</a> to
          </template>
          <a
            :href="build.git_http_url"
            target="_blank"
            class="droneci-extra-info"
          >
            {{ build.build.target }}
          </a>
        </span>
      </div>
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
      if (status === 'failure' || status === 'error' || status === 'killed') symbol = '✘';
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
    endpointBuilds() {
      if (!this.options.host) this.error('drone.ci Host is required');
      return `${this.options.host}/api/user/builds`;
    },
    endpointRepoInfo() {
      if (!this.options.host) this.error('drone.ci Host is required');
      return `${this.options.host}/api/repos/${this.options.repo}`;
    },
    endpointRepoBuilds() {
      if (!this.options.host) this.error('drone.ci Host is required');
      return `${this.options.host}/api/repos/${this.options.repo}/builds`;
    },
    repo() {
      if (this.options.repo) return this.options.repo;
      return false;
    },
    apiKey() {
      if (!this.options.apiKey) {
        this.error('An API key is required, please see the docs for more info');
      }
      return this.options.apiKey;
    },
  },
  methods: {
    /* Fetch new data, configured by updateInterval */
    update() {
      this.startLoading();
      this.fetchData();
      this.finishLoading();
    },
    /* Make GET request to Drone CI API endpoint */
    fetchData() {
      const authHeaders = { Authorization: `Bearer ${this.apiKey}` };
      if (this.repo !== false) {
        this.makeRequest(this.endpointRepoInfo, authHeaders).then(
          (repoInfo) => {
            this.makeRequest(this.endpointRepoBuilds, authHeaders).then(
              (buildInfo) => {
                this.processRepoBuilds(repoInfo, buildInfo);
              },
            );
          },
        );
      } else {
        this.makeRequest(this.endpointBuilds, authHeaders).then(
          (response) => { this.processBuilds(response); },
        );
      }
    },
    /* Assign data variables to the returned data */
    processBuilds(data) {
      const results = data.slice(0, this.options.limit)
        .map((obj) => ({ ...obj, baseurl: this.options.host }));
      this.builds = results;
    },
    processRepoBuilds(repo, builds) {
      const results = builds.slice(0, this.options.limit)
        .map((obj) => ({ build: { ...obj }, baseurl: this.options.host, ...repo }));
      this.builds = results;
    },
    infoTooltip(build) {
      const content = `<b>Trigger:</b> ${build.build.event} by ${build.build.trigger}<br>`
        + `<b>Repo:</b> ${build.slug}<br>`
        + `<b>Branch:</b> ${build.build.target}<br>`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'build-info-tt',
      };
    },
    formatPrId(link) {
      return link.split('/').pop();
    },
    formatBuildDuration(build) {
      return getTimeDifference(build.build.started * 1000, build.build.finished * 1000);
    },
  },
};
</script>

<style scoped lang="scss">
.droneci-builds-wrapper {
  color: var(--widget-text-color);
  .build-row {
    display: grid;
    grid-template-columns: 1fr 2.5fr;
    justify-content: left;
    align-items: center;
    padding: 0.25rem 0;
    .status {
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
      span {
        font-size: 0.75rem;
        color: var(--secondary);
      }
    }
    .info {
      div.build-name {
        margin: 0.25rem 0;
        font-weight: bold;
        color: var(--widget-text-color);
        a, a:hover, a:visited, a:active {
          color: inherit;
          text-decoration: none;
        }
        .droneci-build-number::before {
          content: "#";
        }
      }
      div.build-desc {
        margin: 0;
        font-size: 0.85rem;
        color: var(--widget-text-color);
        opacity: var(--dimming-factor);
        a, a:hover, a:visited, a:active {
          color: inherit;
          text-decoration: none;
        }
        .droneci-extra {
          .droneci-extra-info {
            margin: 0.25em;
            padding: 0em 0.25em;
            background: var(--item-background);
            border: 1px solid var(--primary);
            border-radius: 5px;
          }
        }

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
