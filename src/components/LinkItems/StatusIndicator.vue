<template>
  <div class="indicator"
    v-tooltip="{
      content: statusText || otherStatusText,
      classes: ['status-tooltip', `tip-${color()}`],
      delay: { show: 0, hide: 150 }
    }">
    <div :class="`dot dot-${color()}`">
      <span><span></span></span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'StatusIndicator',
  props: {
    statusText: String,
    statusSuccess: Boolean,
  },
  methods: {
    /* Returns a color, based on success status */
    color() {
      switch (this.statusSuccess) {
        case undefined: return ((new Date() - this.startTime) > 2000) ? 'grey' : 'yellow';
        case true: return 'green'; // Success!
        default: return 'red'; // Not success, therefore failure
      }
    },
  },
  data() {
    return {
      startTime: new Date(), // Used for timeout
      otherStatusText: 'Checking...', // Used before server has responded
    };
  },
  mounted() {
    setTimeout(() => {
      if (!this.statusText) this.otherStatusText = 'Request timed out';
    }, 2000);
  },
};
</script>

<style scoped lang="scss">

.indicator {
  padding: 5px;
  transition: all .2s ease-in-out;
  cursor: help;
  z-index: 5;
  &:hover {
    transform: scale(1.25);
    filter: saturate(2);
    opacity: 1;
  }
}

@keyframes pulse {
  0% { opacity: .75; transform: scale(1); }
  25% { opacity: 0.75; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.8); }
}
@keyframes applyOpacity {
  50% { opacity: 0.9; }
  to { opacity: 0.8; }
}

.dot {
  border-radius: 50%;
  height: 12px;
  width: 12px;
  animation: applyOpacity 1s ease-in 8s forwards;
  > span, > span span, > span span:after {
    animation: pulse 1s linear 0.5s 2;
    border-radius: 50%;
    display: block;
    height: 12px;
    width: 12px;
    content: '';
  }
  &.dot-green {
    background-color: var(--success);
    span, span:after {
      background-color: var(--success);
      opacity: 0.4;
    }
  }
  &.dot-red {
    background-color: var(--danger);
    span, span:after {
      background-color: var(--danger);
      opacity: 0.4;
    }
  }
  &.dot-yellow {
    background-color: var(--warning);
    span, span:after {
      background-color: var(--warning);
      opacity: 0.4;
    }
  }
  &.dot-grey {
    background-color: var(--medium-grey);
    span, span:after {
      background-color: var(--medium-grey);
      opacity: 0.4;
    }
  }
}

</style>

<style lang="scss">
.status-tooltip {
  background: var(--status-check-tooltip-background) !important;
  color: var(--status-check-tooltip-color);
  font-size: 1rem;
  z-index: 10;
  &.tip-grey { --status-color: var(--medium-grey); }
  &.tip-green { --status-color: var(--success); }
  &.tip-yellow { --status-color: var(--warning); }
  &.tip-red { --status-color: var(--danger); }
  .tooltip-inner {
    border: 1px solid var(--status-color);
    // color: var(--status-color);
  }
  .tooltip-arrow {
    --description-tooltip-color: var(--status-color);
  }
}
</style>
