<template>
  <div class="error">
    <p>
      Error: Configuration has been disabled on this instance.
      Please contact your administrator for more information.
    </p>
  </div>
</template>

<script>

import ErrorHandler from '@/utils/ErrorHandler';

export default {
  name: 'AccessError',
  mounted() {
    ErrorHandler('Access Error: Config has been disabled on this instance');
  },
};
</script>

<style scoped lang="scss">
.error {
  padding: 0.5rem 1rem;
  min-width: 20rem;
  width: 50%;
  margin: 2rem auto;
  cursor: default;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--warning);
  border-radius: var(--curve-factor);
  border: 1px dashed var(--warning);
  background: var(--background);
}
</style>
