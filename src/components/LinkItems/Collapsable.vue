<template>
  <div
    :class="`collapsable ${rowColSpanClass} ${collapseClass} ${!cutToHeight ? 'full-height' : ''}`"
    :style="`${color ? 'background: '+color : ''}; ${sanitizeCustomStyles(customStyles)};`"
  >
    <input
      :id="sectionKey"
      class="toggle"
      type="checkbox"
      :checked="isExpanded"
      @change="collapseChanged"
      tabIndex="-1"
    >
    <label :for="sectionKey" class="lbl-toggle" tabindex="-1"
      @mouseup.right="openContextMenu" @contextmenu.prevent>
      <Icon v-if="icon" :icon="icon" size="small" :url="title" class="section-icon" />
      <h3>{{ title }}</h3>
      <EditModeIcon v-if="isEditMode" @click="openEditModal"
        v-tooltip="editTooltip()" class="edit-mode-item" />
    </label>
    <div class="collapsible-content">
      <div class="content-inner">
        <slot></slot>
        </div>
    </div>
  </div>
</template>

<script>

import { localStorageKeys } from '@/utils/defaults';
import Icon from '@/components/LinkItems/ItemIcon.vue';
import EditModeIcon from '@/assets/interface-icons/interactive-editor-edit-mode.svg';

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
  },
  data: () => ({
    isExpanded: false,
  }),
  mounted() {
    this.isExpanded = this.getCollapseState();
  },
  methods: {
    /* Check that row & column span is valid, and not over the max */
    checkSpanNum(span, classPrefix) {
      const maxSpan = 5;
      let numSpan = /^\d*$/.test(span) ? parseInt(span, 10) : 1;
      numSpan = (numSpan > maxSpan) ? maxSpan : numSpan;
      return `${classPrefix}-${numSpan}`;
    },
    /* Removes all special characters, except those allowed in valid CSS */
    sanitizeCustomStyles(userCss) {
      return userCss ? userCss.replace(/[^a-zA-Z0-9- :;.]/g, '') : '';
    },
    /* Returns local storage collapse state data, and if not yet set then initialized is */
    initialiseStorage() {
      const storageKey = localStorageKeys.COLLAPSE_STATE;
      /* Initialize function will create and set a blank object to storage */
      const initStorage = () => localStorage.setItem(storageKey, JSON.stringify({}));
      // If not yet set, then call initialize
      if (!localStorage[storageKey]) {
        initStorage();
        return {};
      }
      // Otherwise, return value of local storage
      return JSON.parse(localStorage[storageKey]);
    },
    /* If specified by user, return conf collapse state, otherwise check local storage */
    getCollapseState() {
      if (this.collapsed !== undefined) return !this.collapsed; // Check users config
      const collapseStateObject = this.initialiseStorage(); // Check local storage
      if (collapseStateObject[this.uniqueKey] !== undefined) {
        return collapseStateObject[this.uniqueKey];
      }
      // Nothing specified, return Open
      return true;
    },
    /* When section collapsed, update local storage, to remember for next time */
    setCollapseState(id, newState) {
      // Get the current localstorage collapse state object
      const collapseState = JSON.parse(localStorage[localStorageKeys.COLLAPSE_STATE]);
      // Add the new state to it
      collapseState[id] = newState;
      // Stringify, and set the new object into local storage
      localStorage.setItem(localStorageKeys.COLLAPSE_STATE, JSON.stringify(collapseState));
    },
    /* Called when collapse state changes, trigger local storage update if needed */
    collapseChanged(whatChanged) {
      this.isExpanded = whatChanged.srcElement.checked;
      if (this.collapseState === undefined) { // Only run, if user hasn't manually set prop
        this.initialiseStorage();
        this.setCollapseState(this.uniqueKey.toString(), this.isExpanded);
      }
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
  padding: var(--item-group-padding);
  margin: 10px;
  border-radius: var(--curve-factor);
  background: var(--item-group-outer-background);
  box-shadow: var(--item-group-shadow);
  height: fit-content;
  width: 100%;
  width: stretch;

  grid-row-start: span 1;
  &.row-2 { grid-row-start: span 2; }
  &.row-3 { grid-row-start: span 3; }
  &.row-4 { grid-row-start: span 4; }
  &.row-5 { grid-row-start: span 5; }

  grid-column-start: span 1;
  @include tablet-up {
    &.col-2 { grid-column-start: span 2; }
    &.col-3 { grid-column-start: span 2; }
    &.col-4 { grid-column-start: span 2; }
    &.col-5 { grid-column-start: span 2; }
  }
  @include laptop-up {
    &.col-2 { grid-column-start: span 2; }
    &.col-3 { grid-column-start: span 3; }
    &.col-4 { grid-column-start: span 3; }
    &.col-5 { grid-column-start: span 3; }
  }
  @include monitor-up {
    &.col-2 { grid-column-start: span 2; }
    &.col-3 { grid-column-start: span 3; }
    &.col-4 { grid-column-start: span 4; }
    &.col-5 { grid-column-start: span 5; }
  }

  .wrap-collabsible {
    margin-bottom: 1.2rem 0;
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
  }

  .lbl-toggle:hover {
    color: var(--item-group-heading-text-color-hover);
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
    background: var(--item-group-background);
    border-radius: 0 0 var(--curve-factor) var(--curve-factor);
  }

  .toggle:checked + .lbl-toggle + .collapsible-content {
    max-height: 3000px;
  }

  .toggle:checked + .lbl-toggle {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .collapsible-content .content-inner {
    padding: 0.5rem;
  }

  .edit-mode-item {
    width: 1rem;
    height: 1rem;
    float: right;
    right: 0.5rem;
    top: 0.5rem;
  }
  // Makes sections fill available space
  &.is-open.full-height {
    height: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    align-items: normal;
    .collapsible-content {
      height: -webkit-fill-available;
      width: 100%;
    }
  }
}
</style>
