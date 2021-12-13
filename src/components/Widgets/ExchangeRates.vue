<template>
<div class="exchange-rate-wrapper">
  <template v-if="exchangeRates">
    <p class="exchange-base-currency">Value of 1 {{ inputCurrency }}</p>
    <div v-for="(exchange, index) in exchangeRates" :key="index" class="exchange-rate-row">
      <p>{{ exchange.currency }}</p>
      <p>{{ exchange.value | applySymbol(inputCurrency) }}</p>
    </div>
  </template>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import ErrorHandler from '@/utils/ErrorHandler';
import { widgetApiEndpoints } from '@/utils/defaults';
import { findCurrencySymbol } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      exchangeRates: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    /* The users API key for exchangerate-api.com */
    apiKey() {
      return this.options.apiKey;
    },
    /* The currency to convert results into */
    inputCurrency() {
      return this.options.inputCurrency || 'USD';
    },
    /* An array of currencies to display */
    outputCurrencies() {
      return this.options.outputCurrencies || [];
    },
    endpoint() {
      return `${widgetApiEndpoints.exchangeRates}${this.apiKey}/latest/${this.inputCurrency}`;
    },
  },
  filters: {
    /* Appends currency symbol onto price */
    applySymbol(price, inputCurrency) {
      return `${findCurrencySymbol(inputCurrency)} ${price}`;
    },
  },
  methods: {
    /* Extends mixin, and updates data. Called by parent component */
    update() {
      this.fetchData();
    },
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then(response => {
          this.processData(response.data);
        }).catch(error => {
          ErrorHandler('Unable to fetch or process exchange rate data', error);
        });
    },
    /* Assign data variables to the returned data */
    processData(data) {
      const results = [];
      const rates = data.conversion_rates;
      Object.keys(rates).forEach((currency) => {
        if (this.outputCurrencies.includes(currency)) {
          results.push({ currency, value: rates[currency] });
        }
      });
      this.exchangeRates = results;
    },
  },
};
</script>

<style scoped lang="scss">
.exchange-rate-wrapper {
  max-width: 300px;
  margin: 0 auto;
  p.exchange-base-currency {
    margin: 0.25rem 0;
    color: var(--widget-text-color);
    opacity: var(--dimming-factor);
  }
  .exchange-rate-row {
    display: flex;
    justify-content: space-between;
    margin: 0.25rem auto;
    padding: 0.25rem;
    p {
      margin: 0;
      color: var(--widget-text-color);
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}
</style>
