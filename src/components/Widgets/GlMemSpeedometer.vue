<template>
  <div class="glances-cpu-gauge-wrapper">
    <GaugeChart class="gl-speedometer" :value="gaugeValue"
      :baseColor="baseColor" :shadowColor="shadowColor" :gaugeColor="gaugeColor"
      :startAngle="startAngle" :endAngle="endAngle" :innerRadius="innerRadius"
      :separatorThickness="separatorThickness">
      <p class="percentage">{{ gaugeValue }}%</p>
    </GaugeChart>
    <p class="show-more-btn" @click="toggleMoreInfo">
      {{ showMoreInfo ? $t('widgets.general.show-less') : $t('widgets.general.mem-details') }}
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
import { capitalize, convertBytes } from '@/utils/MiscHelpers';

export default {
  mixins: [WidgetMixin, GlancesMixin],
  components: {
    GaugeChart,
  },
  data() {
    return {
      gaugeValue: 0,
      baseColor: '#101010ED',
      shadowColor: '#00000000',
      gaugeColor: [
        { offset: 0, color: '#20e253' },
        { offset: 35, color: '#f6f000' },
        { offset: 65, color: '#fca016' },
        { offset: 90, color: '#f80363' },
      ],
      showMoreInfo: false,
      moreInfo: null,
      startAngle: -135,
      endAngle: 135,
      innerRadius: 80,
      separatorThickness: 0,
    };
  },
  computed: {
    endpoint() {
      return this.makeGlancesUrl('mem');
    },
  },
  methods: {
    processData(memData) {
      this.gaugeValue = memData.percent;
      const moreInfo = [];
      const ignore = ['percent'];
      Object.keys(memData).forEach((key) => {
        if (!ignore.includes(key) && memData[key]) {
          moreInfo.push({ label: capitalize(key), value: convertBytes(memData[key]) });
        }
      });
      this.moreInfo = moreInfo;
    },
    toggleMoreInfo() {
      this.showMoreInfo = !this.showMoreInfo;
    },
  },
  created() {
    this.overrideUpdateInterval = 2;
  },
};
</script>

<style scoped lang="scss">
.glances-cpu-gauge-wrapper {
  max-width: 15rem;
  margin: 0rem auto;

  p.percentage {
    color: var(--widget-text-color);
    text-align: center;
    position: absolute;
    font-size: 1.3rem;
    margin: 3.5rem 0;
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

      p.label,
      p.value {
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
    margin: -1.1rem auto 0 auto;
    padding: 0.1rem 0.25rem;
    border: 1px solid transparent;
    color: var(--widget-text-color);
    opacity: var(--dimming-factor);
    border-radius: var(--curve-factor);

    &:hover {
      border: 1px solid var(--widget-text-color);
    }

    &:focus,
    &:active {
      background: var(--widget-text-color);
      color: var(--widget-background-color);
    }
  }
}
</style>
<style>
/* global override for the Guage tick lines */
.gl-speedometer svg line {
  stroke: var(--widget-text-color);
  opacity: .3;
}
</style>
