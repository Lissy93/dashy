<template>
    <div class="nav-outer" v-if="allLinks && allLinks.length > 0">
      <IconBurger
        :class="`burger ${!navVisible ? 'visible' : ''}`"
        @click="navVisible = !navVisible"
      />
      <nav id="nav" v-if="navVisible">
        <!-- Render either router-link or anchor, depending if internal / external link -->
        <template v-for="(link, index) in allLinks" :key="index">
          <router-link v-if="!isHttpUrl(link.path)"
            :to="link.path"
            :title="link.title"
            class="nav-item"
          >{{link.title}}
          </router-link>
          <a v-else
            :href="link.path"
            :target="resolveLinkTarget(link)"
            :title="link.title"
            class="nav-item"
            rel="noopener noreferrer"
          >{{link.title}}
          </a>
        </template>
      </nav>
    </div>
</template>

<script>
import IconBurger from '@/assets/interface-icons/burger-menu.svg';
import { buildAllLinks, isHttpUrl, resolveLinkTarget } from '@/utils/NavLinks';

export default {
  name: 'Nav',
  components: {
    IconBurger,
  },
  props: {
    links: { type: Array, default: () => [] },
  },
  data: () => ({
    navVisible: true,
    isMobile: false,
  }),
  computed: {
    allLinks() {
      void this.$store.state.authRevision; // Re-filter pages when auth state changes
      return buildAllLinks(this.$store, this.$route, this.links);
    },
  },
  created() {
    this.navVisible = !this.detectMobile();
    this.isMobile = this.detectMobile();
  },
  methods: {
    detectMobile() {
      const screenWidth = document.body.clientWidth;
      return screenWidth && screenWidth < 600;
    },
    isHttpUrl,
    resolveLinkTarget,
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

.nav-outer {
  min-width: 0;
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
      border: none;
      border-radius: var(--curve-factor);
      box-shadow: var(--nav-link-shadow);
      color: var(--nav-link-text-color);
      background: var(--nav-link-background-color);
      border: 1px solid var(--nav-link-border-color);
      text-decoration: none;
      &.router-link-active, &:hover {
        color: var(--nav-link-text-color-hover);
        background: var(--nav-link-background-color-hover);
        border: 1px solid var(--nav-link-border-color-hover);
        box-shadow: var(--nav-link-shadow-hover);
      }
    }
  }
  /* Mobile and Burger-Menu Styles */
  @extend .svg-button;
  @include phone {
    width: 100%;
    nav { flex-wrap: wrap; overflow-x: visible; }
  }
  .burger {
    display: none;
    &.visible { display: block; }
    @include phone { display: block; }
  }
}

</style>
