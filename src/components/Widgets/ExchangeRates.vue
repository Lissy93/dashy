<template>
<div class="exchange-rate-wrapper">
  <template v-if="exchangeRates">
    <p class="exchange-base-currency">Value of 1 {{ newInputCurrency || inputCurrency }}</p>
    <p class="reset" v-if="newInputCurrency" @click="updateInputCurrency(inputCurrency)">
      ⇦ Reset back to {{ inputCurrency }}
    </p>
    <div
      v-for="(exchange, index) in exchangeRates" :key="index"
      v-tooltip="tooltip(makeInverse(exchange))"
      class="exchange-rate-row"
    >
      <p class="country" @click="updateInputCurrency(exchange.currency)">
        <img :src="exchange.currency | flagUrl" alt="Flag" class="flag" />
        {{ exchange.currency }}
      </p>
      <p class="value">
        <span class="input-currency">
          {{ 1 | applySymbol(newInputCurrency || inputCurrency) }} =
        </span>
        {{ exchange.value | applySymbol(exchange.currency) }}
      </p>
    </div>
    <p class="last-updated">Updated on {{ lastUpdated }}</p>
  </template>
</div>
</template>

<script>
import axios from 'axios';
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { findCurrencySymbol, getCurrencyFlag, timestampToDate } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  components: {},
  data() {
    return {
      exchangeRates: null,
      newInputCurrency: null,
      lastUpdated: null,
    };
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
      const currency = this.newInputCurrency || this.inputCurrency;
      return `${widgetApiEndpoints.exchangeRates}${this.apiKey}/latest/${currency}`;
    },
  },
  filters: {
    /* Appends currency symbol onto price */
    applySymbol(price, inputCurrency) {
      return `${findCurrencySymbol(inputCurrency)}${price}`;
    },
    flagUrl(currency) {
      return getCurrencyFlag(currency);
    },
  },
  methods: {
    /* Make GET request to CoinGecko API endpoint */
    fetchData() {
      axios.get(this.endpoint)
        .then(response => {
          this.processData(response.data);
        }).catch(error => {
          this.error('Unable to fetch or process exchange rate data', error);
        })
        .finally(() => {
          this.finishLoading();
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
      this.lastUpdated = timestampToDate(data.time_last_update_unix * 1000);
    },
    updateInputCurrency(newCurrency) {
      this.startLoading();
      if (newCurrency === this.inputCurrency) {
        this.newInputCurrency = null;
      } else {
        this.newInputCurrency = newCurrency;
      }
      this.fetchData();
    },
    makeInverse(exchange) {
      return `1 ${exchange.currency} = ${(1 / exchange.value).toFixed(2)}`
        + ` ${this.newInputCurrency || this.inputCurrency}`;
    },
  },
};
</script>

<style scoped lang="scss">
.exchange-rate-wrapper {
  max-width: 380px;
  margin: 0 auto;
  p.exchange-base-currency {
    margin: 0.25rem 0;
    color: var(--widget-text-color);
    opacity: var(--dimming-factor);
  }
  p.reset {
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
    margin: 0.25rem 0;
    font-size: 0.8rem;
    text-decoration: underline;
    cursor: pointer;
    &:hover { opacity: 1; }
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
    p.country {
      cursor: pointer;
      display: flex;
      align-items: center;
      img.flag {
        border-radius: var(--curve-factor);
        margin-right: 0.5rem;
        max-width: 40px;
      }
    }
    p.value {
      display: flex;
      align-items: center;
      font-family: var(--font-monospace);
      span.input-currency {
        display: none;
        opacity: var(--dimming-factor);
        font-size: 0.8rem;
        margin-right: 0.5rem;
      }
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
    &:hover {
      p.value span.input-currency { display: block; }
    }
  }
  p.last-updated {
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
    font-family: var(--font-monospace);
    margin: 0.2rem 0;
    font-size: 0.6rem;
  }
}
</style>
