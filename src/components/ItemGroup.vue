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
        :iconType="item.iconType"
        :svg="item.svg"
        @itemClicked="$emit('itemClicked')"
      />
    </div>
  </Collapsable>
</template>

<script>
import Item from '@/components/Item.vue';
import Collapsable from '@/components/Collapsable.vue';

export default {
  name: 'ItemGroup',
  props: {
    groupId: String,
    title: String,
    displayData: Object,
    items: Array,
  },
  components: {
    Collapsable,
    Item,
  },
  methods: {
    makeId(str) {
      return str.replace(/\s+/g, '-').replace(/[^a-zA-Z ]/g, '').toLowerCase();
    },
  },
};
</script>

<style scoped lang="scss">
@import '../../src/styles/color-pallet.scss';
@import '../../src/styles/constants.scss';

.no-items {
    width: 100px;
    margin: 0 auto;
    padding: 0.8rem;
    text-align: center;
    cursor: default;
    border-radius: $curve-factor;
    background: #607d8b33;
    color: $ascent;
    box-shadow: 1px 1px 2px #373737;
}

.there-are-items {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

</style>
