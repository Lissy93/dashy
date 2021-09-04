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
  >
    <div v-if="!items || items.length < 1" class="no-items">
      No Items to Show Yet
    </div>
    <div v-else
      :class="`there-are-items ${isGridLayout? 'item-group-grid': ''}`"
      :style="gridStyle"
    >
      <Item
        v-for="(item) in sortedItems"
        :id="makeId(item.title)"
        :key="makeId(item.title)"
        :url="item.url"
        :title="item.title"
        :description="item.description"
        :icon="item.icon"
        :target="item.target"
        :color="item.color"
        :backgroundColor="item.backgroundColor"
        :statusCheckUrl="item.statusCheckUrl"
        :statusCheckHeaders="item.statusCheckHeaders"
        :itemSize="newItemSize"
        :hotkey="item.hotkey"
        :enableStatusCheck="shouldEnableStatusCheck(item.statusCheck)"
        :statusCheckInterval="getStatusCheckInterval()"
        :statusCheckAllowInsecure="item.statusCheckAllowInsecure"
        @itemClicked="$emit('itemClicked')"
        @triggerModal="triggerModal"
      />
      <div ref="modalContainer"></div>
    </div>
    <IframeModal
      :ref="`iframeModal-${groupId}`"
      :name="`iframeModal-${groupId}`"
      @closed="$emit('itemClicked')"
      @modalChanged="modalChanged"
    />
  </Collapsable>
</template>

<script>
import { sortOrder as defaultSortOrder, localStorageKeys } from '@/utils/defaults';
import Item from '@/components/LinkItems/Item.vue';
import Collapsable from '@/components/LinkItems/Collapsable.vue';
import IframeModal from '@/components/LinkItems/IframeModal.vue';

export default {
  name: 'Section',
  inject: ['config'],
  props: {
    groupId: String,
    title: String,
    icon: String,
    displayData: Object,
    items: Array,
    itemSize: String,
    modalOpen: Boolean,
  },
  components: {
    Collapsable,
    Item,
    IframeModal,
  },
  computed: {
    sortOrder() {
      return this.displayData.sortBy || defaultSortOrder;
    },
    sortedItems() {
      let { items } = this;
      if (this.sortOrder === 'alphabetical') {
        items.sort((a, b) => (a.title > b.title ? 1 : -1));
      } else if (this.sortOrder === 'reverse-alphabetical') {
        items.sort((a, b) => (a.title < b.title ? 1 : -1));
      } else if (this.sortOrder === 'most-used') {
        items = this.sortByMostUsed(items);
      }
      return items;
    },
    newItemSize() {
      return this.displayData.itemSize || this.itemSize;
    },
    isGridLayout() {
      return this.displayData.sectionLayout === 'grid'
        || !!(this.displayData.itemCountX || this.displayData.itemCountY);
    },
    gridStyle() {
      let styles = '';
      styles += this.displayData.itemCountX
        ? `grid-template-columns: repeat(${this.displayData.itemCountX}, 1fr);` : '';
      styles += this.displayData.itemCountY
        ? `grid-template-rows: repeat(${this.displayData.itemCountY}, 1fr);` : '';
      return styles;
    },
  },
  methods: {
    /* Returns a unique lowercase string, based on name, for section ID */
    makeId(str) {
      return str.replace(/\s+/g, '-').replace(/[^a-zA-Z ]/g, '').toLowerCase();
    },
    /* Opens the iframe modal */
    triggerModal(url) {
      this.$refs[`iframeModal-${this.groupId}`].show(url);
    },
    /* Emmit value upwards when iframe modal opened/ closed */
    modalChanged(changedTo) {
      this.$emit('change-modal-visibility', changedTo);
    },
    /* Determines if user has enabled online status checks */
    shouldEnableStatusCheck(itemPreference) {
      const globalPreference = this.config.appConfig.statusCheck || false;
      return itemPreference !== undefined ? itemPreference : globalPreference;
    },
    getStatusCheckInterval() {
      let interval = this.config.appConfig.statusCheckInterval;
      if (!interval) return 0;
      if (interval > 60) interval = 60;
      if (interval < 1) interval = 0;
      return interval;
    },
    /* Sorts items by most used to least used, based on click-count */
    sortByMostUsed(items) {
      const usageCount = JSON.parse(localStorage.getItem(localStorageKeys.MOST_USED) || '{}');
      const gmu = (item) => usageCount[this.makeId(item.title)] || 0;
      items.reverse().sort((a, b) => (gmu(a) < gmu(b) ? 1 : -1));
      return items;
    },
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
    border-radius: var(--curve-factor);
    background: #607d8b33;
    color: var(--primary);
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
    @include phone { grid-template-columns: repeat(1, 1fr); }
    @include tablet { grid-template-columns: repeat(2, 1fr); }
    @include laptop { grid-template-columns: repeat(2, 1fr); }
    @include monitor { grid-template-columns: repeat(3, 1fr); }
    @include big-screen { grid-template-columns: repeat(4, 1fr); }
    @include big-screen-up { grid-template-columns: repeat(5, 1fr); }
  }
}
.orientation-horizontal {
  display: flex;
  flex-direction: column;
  .there-are-items {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    @include phone { grid-template-columns: repeat(2, 1fr); }
    @include tablet { grid-template-columns: repeat(4, 1fr); }
    @include laptop { grid-template-columns: repeat(6, 1fr); }
    @include monitor { grid-template-columns: repeat(8, 1fr); }
    @include big-screen { grid-template-columns: repeat(10, 1fr); }
    @include big-screen-up { grid-template-columns: repeat(12, 1fr); }
  }
}

</style>
