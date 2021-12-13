import ProgressBar from 'rsup-progress';
import ErrorHandler from '@/utils/ErrorHandler';
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
    progress: new ProgressBar({ color: 'var(--progress-bar)' }),
  }),
  methods: {
    /* Overridden by widget component. Re-fetches and renders any external data  *
     * Called by parent component, and triggered either by user or time interval */
    update() {
      // eslint-disable-next-line no-console
      console.log('No update method configured for this widget');
    },
    /* Called when an error occurs */
    error(msg, stackTrace) {
      ErrorHandler(msg, stackTrace);
      this.$emit('error', msg);
    },
    /* When a data request update starts, show loader */
    startLoading() {
      this.loading = true;
      this.progress.start();
    },
    /* When a data request finishes, hide loader */
    finishLoading() {
      this.loading = false;
      setTimeout(() => { this.progress.end(); }, 500);
    },
  },
  mounted() {
    // If the mounted function isn't overridden,then hide loader
    this.loading = false;
  },
};

export default WidgetMixin;
