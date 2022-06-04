import * as Sentry from '@sentry/vue';
import { warningMsg, statusMsg, statusErrorMsg } from '@/utils/CoolConsole';
import { sessionStorageKeys } from '@/utils/defaults';

/* Makes the current time, like hh:mm:ss */
const makeTime = () => {
  const now = new Date();
  const pad = (digit) => String(digit).padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

/* Appends recent errors to local storage, for viewing in the UI */
const appendToErrorLog = (msg) => {
  let errorLog = sessionStorage.getItem(sessionStorageKeys.ERROR_LOG) || '';
  errorLog += `[${makeTime()}] ${msg}\n`;
  sessionStorage.setItem(sessionStorageKeys.ERROR_LOG, errorLog);
};

/**
 * Function called when an error happens
 * Will call to function which prints helpful message to console
 * If error reporting is enabled, will also log the message to Sentry
 * If you wish to use your own error logging service, put code for it here
 */
const ErrorHandler = function handler(msg, errorStack) {
  // Print to console
  warningMsg(msg, errorStack);
  // Save to local storage
  appendToErrorLog(msg);
  // Report to bug tracker (if enabled)
  Sentry.captureMessage(`[USER-WARN] ${msg}`);
};

/* Similar to error handler, but for recording general info */
export const InfoHandler = (msg, title) => {
  statusMsg(title || 'Info', msg);
};

/* Outputs warnings caused by the user, such as missing field */
export const WarningInfoHandler = (msg, title, log) => {
  statusErrorMsg(title || 'Warning', msg, log);
};

/* Titles for info logging */
export const InfoKeys = {
  AUTH: 'Authentication',
  CLOUD_BACKUP: 'Cloud Backup & Restore',
  EDITOR: 'Interactive Editor',
  RAW_EDITOR: 'Raw Config Editor',
  VISUAL: 'Layout & Styles',
};

export default ErrorHandler;
