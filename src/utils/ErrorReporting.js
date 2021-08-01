/**
 * NOTE: No data is EVER sent to any external service without your explicit consent.
 * In the case of error reporting, Sentry will not even be initialized unless
 * you have purposely set appConfig.enableErrorReporting: true.
 * It is false by default.
 * You may want to enable error reporting if you have encountered a bug,
 * as access to the console errors enable it to be triaged an fixed effectively
 */

/* eslint-disable global-require */

import ConfigAccumulator from '@/utils/ConfigAccumalator';

const ErrorTracking = (Vue, router) => {
  // Fetch users config
  const appConfig = new ConfigAccumulator().appConfig() || {};
  // Check if error reporting is enabled. Only proceed if user has turned it on.
  if (appConfig.enableErrorReporting) {
    // Import Sentry
    const Sentry = require('@sentry/vue');
    const { Integrations } = require('@sentry/tracing');
    const dsn = 'https://3138ea85f15a4fa883a5b27a4dc8ee28@o937511.ingest.sentry.io/5887934';
    // Initialize Sentry
    Sentry.init({
      Vue,
      dsn,
      integrations: [
        new Integrations.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        }),
      ],
      tracesSampleRate: 1.0,
    });
  } else {
    // Error reporting not enabled. Do Nothing.
  }
};

export default ErrorTracking;
