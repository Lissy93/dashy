<template>
<div class="ip-info-wrapper">
  <p class="ip-address">{{ ipAddr }}</p>
  <div class="region-wrapper" v-if="!options.hideLocation">
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
import { widgetApiEndpoints as urls } from '@/utils/defaults';
import { getCountryFlag, getMapUrl } from '@/utils/MiscHelpers';

/* Each provider's `parse` returns a normalised shape:
 * { ip, isp, city, region, countryCode, lat, lon }
 * `url` may be a string or a function that takes the user's apiKey. */
const PROVIDERS = {
  freeipapi: {
    url: urls.publicIp4,
    parse: (d) => ({
      ip: d.ipAddress,
      isp: d.asnOrganization,
      city: d.cityName,
      region: d.regionName,
      countryCode: d.countryCode,
      lat: d.latitude,
      lon: d.longitude,
    }),
  },
  ipinfo: {
    url: (key) => (key ? `${urls.publicIp5}?token=${key}` : urls.publicIp5),
    parse: (d) => {
      const [lat, lon] = (d.loc || ',').split(',');
      return {
        ip: d.ip,
        isp: d.org,
        city: d.city,
        region: d.region,
        countryCode: d.country,
        lat,
        lon,
      };
    },
  },
  ipquery: {
    url: urls.publicIp6,
    parse: (d) => ({
      ip: d.ip,
      isp: d.isp && (d.isp.org || d.isp.isp),
      city: d.location && d.location.city,
      region: d.location && d.location.state,
      countryCode: d.location && d.location.country_code,
      lat: d.location && d.location.latitude,
      lon: d.location && d.location.longitude,
    }),
  },
  'ip-api': {
    url: urls.publicIp3,
    parse: (d) => ({
      ip: d.query,
      isp: d.isp,
      city: d.city,
      region: d.regionName,
      countryCode: d.countryCode,
      lat: d.lat,
      lon: d.lon,
    }),
  },
  ipgeolocation: {
    url: (key) => `${urls.publicIp2}?apiKey=${key}`,
    requiresKey: true,
    parse: (d) => ({
      ip: d.ip,
      isp: d.organization || d.isp,
      city: d.city,
      region: d.state_prov,
      countryCode: d.country_code2,
      lat: d.latitude,
      lon: d.longitude,
    }),
  },
};

/* List of deleted/depricated providers. Used to show warning if user tries to use */
const REMOVED_PROVIDERS = {
  'ipapi.co': 'ipapi.co now serves a Cloudflare bot challenge to many clients.',
  'ifconfig.co': 'ifconfig.co does not send Access-Control-Allow-Origin headers.',
  'ip2location.io': 'ip2location.io does not send Access-Control-Allow-Origin headers.',
};

const DEFAULT_PROVIDER = 'freeipapi';

export default {
  mixins: [WidgetMixin],
  computed: {
    provider() {
      const chosen = this.parseAsEnvVar(this.options.provider);
      if (chosen && REMOVED_PROVIDERS[chosen]) {
        this.error(`Provider '${chosen}' is no longer supported: ${REMOVED_PROVIDERS[chosen]} `
          + `Pick one of: ${Object.keys(PROVIDERS).join(', ')}.`);
        return null;
      }
      if (chosen && !PROVIDERS[chosen]) {
        this.error(`Unknown provider '${chosen}'. Pick one of: ${Object.keys(PROVIDERS).join(', ')}.`);
        return null;
      }
      return chosen || DEFAULT_PROVIDER;
    },
    endpoint() {
      if (!this.provider) return null;
      const { url } = PROVIDERS[this.provider];
      return typeof url === 'function' ? url(this.apiKey) : url;
    },
    apiKey() {
      if (!this.provider) return null;
      const needsKey = PROVIDERS[this.provider].requiresKey;
      if (needsKey && !this.options.apiKey) this.error('Missing API Key');
      return this.options.apiKey;
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
    /* Make GET request to selected provider */
    fetchData() {
      if (!this.endpoint) return;
      this.makeRequest(this.endpoint).then(this.processData);
    },
    /* Normalise the response and assign to display fields */
    processData(ipInfo) {
      const parsed = PROVIDERS[this.provider].parse(ipInfo);
      this.ipAddr = parsed.ip;
      this.ispName = parsed.isp;
      this.location = [parsed.city, parsed.region].filter(Boolean).join(', ');
      this.flagImg = parsed.countryCode ? getCountryFlag(parsed.countryCode) : null;
      this.mapsUrl = getMapUrl({ lat: parsed.lat, lon: parsed.lon });
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
