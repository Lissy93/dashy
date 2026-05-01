<template>
  <div>
    <span class="options-label">{{ $t('settings.layout-label') }}</span>
    <div class="display-options">
      <IconDeafault
        @click="updateDisplayLayout('auto')"
        v-tooltip="tooltip($t('settings.layout-auto'))"
        :class="`layout-icon ${layout === 'auto' ? 'selected' : ''}`"
        tabindex="-2"
      />
      <IconHorizontal
        @click="updateDisplayLayout('horizontal')"
        v-tooltip="tooltip($t('settings.layout-horizontal'))"
        :class="`layout-icon ${layout === 'horizontal' ? 'selected' : ''}`"
        tabindex="-2"
      />
      <IconVertical
        @click="updateDisplayLayout('vertical')"
        v-tooltip="tooltip($t('settings.layout-vertical'))"
        :class="`layout-icon ${layout === 'vertical' ? 'selected' : ''}`"
        tabindex="-2"
      />
      <IconMasonry
        @click="updateDisplayLayout('masonry')"
        v-tooltip="tooltip($t('settings.layout-masonry'))"
        :class="`layout-icon ${layout === 'masonry' ? 'selected' : ''}`"
        tabindex="-2"
      />
    </div>
  </div>
</template>

<script>
import StoreKeys from '@/utils/StoreMutations';
import IconDeafault from '@/assets/interface-icons/layout-default.svg';
import IconHorizontal from '@/assets/interface-icons/layout-horizontal.svg';
import IconVertical from '@/assets/interface-icons/layout-vertical.svg';
import IconMasonry from '@/assets/interface-icons/layout-masonry.svg';

export default {
  name: 'LayoutSelector',
  components: {
    IconDeafault,
    IconHorizontal,
    IconVertical,
    IconMasonry,
  },
  computed: {
    layout() {
      return this.$store.getters.layout;
    },
  },
  methods: {
    updateDisplayLayout(layout) {
      this.$store.commit(StoreKeys.SET_ITEM_LAYOUT, layout);
    },
    tooltip(content) {
      return { content };
    },
  },
};
</script>

