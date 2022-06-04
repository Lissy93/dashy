<template>
<div class="glances-ip-addr-wrapper" v-if="ipAddresses">
  <div class="ip-row public-ip" v-if="ipAddresses.public_address">
    <span class="lbl">Public IP</span>
    <span class="val">{{ ipAddresses.public_address }}</span>
  </div>
  <div class="ip-row" v-if="ipAddresses.address">
    <span class="lbl">Local Address</span>
    <span class="val">{{ ipAddresses.address }}</span>
  </div>
  <div class="ip-row" v-if="ipAddresses.gateway">
    <span class="lbl">Gateway</span>
    <span class="val">{{ ipAddresses.gateway }}</span>
  </div>
  <div class="ip-row" v-if="ipAddresses.mask">
    <span class="lbl">Mask</span>
    <span class="val">{{ ipAddresses.mask }}</span>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';

export default {
  mixins: [WidgetMixin, GlancesMixin],
  data() {
    return {
      ipAddresses: null,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('ip');
    },
  },
  filters: {},
  methods: {
    processData(ipData) {
      this.ipAddresses = ipData;
      if (Object.keys(ipData).length === 0) {
        this.error('The IP plugin is not supported in this instance of Glances');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.glances-ip-addr-wrapper {
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
