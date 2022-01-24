<template>
<div class="ip-info-wrapper">
  <p class="ip-address">{{ ipAddr }}</p>
  <div class="region-wrapper">
    <img class="flag-image" :src="flagImg" alt="Flag" />
    <div class="info-text">
      <p class="isp-name">{{ ispName }}</p>
      <a class="ip-location" :href="mapsUrl" title="🗺️ Open in Maps">
        {{ location }}
      </a>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { getCountryFlag, getMapUrl } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  computed: {
    endpoint() {
      if (this.provider === 'ipgeolocation') {
        return `${widgetApiEndpoints.publicIp2}?apiKey=${this.apiKey}`;
      } else if (this.provider === 'ipapi') {
        return widgetApiEndpoints.publicIp3;
      }
      return widgetApiEndpoints.publicIp;
    },
    apiKey() {
      if (this.provider === 'ipgeolocation' && !this.options.apiKey) this.error('Missing API Key');
      return this.options.apiKey;
    },
    provider() {
      // Can be either `ip-api`, `ipapi.co` or `ipgeolocation`
      return this.options.provider || 'ipapi.co';
    },
  },
  data() {
    return {
      ipAddr: null,
      location: null,
      ispName: null,
      flagImg: null,
      mapsUrl: null,
    };
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    /* Assign data variables to the returned data */
    processData(ipInfo) {
      if (this.provider === 'ipapi.co') {
        this.ipAddr = ipInfo.ip;
        this.ispName = ipInfo.org;
        this.location = `${ipInfo.city}, ${ipInfo.region}`;
        this.flagImg = getCountryFlag(ipInfo.country_code);
        this.mapsUrl = getMapUrl({ lat: ipInfo.latitude, lon: ipInfo.longitude });
      } else if (this.provider === 'ipgeolocation') {
        this.ipAddr = ipInfo.ip;
        this.ispName = ipInfo.organization || ipInfo.isp;
        this.location = `${ipInfo.city}, ${ipInfo.country_name}`;
        this.flagImg = ipInfo.country_flag;
        this.mapsUrl = getMapUrl({ lat: ipInfo.latitude, lon: ipInfo.longitude });
      } else if (this.provider === 'ip-api') {
        this.ipAddr = ipInfo.query;
        this.ispName = ipInfo.isp;
        this.location = `${ipInfo.city}, ${ipInfo.regionName}`;
        this.flagImg = getCountryFlag(ipInfo.countryCode);
        this.mapsUrl = getMapUrl({ lat: ipInfo.lat, lon: ipInfo.lon });
      } else {
        this.error('Unknown API provider fo IP address');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.ip-info-wrapper {
  cursor: default;
  p.ip-address {
    font-size: 1.6rem;
    margin: 0.5rem auto;
    color: var(--widget-text-color);
    font-family: var(--font-monospace);
  }
  .region-wrapper {
    display: flex;
    align-items: center;
    img.flag-image {
      width: 2rem;
      border-radius: var(--curve-factor-small);
      margin: 0.25rem 0.5rem 0 0;
    }
    a.ip-location {
      font-size: 1rem;
      margin: 0;
      text-decoration: none;
      color: var(--widget-text-color);
      opacity: var(--dimming-factor);
      &:hover {
        text-decoration: underline;
      }
    }
    p.isp-name {
      font-size: 1rem;
      margin: 0.25rem 0 0 0;
      color: var(--widget-text-color);
    }
  }
}

</style>
