<template>
    <div class="nav-outer">
      <IconBurger
        :class="`burger ${!navVisible ? 'visible' : ''}`"
        @click="navVisible = !navVisible"
      />
      <nav id="nav" v-if="navVisible">
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.path"
          :href="link.path"
          :target="isUrl(link.path) ? '_blank' : ''"
          rel="noopener noreferrer"
          class="nav-item"
        >{{link.title}}</router-link>
      </nav>
    </div>
</template>

<script>
import IconBurger from '@/assets/interface-icons/burger-menu.svg';

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
