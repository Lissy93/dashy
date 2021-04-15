<template>
   <Collapsable
    :title="title"
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
    <div v-else class="there-are-items">
      <Item
        v-for="(item, index) in items"
        :id="`${index}_${makeId(item.title)}`"
        :key="`${index}_${makeId(item.title)}`"
        :url="item.url"
        :title="item.title"
        :description="item.description"
        :icon="item.icon"
        :target="item.target"
        :itemSize="itemSize"
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
import Item from '@/components/LinkItems/Item.vue';
import Collapsable from '@/components/LinkItems/Collapsable.vue';
import IframeModal from '@/components/LinkItems/IframeModal.vue';

export default {
  name: 'ItemGroup',
  props: {
    groupId: String,
    title: String,
    displayData: Object,
    items: Array,
    itemSize: String,
  },
  components: {
    Collapsable,
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
  },
};
</script>

<style scoped lang="scss">

.no-items {
    width: 100px;
    margin: 0 auto;
    padding: 0.8rem;
    text-align: center;
    cursor: default;
    border-radius: var(--curve-factor);
    background: #607d8b33;
    color: var(--primary);
    box-shadow: 1px 1px 2px #373737;
}

.there-are-items {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

</style>
