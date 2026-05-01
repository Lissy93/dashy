/**
 * Handle for lazy-loading Sentry
 * So we never load Sentry unless the user has explicitly enabled error reporting
 */

let sentryInstance = null;

export const setSentryInstance = (instance) => {
  sentryInstance = instance;
};

export const reportError = (msg) => {
  if (sentryInstance) sentryInstance.captureMessage(msg);
};
