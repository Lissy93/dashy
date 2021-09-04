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
import { sentryDsn } from '@/utils/defaults';

const ErrorReporting = (Vue, router) => {
  // Fetch users config
  const appConfig = new ConfigAccumulator().appConfig() || {};
  // Check if error reporting is enabled. Only proceed if user has turned it on.
  if (appConfig.enableErrorReporting) {
    // Get current app version
    const appVersion = process.env.VUE_APP_VERSION ? `Dashy@${process.env.VUE_APP_VERSION}` : '';
    // Import Sentry
    const Sentry = require('@sentry/vue');
    const { Integrations } = require('@sentry/tracing');
    // Get the Data Source Name for your or Dashy's Sentry instance
    const dsn = appConfig.sentryDsn || sentryDsn;
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
      release: appVersion,
    });
  } else {
    // Error reporting has not been enabled by the user. Do Nothing.
  }
};

export default ErrorReporting;
