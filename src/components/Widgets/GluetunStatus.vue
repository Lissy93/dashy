<template>
  <div class="vpn-ip-addr-wrapper">
  <div class="ip-row public-ip" v-if="public_ip">
    <span class="lbl">{{ $t('widgets.gluetun-status.vpn-ip') }}</span>
    <span class="val">{{ public_ip }}</span>
  </div>
  <div class="ip-row" v-if="country">
    <span class="lbl">{{ $t('widgets.gluetun-status.country') }}</span>
    <span class="val">{{ country }}</span>
  </div>
  <div class="ip-row" v-if="region">
    <span class="lbl">{{ $t('widgets.gluetun-status.region') }}</span>
    <span class="val">{{ region }}</span>
  </div>
  <div class="ip-row" v-if="city">
    <span class="lbl">{{ $t('widgets.gluetun-status.city') }}</span>
    <span class="val">{{ city }}</span>
  </div>
  <div class="ip-row" v-if="postal_code">
    <span class="lbl">{{ $t('widgets.gluetun-status.post-code') }}</span>
    <span class="val">{{ postal_code }}</span>
  </div>
  <div class="ip-row" v-if="location">
    <span class="lbl">{{ $t('widgets.gluetun-status.location') }}</span>
    <span class="val">{{ location }}</span>
  </div>
  <div class="ip-row" v-if="timezone">
    <span class="lbl">{{ $t('widgets.gluetun-status.timezone') }}</span>
    <span class="val">{{ timezone }}</span>
  </div>
  <div class="ip-row" v-if="organization">
    <span class="lbl">{{ $t('widgets.gluetun-status.organization') }}</span>
    <span class="val">{{ organization }}</span>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      public_ip: null,
      country: null,
      region: null,
      city: null,
      location: null,
      organization: null,
      postal_code: null,
      timezone: null,
    };
  },
  computed: {
    visibleFields() {
      return this.options.visibleFields || 'public_ip';
    },
    hostname() {
      if (!this.options.hostname) this.error('`hostname` is required');
      return this.options.hostname;
    },
  },
  methods: {
    /* Make GET request to Gluetun publicip API endpoint */
    fetchData() {
      this.makeRequest(`${this.hostname}/v1/publicip/ip`).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(ipInfo) {
      const fields = this.visibleFields.split(',');
      this.public_ip = fields.includes('public_ip') ? ipInfo.public_ip : null;
      this.country = fields.includes('country') ? ipInfo.country : null;
      this.region = fields.includes('region') ? ipInfo.region : null;
      this.city = fields.includes('city') ? ipInfo.city : null;
      this.location = fields.includes('location') ? ipInfo.location : null;
      this.organization = fields.includes('organization') ? ipInfo.organization : null;
      this.postal_code = fields.includes('postal_code') ? ipInfo.postal_code : null;
      this.timezone = fields.includes('timezone') ? ipInfo.timezone : null;
    },
  },
};
</script>

<style scoped lang="scss">
.vpn-ip-addr-wrapper {
  .ip-row {
    display: flex;
    padding: 0.1rem 0.1rem 0.5rem 0.1rem;
    align-items: center;
    justify-content: space-between;
    color: var(--widget-text-color);
    max-width: 400px;
    margin: 0.5rem auto;
    span.lbl {
      font-weight: bold;
    }
    span.val {
      font-family: var(--font-monospace);
    }
    &:not(.public-ip) {
      opacity: var(--dimming-factor);
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}
</style>
