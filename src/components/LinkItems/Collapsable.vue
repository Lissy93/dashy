<template>
  <div
    v-bind:class="[
    { 'is-open': isExpanded, 'full-height': cutToHeight },
    `collapsable ${rowColSpanClass}`
    ]"
    :style="`${color ? 'background: '+color : ''}; ${sanitizeCustomStyles(customStyles)};`"
  >
    <input
      :id="sectionKey"
      class="toggle"
      type="checkbox"
      v-model="checkboxState"
      tabIndex="-1"
    >
    <label :for="sectionKey" class="lbl-toggle" tabindex="-1"
      @mouseup.right="openContextMenu" @contextmenu.prevent
      @long-press="openContextMenu" v-longPress="500">
      <Icon v-if="icon" :icon="icon" size="small" :url="title" class="section-icon" />
      <h3>{{ title }}</h3>
      <EditModeIcon v-if="isEditMode" @click="openEditModal"
        v-tooltip="editTooltip()" class="edit-mode-item" />
      <OpenIcon @click.prevent.stop="openContextMenu" @contextmenu.prevent
        class="edit-mode-item" />
    </label>
    <div class="collapsible-content">
      <div class="content-inner">
        <slot></slot>
        </div>
    </div>
  </div>
</template>

<script>
import longPress from '@/directives/LongPress';
import { localStorageKeys } from '@/utils/defaults';
import Icon from '@/components/LinkItems/ItemIcon.vue';
import EditModeIcon from '@/assets/interface-icons/interactive-editor-edit-mode.svg';
import OpenIcon from '@/assets/interface-icons/config-open-settings.svg';

export default {
  name: 'CollapsableContainer',
  props: {
    uniqueKey: String, // Generated unique ID
    title: String, // The section title
    icon: String, // An optional section icon
    collapsed: Boolean, // Optional override collapse state
    cols: Number, // Set section horizontal col span / width
    rows: Number, // Set section vertical row span / height
    color: String, // Optional color override
    customStyles: String, // Optional custom stylings
    cutToHeight: Boolean, // To set section height with content height
  },
  components: {
    Icon,
    EditModeIcon,
    OpenIcon,
  },
  directives: {
    longPress,
  },
  computed: {
    isEditMode() {
      return this.$store.state.editMode;
    },
    sectionKey() {
      if (this.isEditMode) return undefined;
      return `collapsible-${this.uniqueKey}`;
    },
    collapseClass() {
      return !this.isExpanded ? ' is-collapsed' : 'is-open';
    },
    rowColSpanClass() {
      const { rows, cols, checkSpanNum } = this;
      return `${checkSpanNum(cols, 'col')} ${checkSpanNum(rows, 'row')}`;
    },
    /* Used to fetch initial collapse state, and set new collapse state on change */
    isExpanded: {
      get() {
        if (this.collapsed !== undefined) return !this.collapsed;
        const collapseStateObject = this.locallyStoredCollapseStates();
        if (collapseStateObject[this.uniqueKey] !== undefined) {
          return collapseStateObject[this.uniqueKey];
        }
        return true;
      },
      set(newState) {
        const collapseState = this.locallyStoredCollapseStates();
        collapseState[this.uniqueKey] = newState;
        localStorage.setItem(localStorageKeys.COLLAPSE_STATE, JSON.stringify(collapseState));
      },
    },
  },
  data: () => ({
    checkboxState: true,
  }),
  mounted() {
    this.checkboxState = this.isExpanded;
  },
  watch: {
    checkboxState(newState) {
      this.isExpanded = newState;
    },
    uniqueKey() {
      this.checkboxState = this.isExpanded;
    },
  },
  methods: {
    /* Either expand or collapse section, based on it's current state */
    toggle() {
      this.checkboxState = !this.checkboxState;
    },
    /* Check that row & column span is valid, and not over the max */
    checkSpanNum(span, classPrefix) {
      const maxSpan = 6;
      let numSpan = /^\d*$/.test(span) ? parseInt(span, 10) : 1;
      numSpan = (numSpan > maxSpan) ? maxSpan : numSpan;
      return `${classPrefix}-${numSpan}`;
    },
    /* Removes all special characters, except those allowed in valid CSS */
    sanitizeCustomStyles(userCss) {
      return userCss ? userCss.replace(/[^a-zA-Z0-9- :;.]/g, '') : '';
    },
    /* Returns local storage collapse state data, and if not yet set then initialized is */
    locallyStoredCollapseStates() {
      // If not yet set, then call initialize
      if (!localStorage[localStorageKeys.COLLAPSE_STATE]) {
        localStorage.setItem(localStorageKeys.COLLAPSE_STATE, JSON.stringify({}));
        return {};
      }
      // Otherwise, return value of local storage
      return JSON.parse(localStorage[localStorageKeys.COLLAPSE_STATE]);
    },
    openEditModal() {
      this.$emit('openEditSection');
    },
    openContextMenu(e) {
      this.$emit('openContextMenu', e);
    },
    editTooltip() {
      const content = this.$t('interactive-editor.edit-section.edit-tooltip');
      return { content, trigger: 'hover focus', delay: { show: 100, hide: 0 } };
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

.collapsable {
  width: 100%;
  width: stretch;
  height: fit-content;
  margin: 10px;
  padding: var(--item-group-padding);
  border-radius: var(--curve-factor);
  box-shadow: var(--item-group-shadow);
  background: var(--item-group-outer-background);

  /* Options allowing sections to SPAN multiple rows or columns */
  grid-row-start: span 1;
  &.row-2 { grid-row-start: span 2; }
  &.row-3 { grid-row-start: span 3; }
  &.row-4 { grid-row-start: span 4; }
  &.row-5 { grid-row-start: span 5; }
  &.row-6 { grid-row-start: span 6; }
  grid-column-start: span 1;
  @include tablet-up {
    &.col-2, &.col-3, &.col-4, &.col-5, &.col-6  { grid-column-start: span 2; }
  }
  @include laptop-up {
    &.col-2 { grid-column-start: span 2; }
    &.col-3, &.col-4, &.col-5,  &.col-6 { grid-column-start: span 3; }
  }
  @include monitor-up {
    &.col-2 { grid-column-start: span 2; }
    &.col-3 { grid-column-start: span 3; }
    &.col-4 { grid-column-start: span 4; }
    &.col-5 { grid-column-start: span 5; }
    &.col-6 { grid-column-start: span 6; }
  }

  input[type='checkbox'] {
    display: none;
  }

  label.lbl-toggle {
    outline: none;
    display: block;
    padding: 0.25rem;
    cursor: pointer;
    border-radius: var(--curve-factor);
    transition: all 0.25s ease-out;
    text-align: left;
    color: var(--item-group-heading-text-color);
    h3 {
      margin: 0;
      padding: 0;
      display: inline;
    }
    .section-icon {
      display: inline;
      margin-right: 0.5rem;
    }
    &:hover {
      color: var(--item-group-heading-text-color-hover);
    }
    &::before {
      content: ' ';
      display: inline-block;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 5px solid currentColor;
      vertical-align: middle;
      margin-right: .7rem;
      transform: translateY(-2px);
      opacity: 0.3;
      transition: all 0.4s ease-in-out;
    }
  }

  input.toggle:checked + .lbl-toggle::before {
    transform: rotate(90deg) translateX(-3px);
  }

  .collapsible-content {
    max-height: 0px;
    overflow: hidden;
    transition: max-height .25s ease-in-out;
    background: var(--item-group-background);
    border-radius: 0 0 var(--curve-factor) var(--curve-factor);
  }

  input.toggle:checked + .lbl-toggle + .collapsible-content {
    max-height: var(--section-max-height);
  }

  input.toggle:checked + .lbl-toggle {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .collapsible-content .content-inner {
    padding: 0.5rem;
  }

  /* Section edit button, shown when in edit mode */
  .edit-mode-item {
    width: 1rem;
    height: 1rem;
    float: right;
    right: 0.5rem;
    top: 0.5rem;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
    opacity: 0.3;
    transition: all 0.4s ease-in-out;
  }

  /* On section hover, set interface icons to full visible */
  &:hover {
    .edit-mode-item, label.lbl-toggle::before {
      opacity: 1;
      transition: all 0.2s ease-out;
    }
  }

  /* Makes sections fill available space */
  @include phone-up {
    &.is-open.full-height {
      height: auto;
      display: flex;
      align-items: normal;
      flex-direction: column;
      .collapsible-content {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
