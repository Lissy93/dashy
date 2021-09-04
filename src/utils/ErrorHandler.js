/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import * as Sentry from '@sentry/vue';
import { warningMsg } from '@/utils/CoolConsole';

/**
 * Function called when an error happens
 * If you wish to use an error logging service, put code for it here
 */
const ErrorHandler = function handler(msg) {
  warningMsg(msg);
  Sentry.captureMessage(msg);
};

export default ErrorHandler;
