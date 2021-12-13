/**
 * Mixin that all pre-built and custom widgets extend from.
 * Manages loading state, error handling and data updates.
 */
import ProgressBar from 'rsup-progress';
import ErrorHandler from '@/utils/ErrorHandler';

const WidgetMixin = {
  props: {
    options: {
      type: Object,
      default: {},
    },
  },
  data: () => ({
    progress: new ProgressBar({ color: 'var(--progress-bar)' }),
  }),
  methods: {
    /* Re-fetches external data, called by parent. Usually overridden by widget */
    update() {
      console.log('No update method configured for this widget'); // eslint-disable-line no-console
    },
    /* Called when an error occurs. Logs to handler, and passes to parent component */
    error(msg, stackTrace) {
      ErrorHandler(msg, stackTrace);
      this.$emit('error', msg);
    },
    /* When a data request update starts, show loader */
    startLoading() {
      this.$emit('loading', true);
      this.progress.start();
    },
    /* When a data request finishes, hide loader */
    finishLoading() {
      this.$emit('loading', false);
      setTimeout(() => { this.progress.end(); }, 500);
    },
  },
};

export default WidgetMixin;
