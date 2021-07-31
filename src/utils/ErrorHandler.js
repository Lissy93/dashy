/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import { warningMsg, raiseBug } from '@/utils/CoolConsole';

/**
 * Function called when an error happens
 * If you wish to use an error logging service, put code for it here
 */
const ErrorHandler = function handler(msg) {
  warningMsg();
  console.warn(msg);
  raiseBug();
};

export default ErrorHandler;
