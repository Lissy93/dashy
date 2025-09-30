<template>
<div class="ip-info-wrapper">
  <p class="ip-address">{{ ipAddr }}</p>
  <div v-if="!hideDetails" class="region-wrapper">
    <img v-if="flagImg" class="flag-image" :src="flagImg" alt="Flag" />
    <div class="info-text">
      <p v-if="ispName" class="isp-name">{{ ispName }}</p>
      <a v-if="location && mapsUrl" class="ip-location" :href="mapsUrl" title="🗺️ Open in Maps">
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
      } else if (this.provider === 'ip2location.io') {
        return `${widgetApiEndpoints.publicIp4}?key=${this.apiKey}`;
      } else if (this.provider === 'ip-api') {
        return widgetApiEndpoints.publicIp3;
      }
      return widgetApiEndpoints.publicIp;
    },
    apiKey() {
      if (this.provider === 'ipgeolocation' && !this.options.apiKey) this.error('Missing API Key');
      if (this.provider === 'ip2location.io' && !this.options.apiKey) this.error('Missing API Key');
      return this.options.apiKey;
    },
    provider() {
      // Can be either `ip-api`, `ipapi.co`, `ipgeolocation` or `ip2location.io`
      return this.parseAsEnvVar(this.options.provider) || 'ipapi.co';
    },
    hideDetails() {
      // Hide geographical details when hideDetails option is true (default: false)
      return this.options.hideDetails === true;
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
      // Always set IP address (required field)
      this.ipAddr = ipInfo.ip || ipInfo.query || 'N/A';

      // Only process geographical details if not hiding them
      if (!this.hideDetails) {
        try {
          if (this.provider === 'ipapi.co') {
            this.ispName = ipInfo.org || null;
            this.location = this.buildLocation(ipInfo.city, ipInfo.region);
            this.flagImg = ipInfo.country_code ? getCountryFlag(ipInfo.country_code) : null;
            this.mapsUrl = this.buildMapsUrl(ipInfo.latitude, ipInfo.longitude);
          } else if (this.provider === 'ipgeolocation') {
            this.ispName = ipInfo.organization || ipInfo.isp || null;
            this.location = this.buildLocation(ipInfo.city, ipInfo.country_name);
            this.flagImg = ipInfo.country_flag || null;
            this.mapsUrl = this.buildMapsUrl(ipInfo.latitude, ipInfo.longitude);
          } else if (this.provider === 'ip-api') {
            this.ispName = ipInfo.isp || null;
            this.location = this.buildLocation(ipInfo.city, ipInfo.regionName);
            this.flagImg = ipInfo.countryCode ? getCountryFlag(ipInfo.countryCode) : null;
            this.mapsUrl = this.buildMapsUrl(ipInfo.lat, ipInfo.lon);
          } else if (this.provider === 'ip2location.io') {
            this.ispName = ipInfo.isp || null;
            this.location = this.buildLocation(ipInfo.city_name, ipInfo.region_name);
            this.flagImg = ipInfo.country_code ? getCountryFlag(ipInfo.country_code) : null;
            this.mapsUrl = this.buildMapsUrl(ipInfo.latitude, ipInfo.longitude);
          } else {
            this.error('Unknown API provider for IP address');
          }
        } catch (error) {
          // If geographical data processing fails, just show IP
          console.warn('Failed to process geographical data:', error);
          this.location = null;
          this.ispName = null;
          this.flagImg = null;
          this.mapsUrl = null;
        }
      }
    },
    /* Helper method to safely build location string */
    buildLocation(city, region) {
      if (!city && !region) return null;
      if (city && region) return `${city}, ${region}`;
      return city || region;
    },
    /* Helper method to safely build maps URL */
    buildMapsUrl(lat, lon) {
      if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null;
      try {
        return getMapUrl({ lat: parseFloat(lat), lon: parseFloat(lon) });
      } catch (error) {
        console.warn('Failed to generate maps URL:', error);
        return null;
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
