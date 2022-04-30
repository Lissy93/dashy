<template>
    <div class="nav-outer" v-if="allLinks && allLinks.length > 0">
      <IconBurger
        :class="`burger ${!navVisible ? 'visible' : ''}`"
        @click="navVisible = !navVisible"
      />
      <nav id="nav" v-if="navVisible">
        <!-- Render either router-link or anchor, depending if internal / external link -->
        <template v-for="(link, index) in allLinks">
          <router-link v-if="!isUrl(link.path)"
            :key="index"
            :to="link.path"
            class="nav-item"
          >{{link.title}}
          </router-link>
          <a v-else
            :key="index"
            :href="link.path"
            :target="determineTarget(link)"
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
import { makePageSlug } from '@/utils/ConfigHelpers';

export default {
  name: 'Nav',
  components: {
    IconBurger,
  },
  props: {
    links: Array,
  },
  data: () => ({
    navVisible: true,
    isMobile: false,
  }),
  computed: {
    /* Get links to sub-pages, and combine with nav-links */
    allLinks() {
      const subPages = this.$store.getters.pages.map((subPage) => ({
        path: makePageSlug(subPage.name, 'home'),
        title: subPage.name,
      }));
      const navLinks = this.links || [];
      return [...navLinks, ...subPages];
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
    isUrl: (str) => new RegExp(/(http|https):\/\/(\S+)(:[0-9]+)?/).test(str),
    determineTarget(link) {
      if (!link.target) return '_blank';
      switch (link.target) {
        case 'sametab': return '_self';
        case 'newtab': return '_blank';
        case 'parent': return '_parent';
        case 'top': return '_top';
        default: return undefined;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/style-helpers.scss';
@import '@/styles/media-queries.scss';

.nav-outer {
  nav {
    display: flex;
    align-items: center;
    .nav-item {
      display: inline-block;
      padding: 0.75rem 0.5rem;
      margin: 0.5rem;
      min-width: 5rem;
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
    nav { flex-wrap: wrap; }
  }
  .burger {
    display: none;
    &.visible { display: block; }
    @include phone { display: block; }
  }
}

</style>
