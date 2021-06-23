<template>
  <div>
    <div class="display-options">
      <IconLogout @click="logout()" v-tooltip="tooltip('Sign Out')"
        class="layout-icon" tabindex="-2" />
    </div>
  </div>
</template>

<script>
import { logout as registerLogout } from '@/utils/Auth';
import IconLogout from '@/assets/interface-icons/user-logout.svg';

export default {
  name: 'AppButtons',
  components: {
    IconLogout,
  },
  methods: {
    logout() {
      registerLogout();
      this.$toasted.show('Logged Out');
      setTimeout(() => {
        location.reload(true); // eslint-disable-line no-restricted-globals
      }, 500);
    },
    tooltip(content) {
      return { content, trigger: 'hover focus', delay: 250 };
    },
  },
};
</script>

<style scoped lang="scss">

span.options-label {
  color: var(--settings-text-color);
}

.display-options {
  color: var(--settings-text-color);
  svg {
    path {
      fill: var(--settings-text-color);
    }
    width: 1rem;
    height: 1rem;
    margin: 0.2rem;
    padding: 0.2rem;
    text-align: center;
    background: var(--background);
    border: 1px solid currentColor;
    border-radius: var(--curve-factor);
    cursor: pointer;
    &:hover, &.selected {
      background: var(--settings-text-color);
      path { fill: var(--background); }
    }
  }
}

</style>
