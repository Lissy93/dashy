<template>
  <div class="gauge">
    <svg
      v-if="height"
      :viewBox="`0 0 ${RADIUS * 2} ${height}`" height="100%" width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- Inner shadow for empty part of the gauge -->
        <filter :id="`innershadow-${_uid}`">
          <feFlood :flood-color="shadowColor" />
          <feComposite in2="SourceAlpha" operator="out" />
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite operator="atop" in2="SourceGraphic" />
        </filter>

        <!-- Gradient color for the full part of the gauge -->
        <linearGradient
          v-if="hasGradient"
          :id="`gaugeGradient-${_uid}`"
        >
          <stop
            v-for="(color, index) in gaugeColor"
            :key="`${color.color}-${index}`"
            :offset="`${color.offset}%`" :stop-color="color.color"
          />
        </linearGradient>

        <mask :id="`innerCircle-${_uid}`">
          <!-- Mask to make sure only the part inside the circle is visible -->
          <!-- RADIUS - 0.5 to avoid any weird display -->
          <circle :r="RADIUS - 0.5" :cx="X_CENTER" :cy="Y_CENTER" fill="white" />

          <!-- Mask to remove the inside of the gauge -->
          <circle :r="innerRadius" :cx="X_CENTER" :cy="Y_CENTER" fill="black" />

          <template v-if="separatorPaths">
            <!-- Mask for each separator -->
            <path
              v-for="(separator, index) in separatorPaths"
              :key="index"
              :d="separator" fill="black"
            />
          </template>
        </mask>
      </defs>

      <g :mask="`url(#innerCircle-${_uid})`">
        <!-- Draw a circle if the full gauge has a 360° angle, otherwise draw a path -->
        <circle
          v-if="isCircle"
          :r="RADIUS" :cx="X_CENTER" :cy="Y_CENTER"
          :fill="hasGradient ? `url(#gaugeGradient-${_uid})` : gaugeColor"
        />
        <path
          v-else
          :d="basePath" :fill="hasGradient ? `url(#gaugeGradient-${_uid})` : gaugeColor"
        />

        <!-- Draw a circle if the empty gauge has a 360° angle, otherwise draw a path -->
        <circle
          v-if="value === min && isCircle"
          :r="RADIUS" :cx="X_CENTER" :cy="Y_CENTER"
          :fill="baseColor"
        />
        <path v-else :d="gaugePath" :fill="baseColor" :filter="`url(#innershadow-${_uid})`" />
      </g>

      <template v-if="scaleLines">
        <!-- Display a line for each tick of the scale -->
        <line
          v-for="(line, index) in scaleLines"
          :key="`${line.xE}-${index}`"
          :x1="line.xS" :y1="line.yS" :x2="line.xE" :y2="line.yE"
          stroke-width="1" :stroke="baseColor"
        />
      </template>

      <!-- Option for displaying content inside the gauge -->
      <foreignObject x="0" y="0" width="100%" :height="height">
        <slot />
      </foreignObject>
    </svg>
  </div>
</template>

<script>
/** A gauge chart component for showing percentages
 * Heavily inspired by vue-svg-gauge by @hellocomet
 * See: https://github.com/hellocomet/vue-svg-gauge
 */
import ErrorHandler from '@/utils/ErrorHandler';

// Main radius of the gauge
const RADIUS = 100;

// Coordinates of the center based on the radius
const X_CENTER = 100;
const Y_CENTER = 100;

/* Turn polar coordinate to cartesians */
function polarToCartesian(radius, angle) {
  const angleInRadians = (angle - 90) * (Math.PI / 180);
  return {
    x: X_CENTER + (radius * Math.cos(angleInRadians)),
    y: Y_CENTER + (radius * Math.sin(angleInRadians)),
  };
}

/* Describe a gauge path according */
function describePath(radius, startAngle, endAngle) {
  const start = polarToCartesian(radius, endAngle);
  const end = polarToCartesian(radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', X_CENTER, Y_CENTER,
  ].join(' ');

  return d;
}

export default {
  name: 'Gauge',
  props: {
    value: {
      type: Number,
      default: 70,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    startAngle: {
      type: Number,
      default: -90,
      validator: (value) => {
        if (value < -360 || value > 360) {
          ErrorHandler('Gauge Chart - Expected prop "startAngle" to be between -360 and 360');
        }
        return true;
      },
    },
    endAngle: {
      type: Number,
      default: 90,
      validator: (value) => {
        if (value < -360 || value > 360) {
          ErrorHandler('Gauge Chart - Expected prop "endAngle" to be between -360 and 360');
        }
        return true;
      },
    },
    /* Size of the inner radius between 0 and RADIUS. Closer to RADIUS, is thinner gauge */
    innerRadius: {
      type: Number,
      default: 60,
      validator: (value) => {
        if (value < 0 || value > 100) {
          ErrorHandler(`Gauge Chart - Expected prop "innerRadius" to be between 0 and ${RADIUS}`);
        }
        return true;
      },
    },
    /* Separator step, will display a each min + (n * separatorStep), won't show if null */
    separatorStep: {
      type: Number,
      default: 20,
      validator: (value) => {
        if (value !== null && value < 0) {
          ErrorHandler('Gauge Chart - Expected prop "separatorStep" to be null or >= 0');
        }
        return true;
      },
    },
    /* Separator Thickness, unit is in degree */
    separatorThickness: {
      type: Number,
      default: 4,
    },
    /* Gauge color. Can be either string or array of objects (for gradient) */
    gaugeColor: {
      type: [Array, String],
      default: () => ([
        { offset: 0, color: '#20e253' },
        { offset: 30, color: '#f6f000' },
        { offset: 60, color: '#fca016' },
        { offset: 80, color: '#f80363' },
      ]),
    },
    /* Color of the base of the gauge */
    baseColor: {
      type: String,
      default: '#DDDDDD',
    },
    /* The inset shadow color */
    shadowColor: {
      type: String,
      default: '#8787871a',
    },
    /* Scale interval, won't display any scall if 0 or `null` */
    scaleInterval: {
      type: Number,
      default: 5,
      validator: (value) => {
        if (value !== null && value < 0) {
          ErrorHandler('Gauge Chart - Expected prop "scaleInterval" to be null or >= 0');
        }
        return true;
      },
    },
    /* Transition duration in ms */
    transitionDuration: {
      type: Number,
      default: 1500,
    },
  },
  data() {
    return {
      X_CENTER,
      Y_CENTER,
      RADIUS,
      tweenedValue: this.min,
    };
  },
  computed: {
    /* Height of the viewbox */
    height() {
      const { endAngle, startAngle } = this;
      const { y: yStart } = polarToCartesian(RADIUS, startAngle);
      const { y: yEnd } = polarToCartesian(RADIUS, endAngle);

      return Math.abs(endAngle) <= 180 && Math.abs(startAngle) <= 180
        ? Math.max(Y_CENTER, yStart, yEnd)
        : RADIUS * 2;
    },
    /* SVG d property of the path of the base gauge (the colored one) */
    basePath() {
      const { startAngle, endAngle } = this;

      return describePath(RADIUS, startAngle, endAngle);
    },
    /* SVG d property of the gauge based on current value, to hide inverse */
    gaugePath() {
      const { endAngle, getAngle, tweenedValue } = this;

      return describePath(RADIUS, getAngle(tweenedValue), endAngle);
    },
    /* Total angle of the gauge */
    totalAngle() {
      const { startAngle, endAngle } = this;

      return Math.abs(endAngle - startAngle);
    },
    /* True if the gauge is a full circle */
    isCircle() {
      return Math.abs(this.totalAngle) === 360;
    },
    /* If gauge color is array, return true so gradient can be used */
    hasGradient() {
      return Array.isArray(this.gaugeColor);
    },
    /* Array of the path of each separator */
    separatorPaths() {
      const {
        separatorStep, getAngle, min, max, separatorThickness, isCircle,
      } = this;
      if (separatorStep > 0) {
        const paths = [];
        let i = isCircle ? min : min + separatorStep;
        for (i; i < max; i += separatorStep) {
          const angle = getAngle(i);
          const halfAngle = separatorThickness / 2;
          paths.push(describePath(RADIUS + 2, angle - halfAngle, angle + halfAngle));
        }

        return paths;
      }

      return null;
    },
    /* Array of line configuration for each scale */
    scaleLines() {
      const {
        scaleInterval, isCircle, min, max, getAngle, innerRadius,
      } = this;

      if (scaleInterval > 0) {
        const lines = [];
        let i = isCircle ? min + scaleInterval : min;

        for (i; i < max + scaleInterval; i += scaleInterval) {
          const angle = getAngle(i);
          const startCoordinate = polarToCartesian(innerRadius - 4, angle);
          const endCoordinate = polarToCartesian(innerRadius - 8, angle);
          lines.push({
            xS: startCoordinate.x,
            yS: startCoordinate.y,
            xE: endCoordinate.x,
            yE: endCoordinate.y,
          });
        }
        return lines;
      }
      return null;
    },
    /* Generate a logarithmic scale for smooth animations */
    logScale() {
      const logScale = [];
      for (let i = this.max; i > 1; i -= 1) logScale.push(Math.round(Math.log(i)));
      return logScale;
    },
  },
  watch: {
    /* Update chats value with animation */
    value(newValue) {
      this.animateTo(newValue);
    },
  },
  methods: {
    /* Get an angle for a value */
    getAngle(value) {
      const {
        min, max, startAngle, totalAngle,
      } = this;
      const totalValue = (max - min) || 1;
      return ((value * totalAngle) / totalValue) + startAngle;
    },
    /* Increment the charts current value with logarithmic delays, until it equals new value */
    animateTo(newValue) {
      let currentValue = this.tweenedValue;
      let indexCounter = 0; // Keeps track of number of moves
      const forward = currentValue < newValue; // Direction
      const moveOnePoint = () => {
        currentValue = forward ? currentValue + 1 : currentValue - 1;
        indexCounter += 1;
        setTimeout(() => {
          if ((forward && currentValue <= newValue) || (!forward && currentValue >= newValue)) {
            this.tweenedValue = currentValue;
            moveOnePoint();
          }
        }, this.logScale[indexCounter]);
      };
      moveOnePoint();
    },
  },
  mounted() {
    // Set initial value
    this.animateTo(this.value);
  },
};
</script>

<style lang="css">
  .gauge {
    width: 100%;
    height: 100%;
  }
</style>
