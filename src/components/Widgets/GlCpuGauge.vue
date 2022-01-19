<template>
<div class="glances-cpu-gauge-wrapper">
  <GaugeChart :value="gaugeValue" :baseColor="background" :gaugeColor="gaugeColor">
    <p class="percentage">{{ gaugeValue }}%</p>
  </GaugeChart>
  <p class="show-more-btn" @click="toggleMoreInfo">
    {{ showMoreInfo ? $t('widgets.general.show-less') : $t('widgets.general.show-more') }}
  </p>
  <div class="more-info" v-if="moreInfo && showMoreInfo">
    <div class="more-info-row" v-for="(info, key) in moreInfo" :key="key">
      <p class="label">{{ info.label }}</p>
      <p class="value">{{ info.value }}</p>
    </div>
  </div>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';
import GlancesMixin from '@/mixins/GlancesMixin';
import GaugeChart from '@/components/Charts/Gauge';
import { getValueFromCss, capitalize } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, GlancesMixin],
  components: {
    GaugeChart,
  },
  data() {
    return {
      gaugeValue: 0,
      gaugeColor: '#272f4d',
      showMoreInfo: false,
      moreInfo: null,
      background: '#fff',
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('cpu');
    },
  },
  methods: {
    processData(cpuData) {
      this.gaugeValue = cpuData.total;
      this.gaugeColor = this.getColor(cpuData.total);
      const moreInfo = [];
      const ignore = ['total', 'cpucore', 'time_since_update',
        'interrupts', 'soft_interrupts', 'ctx_switches', 'syscalls'];
      Object.keys(cpuData).forEach((key) => {
        if (!ignore.includes(key) && cpuData[key]) {
          moreInfo.push({ label: capitalize(key), value: `${cpuData[key].toFixed(1)}%` });
        }
      });
      this.moreInfo = moreInfo;
    },
    toggleMoreInfo() {
      this.showMoreInfo = !this.showMoreInfo;
    },
    getColor(cpuPercent) {
      if (cpuPercent < 50) return '#20e253';
      if (cpuPercent < 60) return '#f6f000';
      if (cpuPercent < 80) return '#fca016';
      if (cpuPercent < 100) return '#f80363';
      return '#272f4d';
    },
  },
  created() {
    this.overrideUpdateInterval = 2;
  },
  mounted() {
    this.background = getValueFromCss('widget-accent-color');
  },
};
</script>

<style scoped lang="scss">
.glances-cpu-gauge-wrapper {
    max-width: 18rem;
    margin: 0.5rem auto;
  p.percentage {
    color: var(--widget-text-color);
    text-align: center;
    position: absolute;
    font-size: 1.3rem;
    margin: 0.5rem 0;
    width: 100%;
    bottom: 0;
  }
  .more-info {
    background: var(--widget-accent-color);
    border-radius: var(--curve-factor);
    padding: 0.25rem 0.5rem;
    margin: 0.5rem auto;
    .more-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p.label, p.value {
        color: var(--widget-text-color);
        margin: 0.25rem 0;
      }
      p.value {
        font-family: var(--font-monospace);
      }
      &:not(:last-child) {
        border-bottom: 1px dashed var(--widget-text-color);
      }
    }
  }
  p.show-more-btn {
    cursor: pointer;
    font-size: 0.9rem;
    text-align: center;
    width: fit-content;
    margin: 0.25rem auto;
    padding: 0.1rem 0.25rem;
    border: 1px solid transparent;
    color: var(--widget-text-color);
    opacity: var(--dimming-factor);
    border-radius: var(--curve-factor);
    &:hover {
      border: 1px solid var(--widget-text-color);
    }
    &:focus, &:active {
      background: var(--widget-text-color);
      color: var(--widget-background-color);
    }
  }
}
</style>
