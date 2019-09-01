<template>
   <Collapsable :title="title" :uniqueKey="groupId">
    <div v-if="!items || items.length < 1" class="no-items">
      No Items to Show Yet
    </div>
    <div v-else class="there-are-items">
      <Item
        v-for="item in items"
        :key="`${groupId}-${item.id}`"
        :id="`${groupId}-${item.id}`"
        :title="item.title"
        :description="item.description"
        :icon="item.icon"
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
    items: Array,
  },
  components: {
    Collapsable,
    Item,
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
    border-radius: 10px;
    background: #607d8b33;
    color: #1CA8DD;
    box-shadow: 1px 1px 2px #373737;
}

.there-are-items {
  height: 100%;
}

</style>
