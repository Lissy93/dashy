<template>
<div class="wallet-balance">
  <template v-if="cryptoData">
    <div
      v-for="(asset, index) in cryptoData"
      :key="index"
      class="asset-wrapper"
      v-tooltip="tooltip(asset.info)"
    >
      <img class="icon" :src="asset.image" />
      <p class="name">{{ asset.name }}</p>
      <p class="price">{{ asset.price | currency }}</p>
      <p :class="`percent ${asset.percentChange > 0 ? 'up' : 'down'}`">
        {{ asset.percentChange | percentage }}
      </p>
    </div>
  </template>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { findCurrencySymbol, convertTimestampToDate } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      cryptoData: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    /* The crypto assets to fetch price data for */
    assets() {
      const usersChoice = this.options.assets;
      if (!usersChoice) return '';
      return usersChoice.join(',');
    },
    /* The fiat currency to calculate price data in */
    currency() {
      const userChoice = this.options.currency;
      if (typeof userChoice === 'string') return userChoice;
      return 'USD';
    },
    limit() {
      const userChoice = this.options.limit;
      if (userChoice && !Number.isNaN(userChoice) && userChoice > 0) return userChoice;
      return 100;
    },
    /* How results should be sorted */
    order() {
      const userChoice = this.options.sortBy;
      switch (userChoice) {
        case ('alphabetical'): return 'id_asc';
        case ('volume'): return 'volume_desc';
        case ('marketCap'): return 'market_cap_desc';
        default: return 'market_cap_desc';
      }
    },
    /* The formatted GET request API endpoint to fetch crypto data from */
    endpoint() {
      return `${widgetApiEndpoints.cryptoWatchList}?`
      + `ids=${this.assets}&vs_currency=${this.currency}&order=${this.order}&per_page=${this.limit}`;
    },
  },
  filters: {
    /* Append currency symbol to price */
    currency(price) {
      return `${findCurrencySymbol('usd')}${price}`;
    },
    /* Append percentage symbol, and up/ down arrow */
    percentage(change) {
      if (!change) return '';
      const symbol = change > 0 ? '↑' : '↓';
      return `${symbol} ${change.toFixed(2)}%`;
    },
  },
  methods: {
    /* Extends mixin, and updates data. Called by parent component */
    update() {
      this.startLoading();
      this.fetchData();
    },
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then((response) => {
          this.processData(response.data);
        })
        .catch((error) => {
          this.error('Unable to fetch crypto watch list', error);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    /* Convert response data into JSON to be consumed by the UI */
    processData(data) {
      const results = [];
      data.forEach((token) => {
        results.push({
          name: token.name,
          image: token.image,
          price: token.current_price,
          percentChange: token.price_change_percentage_24h,
          info: {
            symbol: token.symbol,
            rank: token.market_cap_rank,
            marketCap: token.market_cap,
            supply: token.circulating_supply,
            maxSupply: token.max_supply,
            allTimeHigh: token.ath,
            allTimeHighDate: token.ath_date,
          },
        });
      });
      this.cryptoData = results;
    },
    /* Show additional info as a tooltip on hover */
    tooltip(info) {
      const maxSupply = info.maxSupply ? ` out of max supply of <b>${info.maxSupply}</b>` : '';
      const content = `Rank: <b>${info.rank}</b> with market cap of `
        + `<b>${this.$options.filters.currency(info.marketCap)}</b>`
        + `<br>Circulating Supply: <b>${info.supply} ${info.symbol.toUpperCase()}</b>${maxSupply}`
        + `<br>All-time-high of <b>${info.allTimeHigh}</b> `
        + `at <b>${convertTimestampToDate(info.allTimeHighDate)}</b>`;
      return {
        content, html: true, trigger: 'hover focus', delay: 250,
      };
    },
  },
};
</script>

<style scoped lang="scss">

.asset-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--widget-text-color);
  .icon {
    width: 2rem;
    height: 2rem;
    border-radius: 1rem;
  }
  .name {
    font-weight: bold;
  }
  .percent, .price {
    font-family: var(--font-monospace);
    &.up { color: var(--success); }
    &.down { color: var(--danger); }
  }
  p {
    width: 25%;
  }
  &:not(:last-child) {
    border-bottom: 1px dashed var(--widget-text-color);
  }
}

</style>
