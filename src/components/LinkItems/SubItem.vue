<template ref="container">
  <div class="sub-item-wrapper">
    <a @click="beforeLaunchItem"
      :href="hyperLinkHref"
      :target="anchorTarget"
      class="sub-item-link item"
      v-tooltip="subItemTooltip"
      rel="noopener noreferrer" tabindex="0"
      :id="`link-${id}`"
    >
      <!-- Item Icon -->
      <Icon :icon="icon" :url="url" size="small" class="sub-icon-img bounce" />
    </a>
  </div>
</template>

<script>
import Icon from '@/components/LinkItems/ItemIcon.vue';
import ItemMixin from '@/mixins/ItemMixin';
import { targetValidator } from '@/utils/ConfigHelpers';

export default {
  name: 'Item',
  mixins: [ItemMixin],
  props: {
    id: String, // The unique ID of a tile (e.g. 001)
    title: String, // The main text of tile, required
    icon: String, // Optional path to icon, within public/img/tile-icons
    url: String, // URL to the resource, optional but recommended
    target: { // Where resource will open, either 'newtab', 'sametab' or 'modal'
      type: String,
      validator: targetValidator,
    },
  },
  components: {
    Icon,
  },
  computed: {
    subItemTooltip() {
      return this.title;
    },
  },
  data() {
    return {};
  },
  methods: {
    beforeLaunchItem(e) {
      if (this.isEditMode) return;
      if (e.altKey) {
        e.preventDefault();
        this.launchItem('modal');
      } else if (this.accumulatedTarget === 'modal') {
        this.launchItem('modal');
      } else if (this.accumulatedTarget === 'workspace') {
        this.launchItem('workspace');
      } else if (this.accumulatedTarget === 'clipboard') {
        this.launchItem('clipboard');
      }
      // Clear search bar
      this.$emit('itemClicked');
    },
  },
};
</script>

<style lang="scss">
.sub-item-wrapper {
  flex-grow: 1;
  flex-basis: 6rem;
  display: flex;
  a {
    border: none;
    margin: 0.2rem;
    .sub-icon-img {
      margin: 0;
    }
  }
  &.wrap-size-large {
    flex-basis: 12rem;
  }
}
</style>
