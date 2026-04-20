<template>
<div class="view-switcher">
  <ul>
    <li>
      <router-link :to="pathFor('home')">
        <IconHome /><span>{{ $t('alternate-views.default') }}</span>
      </router-link>
    </li>
    <li>
      <router-link :to="pathFor('minimal')">
        <IconMinimalView /><span>{{ $t('alternate-views.minimal') }}</span>
      </router-link>
    </li>
    <li>
      <router-link :to="pathFor('workspace')">
        <IconWorkspaceView /><span>{{ $t('alternate-views.workspace') }}</span>
      </router-link>
    </li>
  </ul>
</div>
</template>

<script>
import IconHome from '@/assets/interface-icons/application-home.svg';
import IconWorkspaceView from '@/assets/interface-icons/open-workspace.svg';
import IconMinimalView from '@/assets/interface-icons/application-minimal.svg';
import { makeRoutePath, resolveRouteIntent } from '@/utils/config/ConfigHelpers';

export default {
  components: {
    IconHome,
    IconWorkspaceView,
    IconMinimalView,
  },
  methods: {
    /* Make URL to the given view. Includes current sub-page, and section when supported */
    pathFor(view) {
      const { pageId, sectionSlug } = resolveRouteIntent(this.$route, this.$store);
      return makeRoutePath(view, pageId, sectionSlug);
    },
  },
};
</script>

<style scoped lang="scss">

.view-switcher {
  position: absolute;
  right: 1rem;
  margin-top: 3rem;
  z-index: 5;
  background: var(--background);
  border: 1px solid var(--settings-text-color);
  border-radius: var(--curve-factor);
  box-shadow: var(--settings-container-shadow);
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      cursor: pointer;
      padding: 0.25rem 0.75rem;
      a {
        color: var(--settings-text-color);
        text-decoration: none;
        display: flex;
        align-items: center;
      }
      &:hover {
        background: var(--settings-text-color);
        a { color: var(--background); }
      }
      svg {
        margin: 0 0.5rem 0 0;
        width: 1rem;
        border: none;
      }
    }
  }
}
</style>
