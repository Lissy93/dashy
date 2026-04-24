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
import { setSentryInstance } from '@/utils/logging/SentryRef';

const ErrorReporting = async (app, router) => {
  const appConfig = $store.getters.appConfig || {};
  if (!appConfig.enableErrorReporting) return;

  const appVersion = import.meta.env.VITE_APP_VERSION ? `Dashy@${import.meta.env.VITE_APP_VERSION}` : '';
  const Sentry = await import('@sentry/vue');
  const { Integrations } = await import('@sentry/tracing');
  const dsn = appConfig.sentryDsn || sentryDsn;

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

  setSentryInstance(Sentry);
};

export default ErrorReporting;
