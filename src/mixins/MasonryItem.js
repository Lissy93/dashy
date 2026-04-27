/**
 * Lets a direct child of `.item-group-container.orientation-masonry` participate
 * in the masonry grid. Measures its root element's height + vertical margins,
 * converts to a `grid-row: span N` value against the container's
 * `grid-auto-rows` unit, and keeps it in sync via a ResizeObserver.
 *
 * Usage: add to a component's `mixins`, then bind `masonryStyle` (a string
 * of inline CSS, empty when the current layout isn't masonry) to the root
 * element's `:style` attribute.
 */
export default {
  data: () => ({
    masonryRowSpan: 0,
    masonryResizeObserver: null,
  }),
  computed: {
    isMasonry() {
      return this.$store.getters.layout === 'masonry';
    },
    masonryStyle() {
      if (!this.isMasonry || !this.masonryRowSpan) return '';
      return `grid-row: span ${this.masonryRowSpan}`;
    },
  },
  mounted() {
    this.updateMasonrySpan();
    this.setupMasonryObserver();
  },
  beforeUnmount() {
    if (this.masonryResizeObserver) {
      this.masonryResizeObserver.disconnect();
      this.masonryResizeObserver = null;
    }
  },
  methods: {
    updateMasonrySpan() {
      const el = this.$el;
      if (!el || !el.parentElement) return;
      const parentStyle = getComputedStyle(el.parentElement);
      const rowUnit = parseFloat(parentStyle.gridAutoRows) || 8;
      const style = getComputedStyle(el);
      const marginY = (parseFloat(style.marginTop) || 0)
        + (parseFloat(style.marginBottom) || 0);
      const total = el.offsetHeight + marginY;
      this.masonryRowSpan = Math.max(1, Math.ceil(total / rowUnit));
    },
    setupMasonryObserver() {
      if (typeof ResizeObserver === 'undefined' || !this.$el) return;
      this.masonryResizeObserver = new ResizeObserver(() => this.updateMasonrySpan());
      this.masonryResizeObserver.observe(this.$el);
    },
  },
};
