<template>
  <div class="nav-outer" :class="{ floating: showBurger }" v-if="allLinks.length">
    <button
      v-if="showBurger"
      type="button"
      class="burger"
      :aria-expanded="isOpen"
      aria-controls="nav"
      :aria-label="$t('settings.toggle-nav-aria')"
      @click="isOpen = !isOpen"
    >
      <IconBurger />
    </button>
    <nav id="nav" v-show="isOpen" :class="{ 'as-menu': showBurger }">
      <template v-for="(link, index) in allLinks" :key="index">
        <router-link
          v-if="!isHttpUrl(link.path)"
          :to="link.path"
          :title="link.title"
          class="nav-item"
          @click="closeIfBurger"
        >{{ link.title }}</router-link>
        <a
          v-else
          :href="link.path"
          :target="resolveLinkTarget(link)"
          :title="link.title"
          class="nav-item"
          rel="noopener noreferrer"
          @click="closeIfBurger"
        >{{ link.title }}</a>
      </template>
    </nav>
  </div>
</template>

<script>
import IconBurger from '@/assets/interface-icons/burger-menu.svg';
import { buildAllLinks, isHttpUrl, resolveLinkTarget } from '@/utils/NavLinks';

const MOBILE_QUERY = '(max-width: 599px)';

export default {
  name: 'Nav',
  components: { IconBurger },
  props: {
    links: { type: Array, default: () => [] },
    userHidden: { type: Boolean, default: false },
  },
  data() {
    const isMobile = typeof window !== 'undefined'
      && window.matchMedia(MOBILE_QUERY).matches;
    return {
      isMobile,
      isOpen: !isMobile && !this.userHidden,
      mql: null,
    };
  },
  computed: {
    allLinks() {
      void this.$store.state.authRevision;
      return buildAllLinks(this.$store, this.$route, this.links);
    },
    showBurger() {
      return this.isMobile || this.userHidden;
    },
  },
  watch: {
    showBurger(v) { this.isOpen = !v; },
  },
  mounted() {
    this.mql = window.matchMedia(MOBILE_QUERY);
    this.mql.addEventListener('change', this.onMqlChange);
    document.addEventListener('keydown', this.onKey);
    document.addEventListener('click', this.onDocClick);
  },
  beforeUnmount() {
    this.mql?.removeEventListener('change', this.onMqlChange);
    document.removeEventListener('keydown', this.onKey);
    document.removeEventListener('click', this.onDocClick);
  },
  methods: {
    onMqlChange(e) { this.isMobile = e.matches; },
    onKey(e) { if (e.key === 'Escape' && this.showBurger) this.isOpen = false; },
    onDocClick(e) {
      if (!this.showBurger || !this.isOpen) return;
      if (!this.$el.contains(e.target)) this.isOpen = false;
    },
    closeIfBurger() { if (this.showBurger) this.isOpen = false; },
    isHttpUrl,
    resolveLinkTarget,
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

.nav-outer {
  position: relative;
  min-width: 0;

  &.floating {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 5;
  }

  .burger {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    background: none;
    border: 1px solid transparent;
    border-radius: var(--curve-factor);
    color: var(--settings-text-color);
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    &:hover, &:focus-visible, &[aria-expanded="true"] {
      background: var(--background);
      border-color: var(--primary);
      color: var(--primary);
    }
    &:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
    svg { width: 1.5rem; height: 1.5rem; }
  }

  nav {
    display: flex;
    align-items: center;
    min-width: 0;
    max-width: 100%;
    overflow-x: auto;
    @extend .scroll-bar;

    .nav-item {
      display: inline-block;
      padding: 0.75rem 0.5rem;
      margin: 0.5rem;
      min-width: 5rem;
      max-width: 12rem;
      flex: 0 0 auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      outline: none;
      border-radius: var(--curve-factor);
      box-shadow: var(--nav-link-shadow);
      color: var(--nav-link-text-color);
      background: var(--nav-link-background-color);
      border: 1px solid var(--nav-link-border-color);
      text-decoration: none;
      &.router-link-active, &:hover {
        color: var(--nav-link-text-color-hover);
        background: var(--nav-link-background-color-hover);
        border-color: var(--nav-link-border-color-hover);
        box-shadow: var(--nav-link-shadow-hover);
      }
    }

    &.as-menu {
      position: absolute;
      top: calc(100% + 0.25rem);
      right: 0;
      z-index: 10;
      flex-direction: column;
      align-items: stretch;
      min-width: 12rem;
      max-width: calc(100vw - 1rem);
      max-height: calc(100vh - 6rem);
      padding: 0.25rem;
      overflow-x: hidden;
      overflow-y: auto;
      background: var(--background-darker);
      border: 1px solid var(--primary);
      border-radius: var(--curve-factor);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
      .nav-item { margin: 0.25rem 0; max-width: none; min-width: 0; }
    }
  }

}
</style>
