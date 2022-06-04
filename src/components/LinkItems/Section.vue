<template>
  <Collapsable
    :title="title"
    :icon="icon"
    :uniqueKey="groupId"
    :collapsed="displayData.collapsed"
    :cols="displayData.cols"
    :rows="displayData.rows"
    :color="displayData.color"
    :customStyles="displayData.customStyles"
    :cutToHeight="displayData.cutToHeight"
    @openEditSection="openEditSection"
    @openContextMenu="openContextMenu"
    :id="sectionRef"
    :ref="sectionRef"
  >
    <!-- If no items, show message -->
    <div v-if="isEmpty" class="no-items">
      {{ $t('home.no-items-section') }}
    </div>
    <!-- Item Container -->
    <div v-if="hasItems"
      :class="`there-are-items ${isGridLayout? 'item-group-grid': ''} inner-size-${itemSize}`"
      :style="gridStyle" :id="`section-${groupId}`"
    > <!-- Show for each item -->
      <template v-for="(item) in sortedItems">
        <SubItemGroup
          v-if="item.subItems"
          :key="item.id"
          :itemId="item.id"
          :title="item.title"
          :subItems="item.subItems"
          @triggerModal="triggerModal"
        />
        <Item
          v-else
          :item="item"
          :key="item.id"
          :itemSize="itemSize"
          :parentSectionTitle="title"
          @itemClicked="$emit('itemClicked')"
          @triggerModal="triggerModal"
          :isAddNew="false"
          :sectionWidth="sectionWidth"
          :sectionDisplayData="displayData"
        />
      </template>
      <!-- When in edit mode, show additional item, for Add New item -->
      <Item v-if="isEditMode"
        :item="{
          icon: ':heavy_plus_sign:',
          title: 'Add New Item',
          description: 'Click to add new item',
          id: 'add-new',
        }"
        :isAddNew="true"
        :parentSectionTitle="title"
        key="add-new"
        class="add-new-item"
        :sectionWidth="sectionWidth"
        :itemSize="itemSize"
      />
    </div>
    <div
      v-if="hasWidgets"
      :class="`widget-list ${isWide? 'wide' : ''}`">
      <WidgetBase
        v-for="(widget, widgetIndx) in widgets"
        :key="widgetIndx"
        :widget="widget"
        :index="index"
        @navigateToSection="navigateToSection"
      />
    </div>
    <!-- Modal for opening in modal view -->
    <IframeModal
      :ref="`iframeModal-${groupId}`"
      :name="`iframeModal-${groupId}`"
      @closed="$emit('itemClicked')"
    />
    <!-- Edit item menu -->
    <EditSection
      v-if="editMenuOpen"
      @closeEditSection="closeEditSection"
      :sectionIndex="index"
      :isAddNew="false"
    />
    <!-- Right-click item options context menu -->
    <ContextMenu
      :show="contextMenuOpen"
      :posX="contextPos.posX"
      :posY="contextPos.posY"
      :id="`context-menu-${groupId}`"
      v-click-outside="closeContextMenu"
      @openEditSection="openEditSection"
      @navigateToSection="navigateToSection"
      @expandCollapseSection="expandCollapseSection"
      @removeSection="removeSection"
    />
  </Collapsable>
</template>

<script>
import router from '@/router';
import Item from '@/components/LinkItems/Item.vue';
import SubItemGroup from '@/components/LinkItems/SubItemGroup.vue';
import WidgetBase from '@/components/Widgets/WidgetBase';
import Collapsable from '@/components/LinkItems/Collapsable.vue';
import IframeModal from '@/components/LinkItems/IframeModal.vue';
import EditSection from '@/components/InteractiveEditor/EditSection.vue';
import ContextMenu from '@/components/LinkItems/SectionContextMenu.vue';
import ErrorHandler from '@/utils/ErrorHandler';
import StoreKeys from '@/utils/StoreMutations';
import {
  sortOrder as defaultSortOrder,
  localStorageKeys,
  modalNames,
} from '@/utils/defaults';

export default {
  name: 'Section',
  props: {
    groupId: String,
    title: String,
    icon: String,
    displayData: Object,
    items: Array,
    widgets: Array,
    index: Number,
    isWide: Boolean,
  },
  components: {
    Collapsable,
    ContextMenu,
    Item,
    SubItemGroup,
    WidgetBase,
    IframeModal,
    EditSection,
  },
  data() {
    return {
      editMenuOpen: false,
      contextMenuOpen: false,
      contextPos: {
        posX: undefined,
        posY: undefined,
      },
      sectionWidth: 0,
      resizeObserver: null,
    };
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
    itemSize() {
      return this.displayData.itemSize || this.$store.getters.iconSize;
    },
    sortOrder() {
      return this.displayData.sortBy || defaultSortOrder;
    },
    hasItems() {
      if (this.isEditMode) return true;
      return this.items && this.items.length > 0;
    },
    hasWidgets() {
      return this.widgets && this.widgets.length > 0;
    },
    isEmpty() {
      return !this.hasItems && !this.hasWidgets;
    },
    sectionRef() {
      return `section-outer-${this.groupId}`;
    },
    /* If the sortBy attribute is specified, then return sorted data */
    sortedItems() {
      const items = [...this.items];
      if (this.appConfig.disableSmartSort) return items;
      if (this.sortOrder === 'alphabetical') {
        return this.sortAlphabetically(items);
      } else if (this.sortOrder === 'reverse-alphabetical') {
        return this.sortAlphabetically(items).reverse();
      } else if (this.sortOrder === 'most-used') {
        return this.sortByMostUsed(items);
      } else if (this.sortOrder === 'last-used') {
        return this.sortByLastUsed(items);
      } else if (this.sortOrder === 'random') {
        return this.sortRandomly(items);
      } else if (this.sortOrder && this.sortOrder !== 'default') {
        ErrorHandler(`Unknown Sort order '${this.sortOrder}' under '${this.title}'`);
      }
      return items;
    },
    isGridLayout() {
      return this.displayData.sectionLayout === 'grid'
        || !!(this.displayData.itemCountX || this.displayData.itemCountY);
    },
    gridStyle() {
      let styles = '';
      if (document.body.clientWidth > 600) { // Only proceed if not on tiny screen
        styles += this.displayData.itemCountX
          ? `grid-template-columns: repeat(${this.displayData.itemCountX}, minmax(0, 1fr));` : '';
        styles += this.displayData.itemCountY
          ? `grid-template-rows: repeat(${this.displayData.itemCountY}, minmax(0, 1fr));` : '';
      }
      return styles;
    },
  },
  methods: {
    /* Opens the iframe modal */
    triggerModal(url) {
      this.$refs[`iframeModal-${this.groupId}`].show(url);
    },
    /* Sorts items alphabetically using the title attribute */
    sortAlphabetically(items) {
      return items.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
    },
    /* Sorts items by most used to least used, based on click-count */
    sortByMostUsed(items) {
      const usageCount = JSON.parse(localStorage.getItem(localStorageKeys.MOST_USED) || '{}');
      const gmu = (item) => usageCount[item.id] || 0;
      items.reverse().sort((a, b) => (gmu(a) < gmu(b) ? 1 : -1));
      return items;
    },
    /* Sorts items by most recently used */
    sortByLastUsed(items) {
      const usageCount = JSON.parse(localStorage.getItem(localStorageKeys.LAST_USED) || '{}');
      const glu = (item) => usageCount[item.id] || 0;
      items.reverse().sort((a, b) => (glu(a) < glu(b) ? 1 : -1));
      return items;
    },
    /* Sorts items randomly */
    sortRandomly(items) {
      return items
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    },
    /* Navigate to the section's single-section view page */
    navigateToSection() {
      if (!this.title) {
        ErrorHandler('Cannot open section without a valid name');
        return;
      }
      const parse = (section) => section.replace(' ', '-').toLowerCase().trim();
      const sectionIdentifier = parse(this.title);
      router.push({ path: `/home/${sectionIdentifier}` });
      this.closeContextMenu();
    },
    /* Toggle sections collapse state */
    expandCollapseSection() {
      const secElem = this.$refs[this.sectionRef];
      if (secElem) secElem.toggle();
      this.closeContextMenu();
    },
    /* Open the Section Edit Menu */
    openEditSection() {
      this.editMenuOpen = true;
      this.$modal.show(modalNames.EDIT_SECTION);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, true);
      this.closeContextMenu();
    },
    /* Close the section edit menu */
    closeEditSection() {
      this.editMenuOpen = false;
      this.$modal.hide(modalNames.EDIT_SECTION);
      this.$store.commit(StoreKeys.SET_MODAL_OPEN, false);
    },
    /* Deletes current section, in local state */
    removeSection() {
      const confirmMsg = this.$t('interactive-editor.edit-section.remove-confirm');
      const youSure = confirm(confirmMsg); // eslint-disable-line no-alert, no-restricted-globals
      if (youSure) {
        const payload = { sectionIndex: this.index, sectionName: this.title };
        this.$store.commit(StoreKeys.REMOVE_SECTION, payload);
      }
      this.closeContextMenu();
    },
    /* Open custom context menu, and set position */
    openContextMenu(e) {
      this.contextMenuOpen = true; // Open context menu
      // If mouse position not set, use section coordinates
      const sectionOuterId = `section-outer-${this.groupId}`;
      const sectionPosition = document.getElementById(sectionOuterId).getBoundingClientRect();
      this.contextPos = {
        posX: (e.clientX || sectionPosition.right - 10) + window.pageXOffset,
        posY: (e.clientY || sectionPosition.top + 30) + window.pageYOffset,
      };
    },
    /* Hide the right-click context menu */
    closeContextMenu() {
      this.contextMenuOpen = false;
    },
    /* Calculate width of section, used to dynamically set number of columns */
    calculateSectionWidth() {
      const secElem = this.$refs[this.sectionRef];
      if (secElem && secElem.$el.clientWidth) this.sectionWidth = secElem.$el.clientWidth;
    },
  },
  mounted() {
    // Set the section width, and recalculate when section resized
    if (this.$refs[this.sectionRef]) {
      this.resizeObserver = new ResizeObserver(this.calculateSectionWidth)
        .observe(this.$refs[this.sectionRef].$el);
    }
  },
  beforeDestroy() {
    // If resize observer set, and element still present, then de-register
    if (this.resizeObserver && this.$refs[this.sectionRef]) {
      this.resizeObserver.unobserve(this.$refs[this.sectionRef].$el);
    }
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

.no-items {
    width: 100px;
    margin: 0 auto;
    padding: 0.8rem;
    text-align: center;
    cursor: default;
    color: var(--primary);
    background: var(--item-background);
    border-radius: var(--curve-factor);
    box-shadow: var(--item-shadow);
}

.there-are-items {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  &.item-group-grid {
    display: grid;
    overflow: auto;
    @extend .scroll-bar;
    @include phone { --item-col-count: 1; }
    @include tablet { --item-col-count: 2; }
    @include laptop { --item-col-count: 2; }
    @include monitor { --item-col-count: 3; }
    @include big-screen { --item-col-count: 4; }
    @include big-screen-up { --item-col-count: 5; }
    grid-template-columns: repeat(var(--item-col-count, 2), minmax(0, 1fr));
  }
}
.orientation-horizontal:not(.single-section-view) {
  display: flex;
  flex-direction: column;
  .there-are-items {
    display: grid;
    @include phone { --item-col-count: 2; }
    @include tablet { --item-col-count: 4; }
    @include laptop { --item-col-count: 6; }
    @include monitor { --item-col-count: 8; }
    @include big-screen { --item-col-count: 10; }
    @include big-screen-up { --item-col-count: 12; }
    grid-template-columns: repeat(var(--item-col-count, 2), minmax(0, 1fr));
  }
  .there-are-items.inner-size-large {
    display: grid;
    @include phone { --item-col-count: 1; }
    @include tablet { --item-col-count: 2; }
    @include laptop { --item-col-count: 3; }
    @include monitor { --item-col-count: 5; }
    @include big-screen { --item-col-count: 6; }
    @include big-screen-up { --item-col-count: 8; }
    grid-template-columns: repeat(var(--item-col-count, 2), minmax(0, 1fr));
  }
}

.add-new-item {
  display: flex;
  a {
    border-style: dashed;
  }
}

.widget-list {
  &.wide {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
    .widget-base  {
      min-width: 10rem;
      width: -webkit-fill-available;
    }
  }
}

</style>
