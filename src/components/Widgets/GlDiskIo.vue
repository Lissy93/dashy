<template>
<div class="glances-disk-io-wrapper" v-if="disks">
  <div class="disk-row" v-for="disk in disks" :key="disk.name">
    <p class="disk-name">{{ disk.name }}</p>
    <!-- Read Data -->
    <div class="io-data read" v-tooltip="disk.readC ? `Count: ${disk.readC}` : ''">
      <span class="lbl">{{ $t('widgets.glances.disk-io-read') }}:</span>
      <span class="val">{{ disk.readB | formatSize }}</span>
      <span :class="`direction ${disk.readD}`">{{ disk.readD | getArrow }}</span>
    </div>
    <!-- Write Data -->
    <div class="io-data write" v-tooltip="disk.writeC ? `Count: ${disk.writeC}` : ''">
      <span class="lbl">{{ $t('widgets.glances.disk-io-write') }}:</span>
      <span class="val">{{ disk.writeB | formatSize }}</span>
      <span :class="`direction ${disk.writeD}`">{{ disk.writeD | getArrow }}</span>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';
import { convertBytes } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, GlancesMixin],
  data() {
    return {
      disks: null,
      previous: null,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('diskio');
    },
  },
  filters: {
    formatSize(byteValue) {
      if (!byteValue) return 'Idle';
      return `${convertBytes(byteValue)}/s`;
    },
    getArrow(direction) {
      if (direction === 'up') return '↑';
      if (direction === 'down') return '↓';
      return '';
    },
  },
  methods: {
    processData(diskData) {
      this.previous = this.disks;
      const disks = [];
      diskData.forEach((disk, index) => {
        disks.push({
          name: disk.disk_name,
          readB: disk.read_bytes,
          readC: disk.read_count,
          readD: this.comparePrevious('read', disk.read_bytes, index),
          writeB: disk.write_bytes,
          writeC: disk.write_count,
          writeD: this.comparePrevious('write', disk.write_bytes, index),
        });
      });
      this.disks = disks;
    },
    /* Compares previous values with current data */
    comparePrevious(direction, newVal, diskIndex) {
      if (!this.previous || !this.previous[diskIndex]) return 'none';
      const disk = this.previous[diskIndex];
      const previousVal = direction === 'read' ? disk.readB : disk.writeB;
      if (newVal === 0) return 'reset';
      if (newVal === previousVal) return 'same';
      if (newVal > previousVal) return 'up';
      if (newVal < previousVal) return 'down';
      return 'none';
    },
  },
  created() {
    this.overrideUpdateInterval = 1;
  },
};
</script>

<style scoped lang="scss">
.glances-disk-io-wrapper {
  color: var(--widget-text-color);
  .disk-row {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0;
    p.disk-name {
      margin: 0;
      font-weight: bold;
      color: var(--widget-text-color);
    }
    .io-data {
      span.lbl {
        margin-right: 0.5rem;
      }
      span.val {
        font-family: var(--font-monospace);
      }
      span.second-val {
        margin: 0 0.5rem;
        opacity: var(--dimming-factor);
      }
      span.direction {
        padding: 0 0.2rem;
        font-weight: bold;
        font-size: 1.2rem;
        &.up { color: var(--success); }
        &.down { color: var(--warning); }
      }
    }
    &:not(:last-child) {
      border-bottom: 1px dashed var(--widget-text-color);
    }
  }
}
</style>
