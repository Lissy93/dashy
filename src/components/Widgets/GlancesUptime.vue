<template>
  <div class="glances-uptime-wrapper" v-if="uptime">
    <div class="uptime-row">
      <span class="lbl">Uptime</span>
      <span class="val">{{ uptime }}</span>
    </div>
  </div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';

export default {
  name: 'GlancesUptime',
  mixins: [WidgetMixin, GlancesMixin],
  data() {
    return {
      uptime: null,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('uptime');
    },
  },
  methods: {
    processData(resp) {
      if (!resp) {
        this.error('This uptime plugin is not available.');
        return;
      }

      if (typeof resp === 'string') {
        this.uptime = resp;
      } else if (typeof resp === 'object') {
        this.uptime = resp.uptime || resp.uptime_string || JSON.stringify(resp);
      } else {
        this.uptime = String(resp);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.glances-uptime-wrapper {
  .uptime-row {
    display: flex;
    padding: 0.25rem 0.2rem;
    align-items: center;
    justify-content: space-between;
    color: var(--widget-text-color);
    span.lbl {
      font-weight: bold;
    }
    span.val {
      font-family: var(--font-monospace);
    }
  }
}
</style>
