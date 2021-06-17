<template>
  <div class="work-space">
    <SideBar :sections="sections" />
    <WebContent :url="url" />
  </div>
</template>

<script>

import SideBar from '@/components/Workspace/SideBar';
import WebContent from '@/components/Workspace/WebContent';

export default {
  name: 'Workspace',
  props: {
    sections: Array,
  },
  data: () => ({
    url: '',
  }),
  components: {
    SideBar,
    WebContent,
  },
};

</script>

<style scoped lang="scss">

</style>
