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
        v-for="(item, index) in sortedItems"
        :id="makeId(title, item.title, index)"
        :key="makeId(title, item.title, index)"
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
        :provider="item.provider"
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
    />
  </Collapsable>
</template>

<script>
import { sortOrder as defaultSortOrder, localStorageKeys } from '@/utils/defaults';
import ErrorHandler from '@/utils/ErrorHandler';
import Item from '@/components/LinkItems/Item.vue';
import Collapsable from '@/components/LinkItems/Collapsable.vue';
import IframeModal from '@/components/LinkItems/IframeModal.vue';

export default {
  name: 'Section',
  props: {
    groupId: String,
    title: String,
    icon: String,
    displayData: Object,
    items: Array,
    itemSize: String,
  },
  components: {
    Collapsable,
    Item,
    IframeModal,
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    sortOrder() {
      return this.displayData.sortBy || defaultSortOrder;
    },
    /* If the sortBy attribute is specified, then return sorted data */
    sortedItems() {
      let { items } = this;
      if (this.appConfig.disableSmartSort) return items;
      if (this.sortOrder === 'alphabetical') {
        this.sortAlphabetically(items);
      } else if (this.sortOrder === 'reverse-alphabetical') {
        this.sortAlphabetically(items).reverse();
      } else if (this.sortOrder === 'most-used') {
        items = this.sortByMostUsed(items);
      } else if (this.sortOrder === 'last-used') {
        items = this.sortBLastUsed(items);
      } else if (this.sortOrder === 'random') {
        items = this.sortRandomly(items);
      } else if (this.sortOrder && this.sortOrder !== 'default') {
        ErrorHandler(`Unknown Sort order '${this.sortOrder}' under '${this.title}'`);
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
    /* Returns a unique lowercase string, based on name, for section ID */
    makeId(sectionStr, itemStr, index) {
      const charSum = sectionStr.split('').map((a) => a.charCodeAt(0)).reduce((x, y) => x + y);
      const itemTitleStr = itemStr.replace(/\s+/g, '-').replace(/[^a-zA-Z ]/g, '').toLowerCase();
      return `${index}_${charSum}_${itemTitleStr}`;
    },
    /* Opens the iframe modal */
    triggerModal(url) {
      this.$refs[`iframeModal-${this.groupId}`].show(url);
    },
    /* Determines if user has enabled online status checks */
    shouldEnableStatusCheck(itemPreference) {
      const globalPreference = this.appConfig.statusCheck || false;
      return itemPreference !== undefined ? itemPreference : globalPreference;
    },
    /* Determine how often to re-fire status checks */
    getStatusCheckInterval() {
      let interval = this.appConfig.statusCheckInterval;
      if (!interval) return 0;
      if (interval > 60) interval = 60;
      if (interval < 1) interval = 0;
      return interval;
    },
    /* Sorts items alphabetically using the title attribute */
    sortAlphabetically(items) {
      return items.sort((a, b) => (a.title > b.title ? 1 : -1));
    },
    /* Sorts items by most used to least used, based on click-count */
    sortByMostUsed(items) {
      const usageCount = JSON.parse(localStorage.getItem(localStorageKeys.MOST_USED) || '{}');
      const gmu = (item) => usageCount[this.makeId(this.title, item.title)] || 0;
      items.reverse().sort((a, b) => (gmu(a) < gmu(b) ? 1 : -1));
      return items;
    },
    /* Sorts items by most recently used */
    sortBLastUsed(items) {
      const usageCount = JSON.parse(localStorage.getItem(localStorageKeys.LAST_USED) || '{}');
      const glu = (item) => usageCount[this.makeId(this.title, item.title)] || 0;
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
.orientation-horizontal {
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
}

</style>
