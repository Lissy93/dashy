<template>
  <label :for="id + '_button'" :class="{'active': isActive}" class="toggle-switch">
    <span class="toggle__label" v-if="!hideLabels">{{ isActive ? enableText : disabledText }}</span>
    <input type="checkbox" :disabled="disabled" :id="id + '_button'" v-model="checkedValue">
    <span class="switch"></span>
  </label>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    labelEnableText: {
      type: String,
      default: 'On',
    },
    labelDisableText: {
      type: String,
      default: 'Off',
    },
    id: {
      type: String,
      default: 'primary',
    },
    defaultState: {
      type: Boolean,
      default: false,
    },
    hideLabels: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentState: this.defaultState,
    };
  },

  watch: {
    defaultState: function defaultState() {
      this.currentState = Boolean(this.defaultState);
    },
  },

  computed: {
    isActive() {
      return this.currentState;
    },
    enableText() {
      return this.labelEnableText;
    },
    disabledText() {
      return this.labelDisableText;
    },
    checkedValue: {
      get() {
        return this.currentState;
      },
      set(newValue) {
        this.currentState = newValue;
        this.$emit('change', newValue, this.id);
      },
    },
  },
};
</script>

<style scoped lang="scss">

label.toggle-switch {
  --circle-size: 14px;
  --switch-width: 30px;
  --switch-height: 8px;
  --margin-size: 0 0.25rem;
  --on-color: var(--success, #20e253);
  --on-bg: #adedcb;
  --off-color: var(--danger, #f80363);
  --off-bg: #ffb9d4;
  --switch-bg: var(--neutral, #272f4d);

  vertical-align: middle;
  user-select: none;
  cursor: pointer;
  input[type="checkbox"] {
    opacity: 0;
    position: absolute;
    width: 1px;
    height: 1px;
  }
  .switch {
    display:inline-block;
    height: var(--switch-height);
    border-radius:6px;
    width: var(--switch-width);
    background: var(--off-bg);
    box-shadow: inset 0 0 1px var(--off-bg);
    position:relative;
    margin: var(--margin-size);
    transition: all .25s;
    &::after,
    &::before {
      content: "";
      position: absolute;
      display: block;
      height: var(--circle-size);
      width: var(--circle-size);
      border-radius: 50%;
      left: 0;
      top: -3px;
      transform: translateX(0);
      transition: all .25s cubic-bezier(.5, -.6, .5, 1.6);
    }
    &::after {
      background: var(--off-color);
      box-shadow: 0 0 1px #666;
    }
    &::before {
      background: var(--off-color);
      box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
      opacity:0;
    }
  }
  &.active .switch {
    background: var(--on-bg);
    box-shadow: inset 0 0 1px var(--on-bg);
    &::after,
    &::before{
      transform: translateX(calc(var(--switch-width) - var(--circle-size)));
    }
    &::after {
      left: 0;
      background: var(--on-color);
      box-shadow: 0 0 1px var(--on-color);
    }
  }
}
</style>
