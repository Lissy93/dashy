<template>
  <div
    v-bind:class="[
    { 'is-open': isExpanded, 'full-height': cutToHeight },
    `collapsable ${rowColSpanClass}`, sectionClassName
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
    <div class="section-header"
      @mouseup.right="openContextMenu" @contextmenu.prevent
      @long-press="openContextMenu" v-longPress="500">
      <label :for="sectionKey" class="collapse-toggle"
        v-tooltip="toggleTooltip()" :aria-label="$t('context-menus.section.expand-collapse')">
        <span class="arrow" aria-hidden="true"></span>
      </label>
      <Icon v-if="icon" :icon="icon" size="small" :url="title" class="section-icon" />
      <h3>{{ title }}</h3>
      <EditModeIcon v-if="isEditMode" @click="openEditModal"
        v-tooltip="editTooltip()" class="header-action" />
      <OpenIcon @click.prevent.stop="openContextMenu" @contextmenu.prevent
        v-tooltip="optionsTooltip()" class="header-action" />
    </div>
    <div class="collapsible-content">
      <div class="content-inner">
        <slot></slot>
        </div>
    </div>
  </div>
</template>

<script>
import longPress from '@/directives/LongPress';
import { localStorageKeys } from '@/utils/config/defaults';
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
      return `collapsible-${this.uniqueKey}`;
    },
    collapseClass() {
      return !this.isExpanded ? ' is-collapsed' : 'is-open';
    },
    rowColSpanClass() {
      const { rows, cols, checkSpanNum } = this;
      return `${checkSpanNum(cols, 'col')} ${checkSpanNum(rows, 'row')}`;
    },
    sectionClassName() {
      if (!this.title) return 'unnamed-section';
      return `section_${this.title.replaceAll(' ', '-').toLowerCase()}`;
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
      this.updateLocalStorage(); // Save every change immediately
    },
    uniqueKey(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.refreshCollapseState(); // Refresh state when key changes
      }
    },
  },
  methods: {
    refreshCollapseState() {
      this.checkboxState = this.isExpanded;
    },
    updateLocalStorage() {
      const collapseState = this.locallyStoredCollapseStates();
      collapseState[this.uniqueKey] = this.checkboxState;
      localStorage.setItem(localStorageKeys.COLLAPSE_STATE, JSON.stringify(collapseState));
    },
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
      if (!localStorage[localStorageKeys.COLLAPSE_STATE]) {
        localStorage.setItem(localStorageKeys.COLLAPSE_STATE, JSON.stringify({}));
        return {};
      }
      try {
        return JSON.parse(localStorage[localStorageKeys.COLLAPSE_STATE]);
      } catch (e) {
        return {};
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
      return { content, delay: { show: 100, hide: 0 } };
    },
    toggleTooltip() {
      return { content: this.$t('context-menus.section.expand-collapse'), delay: { show: 200, hide: 0 } };
    },
    optionsTooltip() {
      return { content: this.$t('context-menus.section.section-options'), delay: { show: 200, hide: 0 } };
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
    &.col-3 { grid-column-start: span 3; }
    &.col-4 { grid-column-start: span 4; }
    &.col-5 { grid-column-start: span 5; }
    &.col-6 { grid-column-start: span 6; }
  }

  input[type='checkbox'] {
    display: none;
  }

  .section-header {
    display: flex;
    align-items: center;
    padding: 0.25rem;
    color: var(--item-group-heading-text-color);
    border-radius: var(--curve-factor);
    h3 { flex: 1; margin: 0; padding: 0; }
    .section-icon { margin-right: 0.5rem; }
  }

  .collapse-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    cursor: pointer;
    border-radius: var(--curve-factor);
    transition: background 0.2s ease-out, opacity 0.2s ease-out;
    .arrow {
      width: 0;
      height: 0;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
      border-left: 6px solid currentColor;
      opacity: 0.5;
      transition: transform 0.3s ease-in-out;
    }
    &:hover, &:focus-visible {
      outline: none;
      background: var(--primary-transparent-60);
      .arrow { opacity: 1; }
    }
  }
  input.toggle:checked + .section-header .collapse-toggle .arrow {
    transform: rotate(90deg);
  }

  .collapsible-content {
    max-height: 0px;
    overflow: hidden;
    transition: max-height .25s ease-in-out;
    background: var(--item-group-background);
    border-radius: 0 0 var(--curve-factor) var(--curve-factor);
  }

  input.toggle:checked + .section-header + .collapsible-content {
    max-height: var(--section-max-height);
  }

  input.toggle:checked + .section-header {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .collapsible-content .content-inner {
    padding: 0.5rem;
  }

  /* Section edit buttons, pushed to the right by the flex-1 h3.
   * Shares hover styling with .collapse-toggle. */
  .header-action {
    box-sizing: content-box;
    width: 1rem;
    height: 1rem;
    padding: 0.3rem;
    margin-left: 0.25rem;
    cursor: pointer;
    opacity: 0.3;
    border-radius: var(--curve-factor);
    transition: background 0.2s ease-out, opacity 0.2s ease-out;
    &:hover, &:focus-visible {
      outline: none;
      background: var(--primary-transparent-60);
      opacity: 1;
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
