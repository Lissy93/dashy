<template>
<div class="blacklist-check-wrapper" v-if="blacklisted">
  <p v-if="message" class="summary-msg">{{ message }}</p>
  <template v-if="showAll || (blacklisted && blacklistFiltered.length > 0)">
    <div v-for="blacklist in blacklistFiltered" :key="blacklist.id" class="blacklist-row">
      <span v-if="blacklist.detected" class="status detected">✘</span>
      <span v-else class="status not-detected">✔</span>
      <span>{{ blacklist.name }}</span>
    </div>
  </template>
  <div v-else class="all-clear">
    <p>No Detections Found</p>
    <span class="tick">✔</span>
  </div>
  <p class="toggle-view-all" @click="showAll = !showAll">
    {{ showAll ? $t('widgets.general.show-less') : $t('widgets.general.show-more') }}
  </p>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';

export default {
  mixins: [WidgetMixin],
  computed: {
    apiKey() {
      if (!this.options.apiKey) this.error('Missing API Key');
      return this.parseAsEnvVar(this.options.apiKey);
    },
    blacklistFiltered() {
      return this.showAll ? this.blacklisted : this.blacklisted.filter(bl => (bl.detected));
    },
  },
  data() {
    return {
      blacklisted: null,
      message: '',
      showAll: false,
    };
  },
  methods: {
    /* Fetch the user's IP (if not supplied), then run the blacklist check */
    async fetchData() {
      let ip = this.options.ipAddress;
      if (!ip) {
        const ipInfo = await this.makeRequest(widgetApiEndpoints.userIpLookup);
        if (!ipInfo || !ipInfo.ip) {
          this.error('Unable to determine your IP. Set `ipAddress` in options to check manually.');
          return;
        }
        ip = ipInfo.ip;
      }
      this.defaultTimeout = 200000;
      const endpoint = `${widgetApiEndpoints.blacklistCheck}/${ip}`;
      const options = { Authorization: `Basic ${btoa(`${this.apiKey}:`)}` };
      this.makeRequest(endpoint, options).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(blResponse) {
      this.message = `${blResponse.detections} detections found for ${blResponse.ip_address}`;
      this.blacklisted = blResponse.blacklists;
    },
  },
};
</script>

<style scoped lang="scss">
.blacklist-check-wrapper {
  color: var(--widget-text-color);
  padding: 0.25rem;
  cursor: default;
  max-height: 2800px;
  overflow: auto;
  .blacklist-row {
    display: flex;
    align-items: center;
    .status {
      width: 1rem;
      height: 1rem;
      padding: 0 0.25rem 0.5rem 0.25rem;
      margin: 0.1rem 0.5rem 0.1rem 0.1rem;
      border: 1px solid var(--widget-text-color);
      border-radius: 1rem;
      text-align: center;
      &.detected { color: var(--danger); border-color: var(--danger); }
      &.not-detected { color: var(--success); border-color: var(--success); }
    }
    &:not(:last-child) { border-bottom: 1px dashed var(--widget-text-color); }
  }
  p.summary-msg {
    font-size: 0.85rem;
    margin: 0.2rem auto;
    font-style: italic;
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
  }
  p.toggle-view-all {
    text-align: center;
    margin: 0.5rem auto;
    padding: 0.5rem;
    border-radius: var(--curve-factor);
    border: 1px dashed transparent;
    background: var(--widget-accent-color);
    cursor: pointer;
    &:hover {
      border-color: var(--widget-text-color);
    }
  }
  .all-clear {
    color: var(--success);
    text-align: center;
    .tick {
      font-size: 2rem;
      margin: 0 auto;
      border-radius: 1.5rem;
      padding: 0.3rem 0.8rem;
      background: var(--success);
      color: var(--white);
    }
  }
}

</style>
