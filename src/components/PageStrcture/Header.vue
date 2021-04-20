<template>
    <header>
      <PageTitle v-if="titleVisible"  :title="pageInfo.title" :description="pageInfo.description" />
      <Nav v-if="navVisible" :links="pageInfo.navLinks" class="nav" />
    </header>
</template>

<script>
import PageTitle from '@/components/PageStrcture/PageTitle.vue';
import Nav from '@/components/PageStrcture/Nav.vue';
import { visibleComponents } from '@/utils/defaults';

export default {
  name: 'Header',
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
