/**
 * NOTE: No data is EVER sent to any external service without your explicit consent.
 * In the case of error reporting, Sentry will not even be initialized unless
 * you have purposely set appConfig.enableErrorReporting: true.
 * It is false by default.
 * You may want to enable error reporting if you have encountered a bug,
 * as access to the console errors enable it to be triaged an fixed effectively
 */

import $store from '@/store';
import { sentryDsn } from '@/utils/config/defaults';

const ErrorReporting = async (app, router) => {
  // Fetch users config
  const appConfig = $store.getters.appConfig || {};
  // Check if error reporting is enabled. Only proceed if user has turned it on.
  if (appConfig.enableErrorReporting) {
    // Get current app version
    const appVersion = import.meta.env.VITE_APP_VERSION ? `Dashy@${import.meta.env.VITE_APP_VERSION}` : '';
    // Import Sentry
    const { default: Sentry } = await import('@sentry/vue');
    const { Integrations } = await import('@sentry/tracing');
    // Get the Data Source Name for your or Dashy's Sentry instance
    const dsn = appConfig.sentryDsn || sentryDsn;
    // Initialize Sentry
    Sentry.init({
      app,
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
