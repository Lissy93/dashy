<template>
  <div class="tabs-component">
    <div class="tab__pagination" role="tablist">
      <button
        v-for="(item, index) in navItems"
        :key="index"
        class="tab__nav__item"
        :class="{ active: activeIndex === index }"
        role="tab"
        :aria-selected="activeIndex === index"
        :tabindex="activeIndex === index ? 0 : -1"
        @click="activeTabItem(item)"
        @keydown="onKeydown($event, index)"
      >
        <span>{{ item.name }}</span>
      </button>
    </div>
    <div class="tabs__content" role="tabpanel">
      <template v-for="(item, index) in navItems" :key="item.name">
        <component v-if="activeIndex === index" :is="item.vnode" />
      </template>
    </div>
  </div>
</template>

<script>
import { h } from 'vue';

export default {
  name: 'Tabs',
  data() {
    return { activeIndex: 0 };
  },
  computed: {
    navItems() {
      const defaultSlot = this.$slots.default;
      if (!defaultSlot) return [];
      const vnodes = defaultSlot();
      const items = [];
      vnodes.forEach((vnode) => {
        if (!vnode.type || vnode.type === Symbol.for('v-cmt')) return;
        if (vnode.type === Symbol.for('v-fgt') && Array.isArray(vnode.children)) {
          vnode.children.forEach((child) => {
            if (child.props?.name) {
              items.push({ name: child.props.name, vnode: { render: () => h(child) } });
            }
          });
          return;
        }
        if (vnode.props?.name) {
          items.push({ name: vnode.props.name, vnode: { render: () => h(vnode) } });
        }
      });
      return items;
    },
  },
  methods: {
    activeTabItem(item) {
      const index = this.navItems.indexOf(item);
      if (index >= 0) this.activeIndex = index;
    },
    onKeydown(e, index) {
      const len = this.navItems.length;
      let next = -1;
      if (e.key === 'ArrowRight') next = (index + 1) % len;
      else if (e.key === 'ArrowLeft') next = (index - 1 + len) % len;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = len - 1;
      if (next >= 0) {
        e.preventDefault();
        this.activeIndex = next;
        this.$el.querySelectorAll('[role="tab"]')[next]?.focus();
      }
    },
  },
  watch: {
    navItems(newItems) {
      if (this.activeIndex >= newItems.length) {
        this.activeIndex = Math.max(0, newItems.length - 1);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tabs-component {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab__pagination {
  flex: 0 0 auto;
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid var(--config-settings-color);
}

.tab__nav__item {
  flex: 1 1 0;
  min-width: 0;
  padding: 0.5rem 0.25rem;
  border: none;
  border-bottom: 2px solid transparent;
  background: var(--config-settings-background);
  color: var(--config-settings-color);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  transition: background 0.2s, border-color 0.2s;

  &:hover {
    background: var(--config-settings-color);
    span { color: var(--config-settings-background); }
  }

  &:focus-visible {
    outline: 2px solid var(--config-settings-color);
    outline-offset: -2px;
  }

  &.active {
    border-bottom-color: var(--config-settings-color);
    span { font-weight: bold; }
  }
}

.tabs__content {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
