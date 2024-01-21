<template>
<div class="wallet-balance-wrapper">
  <p class="wallet-title">{{ getCoinNameFromSymbol(coin) }} Wallet</p>
  <a v-if="metaInfo" :href="metaInfo.explorer" class="wallet-address">{{ address }}</a>
  <div class="balance-inner">
    <img v-if="metaInfo" :src="metaInfo.qrCode" alt="QR Code" class="wallet-qr" />
    <div v-if="balances" class="balances-section">
      <p class="main-balance" v-tooltip="makeBalanceTooltip(balances)">{{ balances.current }}</p>
      <div class="balance-info">
        <div class="balance-info-row">
          <span class="label">Total In</span>
          <span class="amount">+ {{ balances.totalReceived }}</span>
        </div>
        <div class="balance-info-row">
          <span class="label">Total Out:</span>
          <span class="amount">- {{ balances.totalSent }}</span>
        </div>
        <div class="balance-info-row">
          <span class="label">Last Activity:</span>
          <span class="amount">{{ balances.lastTransaction }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="transactions" v-if="transactions">
    <p class="transactions-title">Recent Transactions</p>
    <a class="transaction-row"
      v-for="transaction in transactions"
      :key="transaction.hash"
      :href="transaction.url"
      v-tooltip="makeTransactionTooltip(transaction)"
    >
      <span class="date">{{ transaction.date }}</span>
      <span :class="`amount ${transaction.incoming ? 'in' : 'out'}`">
        {{ transaction.incoming ? '+' : '-'}}{{ transaction.amount }}
      </span>
    </a>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import { widgetApiEndpoints } from '@/utils/defaults';
import { timestampToDate, timestampToTime, getTimeAgo } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin],
  computed: {
    coin() {
      if (!this.options.coin) this.error('You must specify a coin, e.g. \'BTC\'');
      return this.options.coin.toLowerCase();
    },
    address() {
      if (!this.options.address) this.error('You must specify a public address');
      return this.options.address;
    },
    network() {
      return this.options.network || 'main';
    },
    limit() {
      return this.options.limit || 10;
    },
    endpoint() {
      return `${widgetApiEndpoints.walletBalance}/`
      + `${this.coin}/${this.network}/addrs/${this.address}`;
    },
    divisionFactor() {
      switch (this.coin) {
        case ('btc'): return 100000000;
        case ('eth'): return 1000000000000000000;
        default: return 1;
      }
    },
  },
  data() {
    return {
      balances: null,
      metaInfo: null,
      transactions: null,
    };
  },
  methods: {
    fetchData() {
      this.makeRequest(this.endpoint).then(this.processData);
    },
    processData(data) {
      const formatAmount = (amount) => {
        const symbol = this.coin.toUpperCase();
        if (!amount) return `0 ${symbol}`;
        return `${(amount / this.divisionFactor).toFixed(6)} ${symbol}`;
      };
      this.balances = {
        current: formatAmount(data.balance),
        unconfirmed: formatAmount(data.unconfirmed_balance),
        final: formatAmount(data.final_balance),
        totalSent: formatAmount(data.total_sent),
        totalReceived: formatAmount(data.total_received),
        lastTransaction: data.txrefs[0] ? getTimeAgo(data.txrefs[0].confirmed) : 'Never',
      };
      const transactions = [];
      data.txrefs.forEach((transaction) => {
        transactions.push({
          hash: transaction.tx_hash,
          amount: formatAmount(transaction.value),
          date: timestampToDate(transaction.confirmed),
          time: timestampToTime(transaction.confirmed),
          confirmations: transaction.confirmations,
          blockHeight: transaction.block_height,
          balance: formatAmount(transaction.ref_balance),
          incoming: transaction.tx_input_n === -1,
          url: `https://live.blockcypher.com/${this.coin}/tx/${transaction.tx_hash}/`,
        });
      });
      this.transactions = transactions.slice(0, this.limit);
    },
    getCoinNameFromSymbol(symbol) {
      const coins = {
        btc: 'Bitcoin',
        dash: 'Dash',
        doge: 'Doge',
        ltc: 'Litecoin',
        eth: 'Ethereum',
        bhc: 'BitcoinCash',
        xmr: 'Monero',
        ada: 'Cardano',
        bcy: 'BlockCypher',
      };
      if (!symbol || !Object.keys(coins).includes(symbol.toLowerCase())) return '';
      return coins[symbol.toLowerCase()];
    },
    makeBalanceTooltip(balances) {
      return this.tooltip(
        `<b>Unconfirmed:</b> ${balances.unconfirmed}<br><b>Final:</b> ${balances.final}`,
        true,
      );
    },
    makeTransactionTooltip(transaction) {
      return this.tooltip(
        `At ${transaction.time}<br>`
        + `<b>BlockHeight:</b> ${transaction.blockHeight}<br>`
        + `<b>Confirmations:</b> ${transaction.confirmations}<br>`
        + `<b>Balance After:</b> ${transaction.balance}`,
        true,
      );
    },
    makeMetaInfo() {
      const explorer = `https://live.blockcypher.com/${this.coin}/address/${this.address}/`;
      const coin = this.getCoinNameFromSymbol(this.coin).toLowerCase();
      const qrCode = `${widgetApiEndpoints.walletQrCode}/`
      + `?style=${coin.toLowerCase()}&color=11&address=${this.address}`;
      return { explorer, coin, qrCode };
    },
  },
  mounted() {
    this.metaInfo = this.makeMetaInfo();
  },
};
</script>

<style scoped lang="scss">
.wallet-balance-wrapper {
  max-width: 30rem;
  margin: 0 auto;
  a.wallet-address {
    display: block;
    margin: 0.5rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: var(--dimming-factor);
    color: var(--widget-text-color);
    font-family: var(--font-monospace);
  }
  .balance-inner {
    display: flex;
    justify-content: space-around;
    img.wallet-qr {
      max-width: 7rem;
      margin: 0.5rem 0;
      border-radius: var(--curve-factor);
    }
    .balances-section {
      p {
        color: var(--widget-text-color);
        font-family: var(--font-monospace);
        cursor: default;
        margin: 0.5rem;
      }
      p.main-balance {
        font-size: 1.5rem;
      }
      .balance-info .balance-info-row {
        opacity: var(--dimming-factor);
        color: var(--widget-text-color);
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        margin: 0.2rem 0.5rem;
        span.amount {
          font-family: var(--font-monospace);
        }
      }
    }
  }
  p.wallet-title, p.transactions-title {
    color: var(--widget-text-color);
    margin: 0.5rem 0 0.25rem;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .transactions .transaction-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    text-decoration: none;
    span {
      color: var(--widget-text-color);
      font-family: var(--font-monospace);
    }
    span.amount {
      &.in { color: var(--success); }
      &.out { color: var(--danger); }
    }
    &:not(:last-child) { border-bottom: 1px dashed var(--widget-text-color); }
  }
}
</style>
