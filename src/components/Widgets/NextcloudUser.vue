<template>
<div v-if="didLoadData" class="nextcloud-widget nextcloud-info-wrapper">
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
        <small>Nextcloud {{ tt('version') }} {{ version.string }}</small>
      </p>
      <p class="username">{{ user.displayName }} <em>({{ user.id }})</em></p>
      <p class="login" v-tooltip="lastLoginTooltip()">
        <span>{{ tt('last-login') }}</span>&nbsp;
        <small>{{ getTimeAgo(user.lastLogin) }}</small>
      </p>
    </div>
  </div>
  <!-- disk space/quota -->
  <div>
    <div v-tooltip="quotaTooltip()">
      <hr/>
      <p>
        <i class="fal fa-disc-drive"></i>
        <strong v-if="user.quota.quota > 0">{{ tt('disk-quota') }}</strong>
        <strong v-else>{{ tt('disk-space') }}</strong>
        <em v-html="formatPercent(user.quota.relative)"></em>
        <small>{{ tt('of') }}</small><strong v-html="convertBytes(user.quota.total)"></strong>
        <span v-if="quotaChart.dataLoaded">
          <PercentageChart :values="quotaChart.data" :showLegend="false" />
        </span>
      </p>
      <hr/>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import NextcloudMixin from '@/mixins/NextcloudMixin';
import PercentageChart from '@/components/Charts/PercentageChart';

/**
 * NextcloudUser widget - Displays branding and user information
 * Used endpoints
 *  - capabilities: this delivers branding info (server name, logo, slogan, etc.)
 *  - user: name, last login, disk quota info
 */
export default {
  mixins: [WidgetMixin, NextcloudMixin],
  components: { PercentageChart },
  data() {
    return {
      user: {
        id: null,
        displayName: null,
        email: null,
        quota: {
          relative: null,
          total: null,
          used: null,
          free: null,
          quota: null,
        },
      },
      quotaChart: {
        dataLoaded: false,
        data: [
          { label: null, size: null, color: null },
          { label: null, size: null, color: null },
        ],
      },
    };
  },
  computed: {
    didLoadData() {
      return !!this.user.id;
    },
  },
  methods: {
    allowedStatuscodes() {
      return [100, 200];
    },
    fetchData() {
      if (!this.hasValidCredentials()) return;
      this.loadCapabilities()
        .then(this.loadUser)
        .finally(this.finishLoading);
    },
    loadUser() {
      return this.makeRequest(this.endpoint('user'), this.headers)
        .then(this.processUser);
    },
    processUser(userResponse) {
      const user = this.validateResponse(userResponse);
      this.user.id = user.id;
      this.user.email = user.email;
      this.user.quota = user.quota;
      this.user.displayName = user.displayname;
      this.user.lastLogin = user.lastLogin;
    },
    getQuotaChartColorUsed(percent) {
      if (percent < 0.75) return this.getValueFromCss('widget-text-color');
      if (percent < 0.85) return this.getValueFromCss('warning');
      if (percent < 0.95) return this.getValueFromCss('error');
      return this.getValueFromCss('danger');
    },
    updateQuotaChart() {
      const used = parseFloat(this.user.quota.used / this.user.quota.total);
      const free = parseFloat(this.user.quota.free / this.user.quota.total);
      const d = this.quotaChart.data;
      d[0] = { label: this.tt('used'), size: used, color: this.getQuotaChartColorUsed(used) };
      d[1] = { label: this.tt('available'), size: free, color: this.getValueFromCss('success') };
      this.quotaChart.dataLoaded = true;
    },
    /* Tooltip generators */
    quotaTooltip() {
      const quotaEnabled = this.user.quota.quota > 0;
      const content = `${this.tt('quota-enabled', { not: quotaEnabled ? '' : 'not ' })}`
                    + `<br><br>${this.convertBytes(this.user.quota.used)} ${this.tt('used')}<br>`
                    + `${this.convertBytes(this.user.quota.free)} ${this.tt('free')}<br>`
                    + `${this.convertBytes(this.user.quota.total)} ${this.tt('total')}`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
    lastLoginTooltip() {
      const content = new Date(this.user.lastLogin).toLocaleString();
      return {
        content, html: true, trigger: 'hover focus', delay: 250, classes: 'nc-tooltip',
      };
    },
  },
  created() {
    this.overrideUpdateInterval = 120;
  },
  updated() {
    this.updateQuotaChart();
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/widgets/nextcloud-shared.scss';
.nextcloud-info-wrapper {
  > div:first-child {
    display: flex;
  }
  > div:nth-child(2) {
    border-top: none;
  }
  div.percentage-chart-wrapper {
    margin: 0 .75em;
    width: 5em;
    position: relative;
    top: .2em;
    float: right;
  }
  div.logo {
    width: 40%;
    text-align: center;
    img {
      width: 8em;
    }
    p {
      font-size: .9em;
      opacity: .85;
    }
  }
  div.info {
    width: 56%;
    p {
      margin: 0 0 1rem 0;
    }
    p:last-child {
      margin: 0;
    }
    p.brand {
      margin: 0;
      font-size: 1.35em;
      font-weight: 800;
      letter-spacing: 3px;
    }
    p.version small {
      font-size: .75em;
    }
    p.username {
      font-size: 1.1em;
      em {
        font-size: .9em;
      }
    }
    p.login {
      span {
        font-size: .9em;
        margin-right: .25em;
      }
    }
  }
}
</style>
