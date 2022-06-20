<template>
<div class="nextcloud-widget nextcloud-status-wrapper">
  <div v-if="notifications.length">
    <!-- group actions: delete all -->
    <p v-if="canDeleteNotification('delete-all')" class="group-action">
      <span class="action secondary" @click="deleteNotifications">{{ tt('delete-all') }}</span>
    </p>
    <hr/>
    <!-- notifications list -->
    <div v-for="(notification, idx) in notifications" :key="idx" class="notification">
      <div><img :src="notificationIcon(notification.icon)" /></div>
      <div>
        <p>
          <small class="date" v-tooltip="dateTooltip(notification)">
            {{ getTimeAgo(Date.parse(notification.datetime)) }}
          </small> <span v-tooltip="subjectTooltip(notification)">{{ notification.subject }} </span>
          <!-- notifications item: action links -->
          <span v-if="notification.actions.length">
            <span v-for="(action, idx) in notification.actions" :key="idx">
              <a :href="action.link" class="action" target="_blank">{{ action.label }}</a>
            </span>
          </span>
          <span v-if="canDeleteNotification('delete')">
            <a @click="deleteNotification(notification.notification_id)"
               class="action secondary">{{ tt('delete-notification') }}</a>
          </span>
        </p>
      </div>
      <hr/>
    </div>
  </div>
  <!-- empty notifications list -->
  <div v-else class="sep">
    <p>{{ tt('no-notifications') }}</p>
  </div>
</div>
</template>
<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import NextcloudMixin from '@/mixins/NextcloudMixin';

/**
 * NextcloudNotifications widget - Displays the user's notifications
 * Used endpoints
 *  - capabilities: to determine if the User Notification API is enabled
 *  - notifications: to fetch list of notifications, delete all or a single notification
 */
export default {
  mixins: [WidgetMixin, NextcloudMixin],
  components: {},
  data() {
    return {
      notifications: [],
    };
  },
  computed: {
    /* Parse the limit user option to either an integer or to an integer + 'm', 'h' or 'd' */
    limit() {
      const lim = this.options.limit;
      const defaultLimit = [0, false];
      if (typeof lim === 'string') {
        const k = { m: 60, h: 60 * 60, d: 60 * 60 * 24 };
        const m = lim.match(/(\d+)([hmd])/);
        if (m.length !== 3) return defaultLimit;
        return [false, m[1] * k[m[2]] * 1000];
      }
      if (typeof lim === 'number') {
        return [parseInt(this.options.limit, 10) || 0, false];
      }
      return defaultLimit;
    },
  },
  methods: {
    allowedStatuscodes() {
      return [100, 200];
    },
    async fetchData() {
      if (!this.hasValidCredentials()) return;
      await this.loadCapabilities();
      if (!this.capabilities?.notifications?.enabled) {
        this.error('This Nextcloud server doesn\'t support the Notifications API');
        return;
      }
      this.makeRequest(this.endpoint('notifications'), this.headers)
        .then(this.processNotifications)
        .finally(this.finishLoading);
    },
    processNotifications(response) {
      const notifications = this.validateResponse(response);
      const [limitCount, limitTime] = this.limit;
      this.notifications = [];
      notifications.forEach((notification) => {
        if (limitCount && this.notifications.length === limitCount) return; // count limit
        const notiTime = Date.parse(notification.datetime);
        const nowTime = new Date().getTime();
        if (limitTime && notiTime && nowTime - notiTime > limitTime) return; // time limit
        this.notifications.push(notification);
      });
    },
    /* Transform icon URL to SVG Color API request URL
     * @see https://docs.nextcloud.com/server/latest/developer_manual/html_css_design/icons.html */
    notificationIcon(url) {
      const color = this.getValueFromCss('widget-text-color').replace('#', '');
      return url.replace('core/img', 'svg/core')
        .replace(/extra-apps\/([^/]+)\/img/, 'svg/$1')
        .replace(/apps\/([^/]+)\/img/, 'svg/$1')
        .replace('.svg', `?color=${color}`);
    },
    /* Notification actions */
    canDeleteNotification(deleteTarget) {
      const capNotif = this.capabilities?.notifications?.features;
      return Array.isArray(capNotif) && capNotif.includes(deleteTarget);
    },
    deleteNotifications() {
      this.makeRequest(this.endpoint('notifications'), this.headers, 'DELETE')
        .then(() => {
          this.notifications = [];
        });
    },
    deleteNotification(id) {
      this.makeRequest(`${this.endpoint('notifications')}/${id}`, this.headers, 'DELETE')
        .then(this.fetchData);
    },
    /* Tooltip generators */
    subjectTooltip(notification) {
      const content = notification.message;
      return {
        content, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    dateTooltip(notification) {
      const content = new Date(Date.parse(notification.datetime)).toLocaleString();
      return {
        content, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
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
.nextcloud-status-wrapper {

  div p small i {
    position: relative;
    top: .25em;
  }
  small.date {
    background: var(--widget-text-color);
    color: var(--widget-accent-color);
    border-radius: .25em;
    padding: .15em .3em;
    margin: .25em .25em .25em 0;
    display: inline-block;
    font-weight: bold;
  }
  p.group-action {
    margin-top: 0;
  }
  span.action, span a.action {
    cursor: pointer;
    margin: .1em .5em .1em 0;
    padding: .15em;
    border-radius: .25em;
    white-space: nowrap;
  }
  span.action:hover, span a.action:hover {
    background: var(--widget-text-color);
    color: var(--widget-accent-color);
    text-decoration: underline;
  }
  .secondary {
    opacity: .5;
    font-size: 75%;
    margin-left: .2rem;
  }
  div.notification {
    display: table;
    width: 100%;
    > div:first-child {
      float: right;
    }
    > div:nth-child(2) {
      float: left;
      width: 93%;
    }
    > div {
      display: table-cell;
      text-align: left;
      > img {
        float: right;
        width: 1em;
        position: relative;
        top: 1em;
        opacity: .75;
      }
    }
  }
  div hr {
    margin-top: .3em;
    margin-bottom: 0;
  }
}
</style>
