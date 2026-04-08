<template>
<div class="glances-uptime-wrapper" v-if="uptimeStr">
  <div class="uptime-row">
    <span class="lbl">{{ $t('widgets.system-info.uptime') }}</span>
    <span class="val">{{ uptimeStr }}</span>
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
      uptimeStr: null,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('uptime');
    },
  },
  methods: {
    processData(resp) {
      if (typeof resp === 'string') {
        this.uptimeStr = resp;
      } else if (typeof resp === 'number') {
        this.uptimeStr = this.formatSeconds(resp);
      } else {
        this.error('Unexpected uptime response format');
      }
    },
    formatSeconds(seconds) {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      const pad = (n) => String(n).padStart(2, '0');
      return days > 0
        ? `${days} days, ${pad(hours)}:${pad(minutes)}:${pad(secs)}`
        : `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    },
  },
};
</script>

<style scoped lang="scss">
.glances-uptime-wrapper {
  .uptime-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--widget-text-color);
    .lbl {
      font-weight: bold;
    }
    .val {
      font-family: var(--font-monospace);
    }
  }
}
</style>
