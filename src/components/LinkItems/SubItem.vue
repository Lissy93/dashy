<template ref="container">
  <div class="sub-item-wrapper">
    <a @click="itemClicked"
      @contextmenu.prevent
      @long-press="openContextMenu"
      @mouseup.right="openContextMenu"
      v-longPress="true"
      :href="hyperLinkHref"
      :target="anchorTarget"
      v-tooltip="subItemTooltip"
      rel="noopener noreferrer" tabindex="0"
      :id="`link-${id}`"
      class="sub-item-link item"
    >
      <!-- Item Icon -->
      <Icon :icon="icon" :url="url" size="small" class="sub-icon-img bounce" />
    </a>
    <!-- Right-click context menu -->
    <ContextMenu
      :show="contextMenuOpen && !isAddNew"
      v-click-outside="closeContextMenu"
      :posX="contextPos.posX"
      :posY="contextPos.posY"
      :id="`context-menu-${id}`"
      :disableEdit="true"
      @launchItem="launchItem"
    />
  </div>
</template>

<script>
import Icon from '@/components/LinkItems/ItemIcon.vue';
import ContextMenu from '@/components/LinkItems/ItemContextMenu';
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
    ContextMenu,
  },
  computed: {
    subItemTooltip() {
      return this.title;
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
.sub-item-wrapper {
  flex-grow: 1;
  flex-basis: 6rem;
  display: flex;
  a.sub-item-link {
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
