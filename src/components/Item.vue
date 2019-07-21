<template>
    <div class="item">
        {{ title }}
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

// .item-group-outer {
//     width: 300px;
//     height: 500px;
//     border-radius: 10px;
//     padding: 5px;
//     display: flex;
//     flex-direction: column;
//     background: #1CA8DD;
//     background: -webkit-linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
//     background: linear-gradient(to left top, #9F86FF, #1CA8DD, #007AE1);
//     box-shadow: 1px 1px 2px #130f23;

//     h2 {
//         color: #2f323ae6;
//         font-size: 1.5em;
//         margin: 0.4em;
//         text-shadow: 1px 1px 2px #056bc1;
//     }
// }
// .item-group-inner {
//     color: #1CA8DD;
//     background: #2f323ae6;
//     height: 100%;
//     width: 100%;
//     border-radius: 0 0 10px 10px;
//     display: flex;
//     justify-content: space-evenly;
//     flex-direction: column;
//     text-align: center;
// }

// .no-items {
//     background: #607d8b33;
//     width: 100px;
//     text-align: center;
//     margin: 0 auto;
//     padding: 0.8em;
//     border-radius: 10px;
//     box-shadow: 1px 1px 2px #373737;
// }

</style>
