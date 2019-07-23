<template>
    <div class="item">
        <div class="tile-title" :id="`tile-${id}`">
            <span class="text">{{ title }}</span>
            <div class="overflow-dots">...</div>
        </div>
        <img
            v-if="icon"
            :src="`/img/tile-icons/${icon}.png`"
            class="tile-icon"
        />
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    id: String, // The unique ID of a tile (e.g. 001)
    title: String, // The main text of tile, required
    subtitle: String, // Optional sub-text
    description: String, // Optional tooltip hover text
    icon: String, // Optional path to icon, within public/img/tile-icons
    color: String, // Optional background color, specified in hex code
    url: String, // URL to the resource, optional but recommended
    openingMethod: { // Where resource will open, either 'newtab', 'sametab' or 'iframe'
      type: String,
      default: 'newtab',
      validator: (value) =>
        ['newtab', 'sametab', 'iframe'].indexOf(value) !== -1
    }
  },
  data () {
    return { getId: this.id }
  },
  mounted () {
    // Detects overflowing text, and allows is to marguee on hover
    // The below code is horifically bad, it is embarassing that I wrote it...
    const tileElem = document.getElementById(`tile-${this.getId}`)
    if (tileElem) {
      const isOverflowing =
            tileElem.scrollHeight > tileElem.clientHeight ||
            tileElem.scrollWidth > tileElem.clientWidth
      if (isOverflowing) {
        tileElem.className += ' is-overflowing'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.item {
    width: 120px;
    height: 100px;
    display: inline-block;
    vertical-align: middle;
    margin: 8px;
    background: #607d8b33;
    text-align: center;
    padding: 5px;
    border-radius: 10px;
    box-shadow: 1px 1px 2px #373737;
    cursor: pointer;
    &:hover {
        box-shadow: 1px 2px 4px #373737;
        background: #607d8b4d;
    }
}
.tile-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 120px;
    height: 30px;
    overflow: hidden;
    position: relative;
    padding: 0;

    span.text {
        position: absolute;
        white-space: nowrap;
        transition: 1s;
        float: left;
        left: 0;
    }
    &:not(.is-overflowing) span.text{
        width: 100%;
    }
    .overflow-dots {
        // display: none;
        opacity: 0;
    }
}

.tile-title.is-overflowing {
    span.text {
        overflow: hidden;
    }
    .overflow-dots {
        display: block;
        opacity: 1;
        background: #354857;
        position: absolute;
        z-index: 5;
        right: 0;
        transition: opacity 0.1s ease-in;
    }
}

.item:hover .tile-title{
    .overflow-dots {
        // display: none;
        opacity: 0;
    }
    span.text {
        transform: translateX(calc(120px - 100%));
    }
}

.tile-icon {
    width: 60px;
}

</style>
