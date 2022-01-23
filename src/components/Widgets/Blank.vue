<template>
<div class="placeholder-widget">
  <p>Error finding and mounting specified widget</p>
</div>
</template>

<script>
import WidgetMixin from '@/mixins/WidgetMixin';

export default {
  mixins: [WidgetMixin],
  mounted() {
    this.error('Unable to render widget of specified type');
  },
};
</script>

<style scoped lang="scss">
.placeholder-widget p {
  color: var(--danger);
  font-weight: bold;
}
</style>
