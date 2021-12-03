<template>
  <div>
  <Collapsable
    :title="widget.name"
    :icon="widget.icon"
    :uniqueKey="groupId"
    :collapsed="displayData.collapsed"
    :cols="displayData.cols"
    :rows="displayData.rows"
    :color="displayData.color"
    :customStyles="displayData.customStyles"
  >
  <Clock v-if="widgetType === 'clock'" :options="widgetOptions" />
  <Weather v-else-if="widgetType === 'weather'" :options="widgetOptions" />
  </Collapsable>
  </div>
</template>

<script>
import Clock from '@/components/Widgets/Clock.vue';
import Weather from '@/components/Widgets/Weather.vue';
import Collapsable from '@/components/LinkItems/Collapsable.vue';

export default {
  name: 'Widget',
  components: {
    Collapsable,
    Weather,
    Clock,
  },
  props: {
    widget: Object,
    index: Number,
  },
  computed: {
    displayData() {
      return this.widget.displayData || {};
    },
    groupId() {
      return `widget-${this.index}`;
    },
    widgetType() {
      return this.widget.type.toLowerCase();
    },
    widgetOptions() {
      return this.widget.options || {};
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

</style>
