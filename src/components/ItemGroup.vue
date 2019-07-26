<template>
    <div class="item-group-outer">
        <h2>{{ title }}</h2>
        <div class="item-group-inner">
            <span v-if="!items || items.length < 1" class="no-items">
              No Items to Show Yet
            </span>
            <div v-else class="there-are-items">
              <Item
                v-for="item in items"
                :key="item.id"
                :id="item.id"
                :title="item.title"
                :description="item.description"
                :icon="item.icon"
              />
            </div>
      </div>
  </div>
</template>

<script>
import Item from '@/components/Item.vue'

export default {
  name: 'ItemGroup',
  props: {
    title: String,
    items: Array
  },
  components: {
    Item
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.item-group-outer {
    width: 300px;
    height: 500px;
    border-radius: 10px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    background: #1CA8DD;
    background: -webkit-linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
    box-shadow: 1px 1px 2px #130f23;

    h2 {
        color: #2f323ae6;
        font-size: 1.5em;
        margin: 0.4em;
        text-shadow: 1px 1px 2px #056bc1;
    }
}
.item-group-inner {
    color: #1CA8DD;
    background: #2f323ae6;
    height: 100%;
    width: 100%;
    text-align: left;
    border-radius: 0 0 10px 10px;
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
}

.no-items {
    background: #607d8b33;
    width: 100px;
    text-align: center;
    margin: 0 auto;
    padding: 0.8em;
    border-radius: 10px;
    box-shadow: 1px 1px 2px #373737;
    cursor: default;
}

.there-are-items {
  height: 100%;
}

</style>
