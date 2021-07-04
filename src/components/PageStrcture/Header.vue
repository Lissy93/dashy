<template>
    <header>
      <PageTitle v-if="titleVisible"  :title="pageInfo.title" :description="pageInfo.description" />
      <Nav v-if="navVisible" :links="getNavLinks()" class="nav" />
    </header>
</template>

<script>
import PageTitle from '@/components/PageStrcture/PageTitle.vue';
import Nav from '@/components/PageStrcture/Nav.vue';
import { visibleComponents } from '@/utils/defaults';

export default {
  name: 'Header',
  inject: ['config'],
  components: {
    PageTitle,
    Nav,
  },
  props: {
    pageInfo: Object,
  },
  data() {
    return {
      hiddenComponents: this.pageInfo.hiddenComponents || {},
      titleVisible: visibleComponents.pageTitle,
      navVisible: visibleComponents.navigation,
    };
  },
  methods: {
    getNavLinks() {
      const { appConfig } = this.config;
      const pageLinks = [];
      if (appConfig.additionalConfigFiles) {
        appConfig.additionalConfigFiles.forEach((pageLink) => {
          const name = pageLink.split('.')[0];
          pageLinks.push({ title: name, path: `/home/${name}` });
        });
      }
      return pageLinks.concat(this.pageInfo.navLinks);
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  header {
    margin: 0;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    background: var(--background-darker);
    align-items: center;
    align-content: flex-start;
    @include phone {
      flex-direction: column-reverse;
    }
  }
</style>
