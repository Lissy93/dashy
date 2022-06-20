<template>
<div class="nextcloud-widget nextcloud-user-status-wrapper">
  <div v-if="didLoadData" class="sep">
    <!-- user statuses: list -->
    <div v-for="(status, userId) in statuses" :key="userId" class="user">
      <div>
        <!-- user status: emoji -->
        <div>
          <i>{{ status.icon }}</i>
        </div>
        <!-- user status: message -->
        <div>
          <p v-tooltip="clearAtTooltip(status.clearAt)">
            <strong>{{ status.userId }}</strong>&nbsp;
            <small v-if="status.clearAt"><i class="fal fa-clock"></i></small>
            <span v-else-if="status.message">•</span><em>{{ status.message }}</em>
          </p>
        </div>
        <!-- user status: status -->
        <div>
          <p>
            <small :class="`status ${status.status}`">
              <i v-if="status.status === 'online' || status.status === 'dnd'"
                class="fas fa-circle" v-tooltip="tt(status.status)"></i>
              <i v-else class="far fa-circle" v-tooltip="tt(status.status)"></i>
            </small>
          </p>
        </div>
      </div>
      <hr/>
    </div>
  </div>
   <!-- user statuses: no content -->
  <div v-else class="sep"><p>{{ tt('nothing-to-show') }}</p></div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import NextcloudMixin from '@/mixins/NextcloudMixin';

// Nextcloud User Status API supports getting all user statuses at once
// or a single user's status. {fetchStrategy} determines which of these methods to use.
const fetchStrategies = {
  allAtOnce: 'AllAtOnce',
  oneByOne: 'OneByOne',
};

/**
 * NextcloudUserStatus widget - Displays user statuses
 * Used endpoints
 *  - capabilities: to determine if the User Status API is enabled
 *  - userstatus: to fetch a single or all user statuses
 */
export default {
  mixins: [WidgetMixin, NextcloudMixin],
  components: {},
  computed: {
    didLoadData() {
      return !!Object.keys(this?.statuses || {}).length;
    },
    fetchStrategy() {
      if (!this.options.fetchStrategy) {
        return fetchStrategies.allAtOnce;
      }
      if (!Object.values(fetchStrategies).includes(this.options.fetchStrategy)) {
        return fetchStrategies.allAtOnce;
      }
      return this.options.fetchStrategy;
    },
    users() {
      if (!this.options.users || !Array.isArray(this.options.users)) return [];
      if (this.options.users.length > 100) return this.options.users.slice(0, 100);
      return this.options.users;
    },
    showEmpty() {
      return !!this.options.showEmpty;
    },
  },
  data() {
    return {
      statuses: {},
    };
  },
  methods: {
    allowedStatuscodes() {
      return [100, 200];
    },
    async fetchData() {
      if (!this.hasValidCredentials() || !this.users.length) return;
      await this.loadCapabilities();
      if (!this.capabilities?.userStatus) {
        this.error('This Nextcloud server doesn\'t support the User Status API');
        return;
      }
      if (this.fetchStrategy === fetchStrategies.allAtOnce) {
        this.makeRequest(this.endpoint('userstatus'), this.headers)
          .then(this.processStatuses)
          .finally(this.finishLoading);
      } else {
        const promises = [];
        this.newStatuses = {};
        this.users.forEach((user) => {
          promises.push(
            this.makeRequest(`${this.endpoint('userstatus')}/${user}`, this.headers)
              .then(this.processStatus),
          );
        });
        Promise.all(promises)
          .then(() => {
            this.statuses = this.newStatuses;
            delete this.newStatuses;
          })
          .finally(this.finishLoading);
      }
    },
    processStatuses(response) {
      const statuses = this.validateResponse(response);
      const newStatuses = {};
      Object.values(statuses).forEach((status) => {
        if (!this.users.includes(status.userId)) return;
        if (!status.message && !this.showEmpty) return;
        newStatuses[status.userId] = status;
      });
      this.statuses = newStatuses;
    },
    processStatus(response) {
      const raw = this.validateResponse(response);
      const status = Array.isArray(raw) && raw.length ? raw[0] : raw;
      if (status && (status.message || this.showEmpty)) {
        this.newStatuses[status.userId] = status;
      }
    },
    /* Tooltip generators */
    clearAtTooltip(clearAtTime) {
      const content = clearAtTime ? `${this.tt('until')}`
                    + ` ${new Date(clearAtTime * 1000).toLocaleString()}` : '';
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
  },
  created() {
    this.overrideUpdateInterval = 60;
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/widgets/nextcloud-shared.scss';
.nextcloud-user-status-wrapper {
  .status {
    float: right;
    i {
      position: relative;
      top: .15rem;
      margin: 0;
    }
  }
  .online {
    color: var(--success);
  }
  .offline {
    color: var(--medium-grey);
  }
  .away {
    color: var(--error);
  }
  .dnd {
    color: var(--danger);
  }
  div.user > div {
    display: table;
    width: 100%;
    > div:first-child {
      width: 1.75em;
      text-align: center;
      > i {
        font-style: normal;
      }
    }
    > div:nth-child(2) {
      p small i {
        top: 0;
        opacity: .5;
        margin: 0;
      }
    }
    > div {
      display: table-cell;
      text-align: left;
    }
  }
  div.user hr {
    margin-top: .3em;
    margin-bottom: .3em;
  }
  div.user > div > div:last-child hr {
    margin-bottom: 0;
  }
}
</style>
