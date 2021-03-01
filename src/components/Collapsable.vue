<template>
  <div :class="`collapsable col-${cols}`">
        <input
            :id="`collapsible-${uniqueKey}`"
            class="toggle"
            type="checkbox"
            :checked="getCollapseState()"
            @change="collapseChanged"
            tabIndex="-1"
        >
        <label :for="`collapsible-${uniqueKey}`" class="lbl-toggle" tabindex="-1">
            <h3>{{ title }}</h3>
        </label>
        <div class="collapsible-content">
          <div class="content-inner">
            <slot></slot>
            </div>
        </div>
  </div>
</template>

<script>
export default {
  name: 'CollapsableContainer',
  props: {
    uniqueKey: String,
    title: String,
    collapsed: Boolean,
    cols: Number,
  },
  data() {
    return {
      isOpen: !this.collapsed,
    };
  },
  methods: {
    initialiseStorage() {
      const initStorage = () => localStorage.setItem('collapseState', JSON.stringify({}));
      if (!localStorage.collapseState) initStorage(); // If not yet set, then init localstorage
      try { // Check storage is valid JSON, and has not been corrupted
        JSON.parse(localStorage.collapseState);
      } catch {
        initStorage();
      }
      return JSON.parse(localStorage.collapseState);
    },
    getCollapseState() {
      const collapseStateObject = this.initialiseStorage();
      let collapseState = !this.collapsed;
      if (collapseStateObject[this.uniqueKey] !== undefined) {
        collapseState = collapseStateObject[this.uniqueKey];
      }
      return collapseState;
    },
    setCollapseState(id, newState) {
      // Get the current localstorage collapse state object
      const collapseState = JSON.parse(localStorage.collapseState);
      // Add the new state to it
      collapseState[id] = newState;
      // Stringify, and set the new object into local storage
      localStorage.setItem('collapseState', JSON.stringify(collapseState));
    },
    collapseChanged(whatChanged) {
      this.initialiseStorage();
      this.setCollapseState(this.uniqueKey.toString(), whatChanged.srcElement.checked);
    },
  },
};
</script>

<style scoped lang="scss">

@import '../../src/styles/color-pallet.scss';
@import '../../src/styles/constants.scss';

.collapsable {
    // width: 310px;
    padding: 5px;
    margin: 10px;
    border-radius: $curve-factor;
    background: $ascent;
    // background: -webkit-linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    // background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    box-shadow: 1px 1px 2px #130f23;
    width: auto;
    // &.col-1 { width: 155px; }
    // &.col-2 { width: 310px; }
    // &.col-3 { width: 465px; }
    // &.col-4 { width: 620px; }
    // &.col-5 { width: 775px; }

    .wrap-collabsible {
        margin-bottom: 1.2rem 0;
    }

    input[type='checkbox'] {
        display: none;
    }

    label {
        outline: none;
    }

    .lbl-toggle {
        display: block;
        padding: 0.25rem;
        cursor: pointer;
        border-radius: $curve-factor;
        transition: all 0.25s ease-out;
        text-align: left;
        color:$bg-with-opacity;

        h3 {
            margin: 0;
            padding: 0;
            display: inline;
        }
    }

    .lbl-toggle:hover {
        color: $background;
    }

    .lbl-toggle::before {
        content: ' ';
        display: inline-block;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid currentColor;
        vertical-align: middle;
        margin-right: .7rem;
        transform: translateY(-2px);

        transition: transform .2s ease-out;
    }

    .toggle:checked + .lbl-toggle::before {
        transform: rotate(90deg) translateX(-3px);
    }

    .collapsible-content {
        max-height: 0px;
        overflow: hidden;
        transition: max-height .25s ease-in-out;
        background: $bg-with-opacity;
        border-radius: 0 0 $inner-radius $inner-radius;
    }

    .toggle:checked + .lbl-toggle + .collapsible-content {
        max-height: 1000px;
    }

    .toggle:checked + .lbl-toggle {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }

    .collapsible-content .content-inner {
        padding: 0.5rem;
    }
}
</style>
