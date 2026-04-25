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
    id: { type: String, default: '' },
    hidden: { type: Boolean, default: false },
  },
};
</script>
