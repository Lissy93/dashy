<template>
<div v-if="didLoadData" class="nextcloud-widget nextcloud-stats-wrapper">
  <div class="server-info sep">
    <!-- server info: users -->
    <div v-if="activeUsers">
      <p v-tooltip="activeUsersTooltip()">
        <i class="fal fa-user"></i>
        <em v-html="formatNumber(storage.num_users)"></em>
        <strong>{{ tt('total-users') }}</strong> <small>{{ tt('of-which') }}</small>
        <em v-html="formatNumber(activeUsers.last24hours)"></em>
        <strong>{{ tt('active') }}</strong> <small>({{ tt('last-24-hours') }})</small>
      </p>
    </div>
    <hr />
    <div v-if="nextcloud">
      <!-- server info: apps -->
      <p v-tooltip="appUpdatesTooltip()">
        <i class="fal fa-browser"></i>
        <em v-html="formatNumber(apps.num_installed)"></em>
        <strong>{{ tt('applications') }}</strong>
        <span v-if="apps.num_updates_available" class="nc-updates">
          <i class="fal fa-download"></i><em>{{ apps.num_updates_available }}</em>
          <strong>
            {{ tt('updates-available',
            {plural: apps.num_updates_available > 1 ? 's' : ''}) }}
          </strong>
        </span>
        <small v-else data-nc-updates class="disabled">{{ tt('no-pending-updates') }}</small>
      </p>
      <hr />
      <!-- server info: storage -->
      <p v-tooltip="storagesTooltip()">
        <i class="fal fa-file"></i><em v-html="formatNumber(storage.num_files)"></em>
        <strong>{{ tt('files', { plural: storage.num_files > 1 ? 's' : '' }) }}</strong>&nbsp;
        <small>{{ tt('in') }}</small><em>{{ storage.num_storages }}</em>
        <strong>{{ tt('storages', { plural: storage.num_storages > 1 ? 's' : '' }) }}</strong>
        &nbsp;•&nbsp;<strong v-html="convertBytes(system.freespace)"></strong>&nbsp;
        <small>{{ tt('free') }}</small>
      </p>
      <hr />
      <!-- server info: shares -->
      <p v-tooltip="sharesTooltip()">
        <i class="fal fa-share"></i>
        <em v-html="formatNumber(shares.num_shares)"></em>
        <strong>{{ tt('local') }}</strong> <small> {{ tt('and') }}</small>
        <em v-html="formatNumber(shares.num_fed_shares_sent
                 + shares.num_fed_shares_received)"></em>
        <strong>
          {{ tt('federated-shares') }}
        </strong>
      </p>
      <hr />
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import NextcloudMixin from '@/mixins/NextcloudMixin';

/**
 * NextcloudStats widget - Shows statistics about Nextcloud usage
 * Used endpoints
 *  - serverinfo: requires Nextcloud admin user
 */

export default {
  mixins: [WidgetMixin, NextcloudMixin],
  components: {},
  data() {
    return {
      nextcloud: {
        system: {
          freespace: null,
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
    };
  },
  computed: {
    didLoadData() {
      return !!(this?.system?.freespace);
    },
    // data shortcuts
    system() {
      return this.nextcloud.system;
    },
    storage() {
      return this.nextcloud.storage;
    },
    shares() {
      return this.nextcloud.shares;
    },
    apps() {
      return this.nextcloud.system.apps;
    },
  },
  methods: {
    allowedStatuscodes() {
      return [200];
    },
    fetchData() {
      if (!this.hasValidCredentials()) return;
      this.makeRequest(this.endpoint('serverinfo'), this.headers)
        .then(this.processServerInfo)
        .finally(this.finishLoading);
    },
    processServerInfo(serverResponse) {
      const data = this.validateResponse(serverResponse);
      this.nextcloud = data.nextcloud;
      this.activeUsers = data.activeUsers;
    },
    /* Tooltip generators */
    activeUsersTooltip() {
      const content = `${parseFloat(this.activeUsers.last5minutes).toLocaleString()}`
                    + ` ${this.tt('last-5-minutes')}<br>`
                    + `${parseFloat(this.activeUsers.last1hour).toLocaleString()}`
                    + ` ${this.tt('last-hour')}<br>`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    appUpdatesTooltip() {
      let content = `<strong>${this.tt('updates-available-for')}</strong><ul>`;
      Object.entries(this.system.apps.app_updates).forEach(([app, version]) => {
        content += `<li>${app}: ${version}</li>`;
      });
      content += '</ul>';
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    storagesTooltip() {
      const content = `<strong>${this.tt('storages-by-type')}</strong><ul><li>`
        + `${parseFloat(this.storage.num_storages_local).toLocaleString()} ${this.tt('local')}</li><li>`
        + `${parseFloat(this.storage.num_storages_home).toLocaleString()} ${this.tt('home')}</li><li>`
        + `${parseFloat(this.storage.num_storages_other).toLocaleString()} ${this.tt('other')}</li></ul>`
        + `${parseFloat(this.storage.num_files).toLocaleString()} ${this.tt('total-files')}`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    sharesTooltip() {
      const content = `<strong>${this.tt('local-shares')}</strong><ul><li>`
        + `${parseFloat(this.shares.num_shares_user).toLocaleString()} ${this.tt('user')}</li><li>`
        + `${parseFloat(this.shares.num_shares_groups).toLocaleString()} ${this.tt('groups')}</li><li>`
        + `${parseFloat(this.shares.num_shares_mail).toLocaleString()} ${this.tt('email')}</li><li>`
        + `${parseFloat(this.shares.num_shares_room).toLocaleString()} ${this.tt('chat-room')}</li><li>`
        + `${parseFloat(this.shares.num_shares_link).toLocaleString()} ${this.tt('private-link')}</li><li>`
        + `${parseFloat(this.shares.num_shares_link_no_password).toLocaleString()} ${this.tt('public-link')}</li></ul>`
        + `<strong>${this.tt('federated-shares-ucfirst')}</strong><ul><li>`
        + `${parseFloat(this.shares.num_fed_shares_sent).toLocaleString()} ${this.tt('sent')}</li><li>`
        + `${parseFloat(this.shares.num_fed_shares_received).toLocaleString()} ${this.tt('received')}</li></ul>`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
  },
  created() {
    this.overrideUpdateInterval = 20;
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/widgets/nextcloud-shared.scss';
.nextcloud-stats-wrapper {
  div.server-info .nc-updates {
    color: var(--success);
    margin-left: .5em;
  }
}
</style>
