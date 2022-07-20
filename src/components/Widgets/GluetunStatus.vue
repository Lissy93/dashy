<template>
  <div class="vpn-ip-addr-wrapper">
  <div class="ip-row public-ip" v-if="public_ipT">
    <span class="lbl">VPN IP</span>
    <span class="val">{{ public_ip }}</span>
  </div>
  <div class="ip-row" v-if="regionT">
    <span class="lbl">Region</span>
    <span class="val">{{ region }}</span>
  </div>
  <div class="ip-row" v-if="countryT">
    <span class="lbl">Country</span>
    <span class="val">{{ country }}</span>
  </div>
  <div class="ip-row" v-if="cityT">
    <span class="lbl">City</span>
    <span class="val">{{ city }}</span>
  </div>
  <div class="ip-row" v-if="postal_codeT">
    <span class="lbl">Post Code</span>
    <span class="val">{{ postal_code }}</span>
  </div>
  <div class="ip-row" v-if="locationT">
    <span class="lbl">Location</span>
    <span class="val">{{ location }}</span>
  </div>
  <div class="ip-row" v-if="timezoneT">
    <span class="lbl">Timezone</span>
    <span class="val">{{ timezone }}</span>
  </div>
  <div class="ip-row" v-if="organizationT">
    <span class="lbl">Organization</span>
    <span class="val">{{ organization }}</span>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { getCountryFlag, getMapUrl } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  data() {
    return {
      public_ip: null,
      region: null,
      country: null,
      city: null,
      location: null,
      organization: null,
      postal_code: null,
      timezone: null,
      public_ipT: null,
      regionT: null,
      countryT: null,
      cityT: null,
      locationT: null,
      organizationT: null,
      postal_codeT: null,
      timezoneT: null,
    };
  },
  methods: {
    /* Make GET request to Gluetun publicip API endpoint */
    fetchData() {
      this.processToggles(this.options.visibleFields);
      this.makeRequest(this.options.hostname + "/v1/publicip/ip").then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(ipInfo) {
      this.public_ip = ipInfo.public_ip;
      this.region = ipInfo.region;
      this.country = ipInfo.country;
      this.city = ipInfo.city;
      this.location = ipInfo.location;
      this.organization = ipInfo.organization;
      this.postal_code = ipInfo.postal_code;
      this.timezone = ipInfo.timezone;
    },
    processToggles(toggles) {
      var fields = toggles.split(",");
      this.public_ipT = fields.includes("public_ip");
      this.regionT = fields.includes("region");
      this.countryT = fields.includes("country");
      this.cityT = fields.includes("city");
      this.locationT = fields.includes("location");
      this.organizationT = fields.includes("organization");
      this.postal_codeT = fields.includes("postal_code");
      this.timezoneT = fields.includes("timezone");
    }
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
