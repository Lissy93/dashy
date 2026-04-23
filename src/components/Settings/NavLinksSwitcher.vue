<template>
  <div v-if="allLinks.length" class="nav-links-switcher" role="menu">
    <template v-for="(link, index) in allLinks" :key="index">
      <router-link v-if="!isHttpUrl(link.path)"
        :to="link.path" class="nav-link" role="menuitem"
        @click="$emit('close')">
        {{ link.title }}
      </router-link>
      <a v-else
        :href="link.path" :target="resolveLinkTarget(link)"
        class="nav-link" role="menuitem"
        rel="noopener noreferrer"
        @click="$emit('close')">
        {{ link.title }}
      </a>
    </template>
  </div>
</template>

<script>
import { buildAllLinks, isHttpUrl, resolveLinkTarget } from '@/utils/NavLinks';

export default {
  name: 'NavLinksSwitcher',
  emits: ['close'],
  computed: {
    allLinks() {
      void this.$store.state.authRevision;
      const nav = (this.$store.getters.pageInfo && this.$store.getters.pageInfo.navLinks) || [];
      return buildAllLinks(this.$store, this.$route, nav);
    },
  },
  methods: { isHttpUrl, resolveLinkTarget },
};
</script>

<style scoped lang="scss">
.nav-links-switcher {
  position: absolute;
  right: 1rem;
  margin-top: 3rem;
  z-index: 5;
  display: flex;
  flex-direction: column;
  min-width: 12rem;
  max-height: 70vh;
  overflow-y: auto;
  background: var(--background);
  border: 1px solid var(--settings-text-color);
  border-radius: var(--curve-factor);
  box-shadow: var(--settings-container-shadow);
  .nav-link {
    padding: 0.4rem 0.75rem;
    color: var(--settings-text-color);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover, &:focus-visible, &.router-link-active {
      outline: none;
      background: var(--settings-text-color);
      color: var(--background);
    }
  }
}
</style>
