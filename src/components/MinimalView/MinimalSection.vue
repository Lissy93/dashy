<template>
   <div :class="`minimal-section-inner ${selected ? 'selected' : ''} ${showAll ? 'show-all': ''}`">
    <div class="section-items" v-if="selected || showAll">
      <Item
        v-for="(item, index) in items"
        :id="`${index}_${makeId(item.title)}`"
        :key="`${index}_${makeId(item.title)}`"
        :url="item.url"
        :title="item.title"
        :description="item.description"
        :icon="item.icon"
        :target="item.target"
        :color="item.color"
        :backgroundColor="item.backgroundColor"
        :statusCheckUrl="item.statusCheckUrl"
        :statusCheckHeaders="item.statusCheckHeaders"
        :itemSize="itemSize"
        :hotkey="item.hotkey"
        :enableStatusCheck="shouldEnableStatusCheck(item.statusCheck)"
        :statusCheckInterval="getStatusCheckInterval()"
        @itemClicked="$emit('itemClicked')"
        @triggerModal="triggerModal"
      />
    </div>
    <IframeModal
      :ref="`iframeModal-${groupId}`"
      :name="`iframeModal-${groupId}`"
      @closed="$emit('itemClicked')"
      @modalChanged="modalChanged"
    />
  </div>
</template>

<script>
import Item from '@/components/LinkItems/Item.vue';
import IframeModal from '@/components/LinkItems/IframeModal.vue';

export default {
  name: 'ItemGroup',
  props: {
    groupId: String,
    title: String,
    icon: String,
    displayData: Object,
    items: Array,
    itemSize: String,
    modalOpen: Boolean,
    index: Number,
    selected: Boolean,
    showAll: Boolean,
  },
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
  },
  components: {
    Item,
    IframeModal,
  },
  methods: {
    selectSection(index) {
      this.$emit('sectionSelected', index);
    },
    /* Returns a unique lowercase string, based on name, for section ID */
    makeId(str) {
      return str.replace(/\s+/g, '-').replace(/[^a-zA-Z ]/g, '').toLowerCase();
    },
    /* Opens the iframe modal */
    triggerModal(url) {
      this.$refs[`iframeModal-${this.groupId}`].show(url);
    },
    modalChanged(changedTo) {
      this.$emit('change-modal-visibility', changedTo);
    },
    shouldEnableStatusCheck(itemPreference) {
      const globalPreference = this.appConfig.statusCheck || false;
      return itemPreference !== undefined ? itemPreference : globalPreference;
    },
    getStatusCheckInterval() {
      let interval = this.appConfig.statusCheckInterval;
      if (!interval) return 0;
      if (interval > 60) interval = 60;
      if (interval < 1) interval = 0;
      return interval;
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

.minimal-section-inner {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background: var(--minimal-view-group-background);
  border-radius: 0 0 var(--curve-factor) var(--curve-factor);
  .section-items {
    display: grid;
    @include phone { --minimal-col-count: 1; }
    @include tablet { --minimal-col-count: 2; }
    @include laptop { --minimal-col-count: 3; }
    @include monitor { --minimal-col-count: 4; }
    @include big-screen { --minimal-col-count: 5; }
    @include big-screen-up { --minimal-col-count: 6; }
    grid-template-columns: repeat(var(--minimal-col-count, 1), minmax(0, 1fr));
  }
  &.selected {
    border: 1px solid var(--minimal-view-group-color);
    grid-column-start: span var(--col-count, 3);
  }
  &.show-all {
    border: none;
  }
}

</style>
