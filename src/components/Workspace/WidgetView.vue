<template>
  <div class="workspace-widget-view" v-if="widgets">
    <WidgetBase
      v-for="(widget, widgetIndx) in widgets"
      :key="widgetIndx"
      :widget="widget"
      :index="widgetIndx"
      class="workspace-widget"
    />
  </div>
</template>

<script>
import WidgetBase from '@/components/Widgets/WidgetBase';

export default {
  components: {
    WidgetBase,
  },
  props: {
    widgets: Array,
  },
};
</script>

<style lang="scss" scoped>
.workspace-widget-view {
  padding: 1rem 0;
  background: var(--background);
  position: absolute;
  left: var(--side-bar-width);
  height: calc(100% - var(--header-height) - 1rem);
  width: calc(100% - var(--side-bar-width));
  .workspace-widget {
    max-width: 800px;
    margin: 0.5rem auto 1rem auto;
  }
}
</style>
