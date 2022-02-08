/** Reusable mixin for items */
import { openingMethod as defaultOpeningMethod } from '@/utils/defaults';

export default {
  computed: {
    appConfig() {
      return this.$store.getters.appConfig;
    },
    isEditMode() {
      return this.$store.state.editMode;
    },
    accumulatedTarget() {
      return this.target || this.appConfig.defaultOpeningMethod || defaultOpeningMethod;
    },
    /* Convert config target value, into HTML anchor target attribute */
    anchorTarget() {
      if (this.isEditMode) return '_self';
      const target = this.accumulatedTarget;
      switch (target) {
        case 'sametab': return '_self';
        case 'newtab': return '_blank';
        case 'parent': return '_parent';
        case 'top': return '_top';
        default: return undefined;
      }
    },
    /* Get href for anchor, if not in edit mode, or opening in modal/ workspace */
    hyperLinkHref() {
      const nothing = '#';
      const url = this.url || nothing;
      if (this.isEditMode) return nothing;
      const noAnchorNeeded = ['modal', 'workspace', 'clipboard'];
      return noAnchorNeeded.includes(this.accumulatedTarget) ? nothing : url;
    },
  },
  methods: {},
};
