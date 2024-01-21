<template>
<div class="blacklist-check-wrapper">
  <!-- Domain Name and Registration State / Expiry Count Down -->
  <div class="expiry-wrap" v-if="domainMeta" @click="toggleDomainInfo">
    <span class="name">{{ domainMeta.domainName }}</span>
    <span v-if="!domainMeta.isRegistered" class="not-registered">
      Not Registered
    </span>
    <span v-if="domainMeta.isRegistered"
      :class="`is-registered expire-date ${ getExpireColor(domainRegistration.expireDate) }`">
      {{ domainRegistration.expireDate | formatDate }}
    </span>
    <span v-if="domainMeta.isRegistered"
      :class="`is-registered time-left ${getExpireColor(domainRegistration.expireDate) }`">
      {{ domainRegistration.expireDate | formatTimeLeft }}
    </span>
  </div>
  <!-- Domain Info -->
  <div v-if="showDomainInfo && domainRegistration" class="domain-more-data">
    <div class="row">
      <span class="lbl">Created</span>
      <span class="val">{{ domainRegistration.createdDate | formatDate }}</span>
    </div>
    <div class="row">
      <span class="lbl">Updated</span>
      <span class="val">{{ domainRegistration.updatedDate | formatDate }}</span>
    </div>
    <div class="row">
      <span class="lbl">Expires</span>
      <span class="val">{{ domainRegistration.expireDate | formatDate }}</span>
    </div>
    <div class="row" v-for="(ns, inx) in domainRegistration.nameServers" :key="inx">
      <span class="lbl">NS {{ inx + 1 }}</span>
      <span class="val">{{ ns }}</span>
    </div>
    <div class="row">
      <span class="lbl">Domain ID</span>
      <span class="val">{{ domainRegistration.domainId }}</span>
    </div>
    <div class="row" v-if="domainRegistration.registrar">
      <span class="lbl">Registrar</span>
      <span class="val">{{ domainRegistration.registrar }}</span>
    </div>
    <div class="row" v-if="domainRegistration.admin">
      <span class="lbl">Admin</span>
      <span class="val">{{ domainRegistration.admin }}</span>
    </div>
  </div>
  <!-- Toggle Button -->
  <p @click="toggleDomainInfo" class="expend-details-btn" v-if="domainRegistration">
    {{ showDomainInfo ? $t('widgets.general.show-less') : $t('widgets.general.show-more') }}
  </p>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { timestampToDate, getTimeAgo } from '@/utils/MiscHelpers';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  computed: {
    apiKey() {
      if (!this.options.apiKey) this.error('Missing API Key');
      return this.options.apiKey;
    },
    domain() {
      if (!this.options.domain) this.error('Missing Domain Name Key');
      return this.options.domain;
    },
    endpoint() {
      return `${widgetApiEndpoints.domainMonitor}/?domain=${this.domain}&r=whois&apikey=${this.apiKey}`;
    },
  },
  data() {
    return {
      domainMeta: null,
      domainRegistration: null,
      showDomainInfo: false,
    };
  },
  filters: {
    formatDate(date) {
      if (!date) return 'No Date Supplied';
      return timestampToDate(date);
    },
    formatTimeLeft(date) {
      return getTimeAgo(new Date(date)).replace('in', '');
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(domainResults) {
      if (domainResults.limit_hit) this.error('API Limit Reached');
      if (domainResults.status !== '0') this.error(domainResults.status_desc || 'API Error');
      // Get domain name and registration status
      const domainName = domainResults.domain_name;
      const isRegistered = domainResults.registered;
      this.domainMeta = { domainName, isRegistered };
      // If domain registered, get registration info and expiry dates
      if (isRegistered) {
        this.domainRegistration = {
          expireDate: domainResults.date_expires,
          createdDate: domainResults.date_created,
          updatedDate: domainResults.date_updated,
          nameServers: domainResults.nameservers,
          domainId: domainResults.registry_domain_id,
          registrar: this.getRegistrar(domainResults.contacts),
          admin: this.getAdmin(domainResults.contacts),
        };
      }
    },
    getExpireColor(targetDate) {
      const now = new Date().getTime();
      const then = new Date(targetDate).getTime();
      const diff = Math.round((then - now) / (1000 * 60 * 60 * 24));
      if (diff < 7) return 'red';
      if (diff < 30) return 'orange';
      if (diff < 180) return 'yellow';
      if (diff >= 180) return 'green';
      return 'grey';
    },
    getRegistrar(contacts) {
      if (!Array.isArray(contacts) || contacts.length < 1) return null;
      const registrar = contacts.find((contact) => contact.type === 'registrar');
      if (registrar) return registrar.name || registrar.organization;
      return null;
    },
    getAdmin(contacts) {
      if (!Array.isArray(contacts) || contacts.length < 1) return null;
      const accHolder = contacts.find((contact) => contact.type === 'admin')
        || contacts.find((contact) => contact.type === 'registrant');
      if (accHolder) return accHolder.name || accHolder.organization;
      return null;
    },
    /* Show / hide full domain info */
    toggleDomainInfo() {
      this.showDomainInfo = !this.showDomainInfo;
    },
  },
  mounted() {
    if (this.options.showFullInfo) this.showDomainInfo = true;
  },
};
</script>

<style scoped lang="scss">
.blacklist-check-wrapper {
  color: var(--widget-text-color);
  padding: 0.25rem;
  cursor: default;
  overflow: auto;
}

.expiry-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--widget-text-color);
  cursor: default;
  font-size: 1.2rem;
  font-weight: bold;
  span.name {
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span.not-registered {
    color: var(--info);
  }
  span.expire-date {
    display: none;
    white-space: pre;
  }
  span.expire-date, span.time-left {
    &.red { color: var(--danger); }
    &.orange { color: var(--error); }
    &.yellow { color: var(--warning); }
    &.green { color: var(--success); }
    &.grey { color: var(--neutral); }
    &.blue { color: var(--info); }
  }
}

.blacklist-check-wrapper {
  &:hover {
    .expend-details-btn {
      visibility: visible;
    }
    span.expire-date {
      display: block;
    }
    span.time-left {
      display: none;
    }
  }
}

.expend-details-btn {
  visibility: hidden;
  margin: 0.2rem;
  font-size: 0.8rem;
  text-align: center;
  opacity: var(--dimming-factor);
  cursor: pointer;
}

.domain-more-data {
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
  .row {
    display: flex;
    padding: 0.2rem 0;
    justify-content: space-between;
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
    &:not(:last-child) { border-bottom: 1px dashed var(--widget-text-color); }
    span.val {
      font-family: var(--font-monospace);
      max-width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre;
      &:hover {
        max-width: 100%;
      }
    }
  }
}

</style>
