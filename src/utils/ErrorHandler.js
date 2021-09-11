/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import * as Sentry from '@sentry/vue';
import { warningMsg } from '@/utils/CoolConsole';

/**
 * Function called when an error happens
 * Will call to function which prints helpful message to console
 * If error reporting is enabled, will also log the message to Sentry
 * If you wish to use your own error logging service, put code for it here
 */
const ErrorHandler = function handler(msg) {
  warningMsg(msg);
  Sentry.captureMessage(`[USER-WARN] ${msg || 'Uncaptured Message'}`);
};

export default ErrorHandler;
