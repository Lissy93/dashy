<template>
    <header>
      <PageTitle :title="pageInfo.title" :description="pageInfo.description" />
      <Nav class="nav"/>
    </header>
</template>

<script>
import PageTitle from '@/components/PageTitle.vue';
import Nav from '@/components/Nav.vue';

export default {
  name: 'Header',
  components: {
    PageTitle,
    Nav,
  },
  props: {
    pageInfo: Object,
  },
};
</script>

<style scoped lang="scss">
  @import '../../src/styles/color-pallet.scss';

  header {
    margin: 0;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    background: $header-color;
    align-items: center;
    align-content: flex-start;
    @media screen and (max-width: 600px) {
      flex-direction: column-reverse;
    }
  }
</style>
