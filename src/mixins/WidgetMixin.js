import LoadingAnimation from '@/assets/interface-icons/loader.svg';

const WidgetMixin = {
  components: {
    LoadingAnimation,
  },
  props: {
    /* The options prop is an object of settings for a given widget */
    options: {
      type: Object,
      default: {},
    },
  },
  data: () => ({
    loading: true, // Indicates current loading status, to display spinner
  }),
  methods: {
    /* Overridden by widget component. Re-fetches and renders any external data  *
     * Called by parent component, and triggered either by user or time interval */
    update() {
      // eslint-disable-next-line no-console
      console.log('No update method configured for this widget');
    },
  },
  mounted() {
    // If the mounted function isn't overridden,then hide loader
    this.loading = false;
  },
};

export default WidgetMixin;
