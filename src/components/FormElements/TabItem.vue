<template>
  <div class="tab-item">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'TabItem',
  props: {
    name: { type: String, required: true },
  },
};
</script>
