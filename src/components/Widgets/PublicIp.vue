<template>
<div class="ip-info-wrapper">
  <p class="ip-address">{{ ipAddr }}</p>
  <div class="region-wrapper" title="Open in Maps">
    <img class="flag-image" :src="flagImg" alt="Flag" />
    <div class="info-text">
      <p class="isp-name">{{ ispName }}</p>
      <a class="ip-location" :href="mapsUrl">{{ location }}</a>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { getCountryFlag, getMapUrl } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
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
      axios.get(widgetApiEndpoints.publicIp)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((dataFetchError) => {
          this.error('Unable to fetch IP info', dataFetchError);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Assign data variables to the returned data */
    processData(ipInfo) {
      this.ipAddr = ipInfo.query;
      this.ispName = ipInfo.isp;
      this.location = `${ipInfo.city}, ${ipInfo.regionName}`;
      this.flagImg = getCountryFlag(ipInfo.countryCode);
      this.mapsUrl = getMapUrl({ lat: ipInfo.lat, lon: ipInfo.lon });
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
