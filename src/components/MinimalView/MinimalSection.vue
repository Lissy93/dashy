<template>
   <div class="minimal-section-inner">
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
      <div ref="modalContainer"></div>
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
    Item,
    IframeModal,
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
    modalChanged(changedTo) {
      this.$emit('change-modal-visibility', changedTo);
    },
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
