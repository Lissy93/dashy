<template>
  <div>
    <WidgetBase
      v-for="(widget, widgetIndex) in widgets"
      :key="widgetIndex"
      :widget="widget"
      :index="widgetIndex"
    />
  </div>
</template>

<script>
import WidgetBase from '@/components/Widgets/WidgetBase';

export default {
  name: 'WidgetGroup',
  components: {
    WidgetBase,
  },
  props: {
    widgets: Array,
  },
  computed: {},
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

</style>
