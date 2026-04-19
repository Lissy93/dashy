<template>
  <footer v-if="visible && text" v-html="sanitizedText"></footer>
</template>

<script>

import { shouldBeVisible } from '@/utils/config/SectionHelpers';
import { sanitizeHtml } from '@/utils/Sanitizer';

export default {
  name: 'Footer',
  props: {
    text: String,
  },
  computed: {
    visible() {
      return shouldBeVisible(this.$route.name);
    },
    sanitizedText() {
      return this.text ? sanitizeHtml(this.text) : '';
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/styles/media-queries.scss';

footer {
  width: calc(100% - 0.5rem);
  bottom: 0;
  padding: 0.25rem;
  text-align: center;
  color: var(--medium-grey);
  opacity: var(--dimming-factor);
  background: var(--footer-background);
  margin-top: 1.5rem;
  border-top: 1px solid var(--outline-color);
}
:global(footer a) {
  color: var(--footer-text-color);
  &:hover {
    color: var(--footer-text-color-link);
  }
}
</style>
