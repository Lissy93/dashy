<template>
  <nav class="side-bar">
    <div v-for="(section, index) in sections" :key="index" class="side-bar-section">
      <div @click="openSection(index)" class="side-bar-item-container">
        <SideBarItem
          class="item"
          :icon="section.icon"
          :title="section.name"
        />
      </div>
      <transition name="slide">
        <SideBarSection
          v-if="isOpen[index]"
          :items="section.items"
          @launch-app="launchApp"
        />
      </transition>
    </div>
  </nav>
</template>

<script>

import SideBarItem from '@/components/Workspace/SideBarItem.vue';
import SideBarSection from '@/components/Workspace/SideBarSection.vue';

export default {
  name: 'SideBar',
  inject: ['config'],
  props: {
    sections: Array,
  },
  data() {
    return {
      isOpen: new Array(this.sections.length).fill(false),
    };
  },
  components: {
    SideBarItem,
    SideBarSection,
  },
  methods: {
    /* Toggles the section clicked, and closes all other sections */
    openSection(index) {
      this.isOpen = this.isOpen.map((val, ind) => (ind !== index ? false : !val));
    },
    launchApp(url) {
      this.$emit('launch-app', url);
    },
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

</style>
