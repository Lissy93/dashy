<template>
   <div :class="`minimal-section-inner ${selected ? 'selected' : ''} ${showAll ? 'show-all': ''}`">
    <div class="section-items" v-if="items && (selected || showAll)">
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
        :statusCheckAllowInsecure="item.statusCheckAllowInsecure"
        :statusCheckAcceptCodes="item.statusCheckAcceptCodes"
        :statusCheckMaxRedirects="item.statusCheckMaxRedirects"
        :statusCheckInterval="getStatusCheckInterval()"
        @itemClicked="$emit('itemClicked')"
        @triggerModal="triggerModal"
      />
    </div>
    <div v-if="widgets && (selected && !showAll)" class="minimal-widget-wrap">
      <WidgetBase
        v-for="(widget, widgetIndx) in widgets"
        :key="widgetIndx"
        :widget="widget"
        :index="widgetIndx"
        @navigateToSection="navigateToSection"
      />
    </div>
    <IframeModal
      :ref="`iframeModal-${groupId}`"
      :name="`iframeModal-${groupId}`"
      @closed="$emit('itemClicked')"
    />
  </div>
</template>

<script>
import router from '@/router';
import Item from '@/components/LinkItems/Item.vue';
import WidgetBase from '@/components/Widgets/WidgetBase';
import IframeModal from '@/components/LinkItems/IframeModal.vue';

export default {
  name: 'ItemGroup',
  props: {
    groupId: String,
    title: String,
    icon: String,
    displayData: Object,
    items: Array,
    widgets: Array,
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
    WidgetBase,
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
    /* Navigate to the section's single-section view page */
    navigateToSection() {
      const parse = (section) => section.replace(' ', '-').toLowerCase().trim();
      const sectionIdentifier = parse(this.title);
      router.push({ path: `/home/${sectionIdentifier}` });
      this.closeContextMenu();
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
  .minimal-widget-wrap {
    padding: 1rem;
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
