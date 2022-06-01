<template>
  <nav class="side-bar">
    <div v-for="(section, index) in sections" :key="index" class="side-bar-section">
      <!-- Section button -->
      <div @click="openSection(index)" class="side-bar-item-container">
        <SideBarItem
          class="item"
          :icon="section.icon"
          :title="section.name"
        />
      </div>
      <!-- Section inner -->
      <transition name="slide">
        <SideBarSection
          v-if="isOpen[index]"
          :items="filterTiles(section.items)"
          @launch-app="launchApp"
        />
      </transition>
    </div>
    <!-- Show links for switching back to Home / Minimal views -->
    <div class="switch-view-buttons">
      <router-link to="/home">
        <IconHome class="view-icon" v-tooltip="$t('alternate-views.default')" />
      </router-link>
      <router-link to="/minimal">
        <IconMinimalView class="view-icon" v-tooltip="$t('alternate-views.minimal')" />
      </router-link>
    </div>
  </nav>
</template>

<script>

import SideBarItem from '@/components/Workspace/SideBarItem.vue';
import SideBarSection from '@/components/Workspace/SideBarSection.vue';
import IconHome from '@/assets/interface-icons/application-home.svg';
import IconMinimalView from '@/assets/interface-icons/application-minimal.svg';
import { checkItemVisibility } from '@/utils/CheckItemVisibility';

export default {
  name: 'SideBar',
  props: {
    sections: Array,
    initUrl: String,
  },
  data() {
    return {
      isOpen: new Array(this.sections.length).fill(false),
    };
  },
  components: {
    SideBarItem,
    SideBarSection,
    IconMinimalView,
    IconHome,
  },
  methods: {
    /* Toggles the section clicked, and closes all other sections */
    openSection(index) {
      this.isOpen = this.isOpen.map((val, ind) => (ind !== index ? false : !val));
      if (this.sections[index].widgets) this.$emit('launch-widget', this.sections[index].widgets);
    },
    /* When item clicked, emit a launch event */
    launchApp(options) {
      this.$emit('launch-app', options);
    },
    /* If an initial URL is specified, then open relevant section */
    openDefaultSection() {
      if (!this.initUrl) return;
      const process = (url) => (url ? url.replace(/[^\w\s]/gi, '').toLowerCase() : undefined);
      const compare = (item) => (process(item.url) === process(this.initUrl));
      this.sections.forEach((section, secIndx) => {
        if (!section.items) return; // Cancel if no items
        if (section.items.findIndex(compare) !== -1) this.openSection(secIndx);
        section.items.forEach((item) => { // Do the same for sub-items, if set
          if (item.subItems && item.subItems.findIndex(compare) !== -1) this.openSection(secIndx);
        });
      });
    },
    /* Return a list with visible items on a section to the user or guest */
    filterTiles(allTiles) {
      if (!allTiles) {
        return [];
      }
      return allTiles.filter((tile) => checkItemVisibility(tile));
    },
  },
  mounted() {
    if (this.sections.length === 1) { // If only 1 section, go ahead and open it
      this.openSection(0);
    } else { // Otherwise, see if user set a default section, and open that
      this.openDefaultSection();
    }
  },
};
</script>

<style lang="scss" scoped>

@import '@/styles/media-queries.scss';
@import '@/styles/style-helpers.scss';

nav.side-bar {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: var(--side-bar-background);
  color: var(--side-bar-color);
  height: 100%;
  width: var(--side-bar-width);
  text-align: center;
  overflow: auto;
  @extend .scroll-bar;
  .side-bar-item-container {
    z-index: 5;
  }
  .item:not(:last-child) {
    border-bottom: 1px dashed var(--side-bar-color);
    z-index: 5;
  }
}

.slide-leave-active,
.slide-enter-active {
  transition: all 0.1s ease-in-out;
}
.slide-enter {
  transform: translate(0, -80%);
}
.slide-leave-to {
  transform: translate(0, -80%);
}

.switch-view-buttons {
  margin-top: 0.5rem;
  display: flex;
  @extend .svg-button;
  .view-icon {
    border: none;
  }
}

</style>
