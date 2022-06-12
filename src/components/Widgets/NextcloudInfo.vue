<template>
<div class="nextcloud-info-wrapper">
  <!-- logo, branding, user info -->
  <div>
    <div class="logo">
      <a :href="branding.url" target="_blank">
        <img :src="branding.logo" />
      </a>
      <p>{{ branding.slogan }}</p>
    </div>
    <div class="info">
      <p class="brand">{{ branding.name }}</p>
      <p class="version" v-if="version.string">
        <small>{{ $t('widgets.nextcloud-info.label-version') }} {{ version.string }}</small>
      </p>
      <p class="username">{{ user.displayName }} <em v-if="user.id">({{ user.id }})</em></p>
      <p class="login" v-tooltip="lastLoginTooltip()">
        <span>{{ $t('widgets.nextcloud-info.label-last-login') }}</span>&nbsp;
        <small>{{ getTimeAgo(user.lastLogin) }}</small>
      </p>
    </div>
  </div>
  <!-- disk quota -->
  <div v-if="user.quota.quota > 0" v-tooltip="quotaTooltip()">
    <p>
      <i class="fal fa-disc-drive"></i>
      <strong>{{ $t('Disk Quota') }}</strong>
      <em>{{ user.quota.relative }}%</em>&nbsp;
      <small>of</small> <strong>{{ convertBytes(user.quota.total) }}</strong>
    </p>
  </div>
  <div v-if="user.isAdmin" class="server-info">
    <!-- server info: users -->
    <div>
      <p v-tooltip="activeUsersTooltip()">
        <i class="fal fa-user"></i>
        <em>{{ formatNumber(server.nextcloud.storage.num_users) }}</em>
        <strong>{{ $t('total users') }}</strong> <small>{{ $t('of which') }}</small>
        <em>{{ formatNumber(server.activeUsers.last24hours) }}</em>
        <strong>{{ $t('active') }}</strong> <small>({{ $t('last 24 hours') }})</small>
      </p>
    </div>
    <hr />
    <div>
      <!-- server info: apps -->
      <p>
        <i class="fal fa-browser"></i>
        <em>{{ formatNumber(server.nextcloud.system.apps.num_installed) }}</em>
        <strong>{{ $t('applications') }}</strong>
        <span v-if="server.nextcloud.system.apps.num_updates_available"
              data-has-updates v-tooltip="appUpdatesTooltip()">
          <i class="fal fa-download"></i>
          <em>{{ server.nextcloud.system.apps.num_updates_available }}</em>
          <strong>
            {{ $t('widgets.nextcloud-info.updates-available',
            {plural: server.nextcloud.system.apps.num_updates_available > 1 ? 's' : ''}) }}
          </strong>
        </span>
        <span v-else >
          {{ $t('no pending updates') }}
        </span>
      </p>
      <hr />
      <!-- server info: storage -->
      <p v-tooltip="storagesTooltip()">
        <i class="fal fa-file"></i>
        <em>{{ formatNumber(server.nextcloud.storage.num_files) }}</em>
        <strong>{{ $t('files') }}</strong> <small>{{ $t('in') }}</small>
        <em>{{ server.nextcloud.storage.num_storages }}</em>
        <strong>{{ $t('storages') }}</strong>&nbsp;&nbsp;|
        <strong>{{ convertBytes(server.nextcloud.system.freespace) }}</strong>&nbsp;
        <small>{{ $t('free') }}</small>
      </p>
      <hr />
      <!-- server info: shares -->
      <p v-tooltip="sharesTooltip()">
        <i class="fal fa-share"></i>
        <em>{{ formatNumber(server.nextcloud.shares.num_shares) }}</em>
        <strong>{{ $t('autonomous') }}</strong> <small> {{ $t('and') }}</small>
        <em>
          {{ formatNumber(server.nextcloud.shares.num_fed_shares_sent +
          server.nextcloud.shares.num_fed_shares_received) }}
        </em>
        <strong>{{ $t('federated shares') }}</strong>
      </p>
      <hr />
      <!-- server info: server -->
      <p>
        <i class="fal fa-server"></i>
        <strong>{{ $t('Nextcloud') }}</strong>
        <em>{{ server.nextcloud.system.version }}</em>&nbsp;|
        <strong>{{ server.server.webserver }}/PHP</strong>
        <em>{{ server.server.php.version }}</em>
      </p>
      <hr />
      <!-- server info: database -->
      <p>
        <i class="fal fa-database"></i>
        <strong>{{ server.server.database.type }}</strong>
        <em>{{ server.server.database.version }}</em> <small>{{ $t('using') }}</small>
        <em>{{ convertBytes(server.server.database.size) }}</em>
      </p>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import NextcloudMixin from '@/mixins/NextcloudMixin';
import { convertBytes } from '@/utils/MiscHelpers';
// //import { NcdServer } from '@/utils/ncd';

const NextcloudSchema = {
  branding: {
    name: null,
    logo: null,
    url: null,
    slogan: null,
  },
  version: {
    string: null,
    edition: null,
  },
  server: {
    server: {
      webserver: null,
      php: {
        version: null,
      },
      opCache: {
        enabled: false,
        full: false,
        stats: {
          num_cached_scripts: null,
          num_cached_keys: null,
          max_cached_keys: null,
          hits: null,
          start_time: null,
          last_restart_time: 0,
          misses: null,
          opcache_hit_rate: null,
        },
        memory: {
          used_memory: null,
          free_memory: null,
          wasted_memory: null,
          current_wasted_percentage: null,
        },
      },
      database: {
        type: null,
        version: null,
        size: null,
      },
    },
    nextcloud: {
      system: {
        version: null,
        freespace: null,
        cpuload: [],
        mem_total: null,
        mem_free: null,
        apps: {
          num_installed: null,
          num_updates_available: 0,
          app_updates: [],
        },
      },
      storage: {
        num_users: null,
        num_files: null,
        num_storages: null,
      },
      shares: {
        num_shares: null,
        num_shares_user: null,
        num_shares_groups: null,
        num_shares_link: null,
        num_shares_mail: null,
        num_shares_room: null,
        num_shares_link_no_password: null,
        num_fed_shares_sent: null,
        num_fed_shares_received: null,
      },
    },
    activeUsers: {
      last5minutes: null,
      last1hour: null,
      last24hours: null,
    },
  },
};

export default {
  mixins: [WidgetMixin, NextcloudMixin],
  components: {},
  data() {
    return NextcloudSchema;
  },
  methods: {
    async fetchData() {
      await this.loadCapabilities();
      await this.loadUser();
      if (this.user.isAdmin) {
        this.processServerInfo(
          await this.makeRequest(this.endpoint('serverinfo'), this.headers),
          // //NcdServer,
        );
      }
      this.finishLoading();
    },
    processServerInfo(serverData) {
      const data = serverData?.ocs?.data;
      if (!data) {
        this.error('Invalid response');
        return;
      }
      this.server.nextcloud = data?.nextcloud;
      this.server.server.php.version = data?.server?.php?.version;
      this.server.server.opCache.enabled = data?.server?.php?.opcache?.opcache_enabled;
      this.server.server.opCache.full = data?.server?.php?.opcache?.cache_full;
      this.server.server.opCache.stats = data?.server?.php?.opcache?.opcache_statistics;
      this.server.server.database = data?.server?.database;
      this.server.server.webserver = data?.server?.webserver;
      this.server.activeUsers = data?.activeUsers;
    },
    quotaTooltip() {
      const content = `${convertBytes(this.user.quota.used)} used<br>`
                    + `${convertBytes(this.user.quota.free)} free<br>`
                    + `${convertBytes(this.user.quota.total)} total`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-user-quota',
      };
    },
    lastLoginTooltip() {
      const content = new Date(this.user.lastLogin).toLocaleString();
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    activeUsersTooltip() {
      const content = `${this.server.activeUsers.last5minutes} in the last 5 minutes<br>`
                    + `${this.server.activeUsers.last1hour} in the last 1 hour<br>`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    appUpdatesTooltip() {
      const content = 'Updates are available for:<br><br>'
                    + ` ${Object.entries(this.server.nextcloud.system.apps.app_updates).join('<br>')}`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    storagesTooltip() {
      const content = 'Storages by type:<br><br>'
                    + `${this.server.nextcloud.storage.num_storages_local} local<br>`
                    + `${this.server.nextcloud.storage.num_storages_home} home<br>`
                    + `${this.server.nextcloud.storage.num_storages_other} other<br><br>`
                    + `${this.server.nextcloud.storage.num_files} files`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    sharesTooltip() {
      const content = 'Autonomous shares:<br><br>'
                    + `${this.server.nextcloud.shares.num_shares_user} user<br>`
                    + `${this.server.nextcloud.shares.num_shares_groups} groups<br>`
                    + `${this.server.nextcloud.shares.num_shares_mail} email<br>`
                    + `${this.server.nextcloud.shares.num_shares_room} chat room<br>`
                    + `${this.server.nextcloud.shares.num_shares_link} private link<br>`
                    + `${this.server.nextcloud.shares.num_shares_link_no_password} public link<br>`
                    + '<br>Federated shares:<br><br>'
                    + `${this.server.nextcloud.shares.num_fed_shares_sent} sent<br>`
                    + `${this.server.nextcloud.shares.num_fed_shares_received} received<br>`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    created() {
      this.overrideUpdateInterval = 120;
    },
  },
};
</script>

<style scoped lang="scss">
.nextcloud-info-wrapper {
  > div:first-child {
    display: flex;
  }
  > div:not(:first-child) {
    border-top: 1px dashed var(--widget-text-color);
    width: 96%;
    padding: .4rem 0;
    margin: auto;
    > div:not(:first-child) {
      width: 100%;
      position: relative;
    }
  }
  p {
    color: var(--widget-text-color);
    margin: 0.5rem 0;
  }
  > div:first-child {
    min-height: 8em;
  }
  p i {
    font-size: 110%;
    min-width: 18px;
    text-align: center;
  }
  p em {
    font-size: 110%;
    margin: 0 4px;
    font-weight: 800;
  }
  strong {
    font-weight: 800;
    font-size: 105%;
    margin-left: .25rem;
  }
  small {
    opacity: .66;
  }
  hr {
    color: var(--widget-text-color);
    border: none;
    border-top: 1px solid;
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
    opacity: .25;
  }
  div.logo {
    width: 40%;
    text-align: center;
    img {
      width: 8rem;
    }
    p {
      font-size: 90%;
      opacity: .85;
    }
  }
  div.info {
    width: 56%;
    p {
      margin: 0 0 1rem 0;
    }
    p.brand {
      margin: 0;
      font-size: 135%;
      font-weight: 800;
      letter-spacing: 3px;
    }
    p.version small {
      font-size: 75%;
    }
    p.username {
      font-size: 110%;
      em {
        font-size: 90%;
      }
    }
    p.login {
      span {
        font-size: 90%;
        margin-right: .25rem;
      }
    }
  }
  div.server-info {
    span[data-has-updates] {
      color: var(--success);
      margin-left: 0.5rem;
    }
  }
}
</style>
