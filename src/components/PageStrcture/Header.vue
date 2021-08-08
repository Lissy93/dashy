<template>
    <header v-if="visible">
      <PageTitle
        v-if="titleVisible"
        :title="pageInfo.title"
        :description="pageInfo.description"
        :logo="pageInfo.logo"
      />
      <Nav v-if="navVisible" :links="pageInfo.navLinks" class="nav" />
    </header>
</template>

<script>
import PageTitle from '@/components/PageStrcture/PageTitle.vue';
import Nav from '@/components/PageStrcture/Nav.vue';
import { visibleComponents as defaultVisibleComponents } from '@/utils/defaults';
import { shouldBeVisible } from '@/utils/MiscHelpers';

export default {
  name: 'Header',
  inject: ['visibleComponents'],
  components: {
    PageTitle,
    Nav,
  },
  props: {
    pageInfo: Object,
  },
  data() {
    return {
      titleVisible: (this.visibleComponents || defaultVisibleComponents).pageTitle,
      navVisible: (this.visibleComponents || defaultVisibleComponents).navigation,
    };
  },
  computed: {
    visible() {
      return shouldBeVisible(this.$route.name);
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
