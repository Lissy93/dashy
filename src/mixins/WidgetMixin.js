/**
 * Mixin that all pre-built and custom widgets extend from.
 * Manages loading state, error handling, data updates and user options
 */
import { Progress } from 'rsup-progress';
import request, { RequestError, ErrorTypes, classifyError } from '@/utils/request';
import ErrorHandler from '@/utils/ErrorHandler';
import { serviceEndpoints } from '@/utils/defaults';

const WidgetErrorTypes = ErrorTypes;

function formatWidgetError(errorInfo, useProxy = false) {
  const { type, message, status, statusText, data, originalMessage } = errorInfo;
  
  let formattedMessage = '';
  let errorCode = type;
  let details = {};

  switch (type) {
    case WidgetErrorTypes.NETWORK_ERROR:
      formattedMessage = useProxy
        ? `[Proxy Network Error] ${message}`
        : `[Network Error] ${message}`;
      details = { isProxyError: useProxy, originalMessage };
      break;

    case WidgetErrorTypes.HTTP_ERROR:
      formattedMessage = useProxy
        ? `[Proxy HTTP ${status}] ${message}`
        : `[HTTP ${status}] ${message}`;
      errorCode = `HTTP_${status}`;
      details = { isProxyError: useProxy, status, statusText, data };
      
      if (status === 401) {
        formattedMessage += ' - Authentication required. Check your API key or credentials.';
      } else if (status === 403) {
        formattedMessage += ' - Access forbidden. The server rejected your request.';
      } else if (status === 404) {
        formattedMessage += ' - Endpoint not found. Check the URL configuration.';
      } else if (status === 429) {
        formattedMessage += ' - Rate limit exceeded. Try again later.';
      } else if (status >= 500) {
        formattedMessage += ' - Server error. The target API is experiencing issues.';
      }
      break;

    case WidgetErrorTypes.TIMEOUT_ERROR:
      formattedMessage = useProxy
        ? `[Proxy Timeout] Request timed out. The server took too long to respond.`
        : `[Timeout] Request timed out. The server took too long to respond.`;
      details = { isProxyError: useProxy };
      break;

    case WidgetErrorTypes.CORS_ERROR:
      formattedMessage = `[CORS Error] ${message}`;
      details = { originalMessage, suggestUseProxy: true };
      break;

    case WidgetErrorTypes.JSON_PARSE_ERROR:
      formattedMessage = useProxy
        ? `[Proxy JSON Parse Error] ${message}`
        : `[JSON Parse Error] ${message}`;
      details = { isProxyError: useProxy };
      break;

    case WidgetErrorTypes.EMPTY_DATA:
      formattedMessage = useProxy
        ? `[Proxy Empty Data] ${message}`
        : `[Empty Data] ${message}`;
      details = { isProxyError: useProxy };
      break;

    case WidgetErrorTypes.PROXY_ERROR:
      formattedMessage = `[Proxy Error] ${message}`;
      details = { isProxyError: true };
      break;

    case WidgetErrorTypes.TARGET_ERROR:
      formattedMessage = `[Target Error] ${message}`;
      details = { isProxyError: false, isTargetError: true };
      break;

    default:
      formattedMessage = useProxy
        ? `[Proxy Error] ${message || 'Unknown error occurred'}`
        : `[Error] ${message || 'Unknown error occurred'}`;
      details = { isProxyError: useProxy };
  }

  return {
    message: formattedMessage,
    type: errorCode,
    details,
    rawError: errorInfo,
  };
}

function classifyProxyResponse(responseData, useProxy) {
  if (!useProxy) {
    return { isProxyError: false, response: responseData };
  }

  if (responseData && responseData.success === false) {
    const errorType = responseData.errorType;
    const details = responseData.details || {};
    
    if (errorType === 'PROXY_VALIDATION_ERROR' || errorType === 'PROXY_CONFIG_ERROR') {
      return {
        isProxyError: true,
        isTargetError: false,
        errorType: WidgetErrorTypes.PROXY_ERROR,
        message: responseData.message,
        response: responseData,
        details,
      };
    }
    
    if (errorType === 'TARGET_HTTP_ERROR') {
      return {
        isProxyError: false,
        isTargetError: true,
        errorType: WidgetErrorTypes.HTTP_ERROR,
        status: details.status,
        statusText: details.statusText,
        message: responseData.message,
        response: responseData,
        details,
      };
    }
    
    if (errorType === 'TARGET_TIMEOUT_ERROR') {
      return {
        isProxyError: true,
        isTargetError: true,
        errorType: WidgetErrorTypes.TIMEOUT_ERROR,
        message: responseData.message,
        response: responseData,
        details,
      };
    }
    
    if (errorType === 'TARGET_NETWORK_ERROR') {
      return {
        isProxyError: true,
        isTargetError: true,
        errorType: WidgetErrorTypes.NETWORK_ERROR,
        message: responseData.message,
        response: responseData,
        details,
      };
    }
    
    return {
      isProxyError: true,
      isTargetError: true,
      errorType: WidgetErrorTypes.TARGET_ERROR,
      message: responseData.message,
      response: responseData,
      details,
    };
  }

  if (responseData && responseData.error) {
    const errorData = responseData.error;
    if (typeof errorData === 'object') {
      if (errorData.code === 'ECONNABORTED' || errorData.message?.includes('timeout')) {
        return {
          isProxyError: true,
          isTargetError: true,
          errorType: WidgetErrorTypes.TIMEOUT_ERROR,
          response: responseData,
        };
      }
      if (errorData.status || errorData.code >= 400) {
        return {
          isProxyError: false,
          isTargetError: true,
          errorType: WidgetErrorTypes.HTTP_ERROR,
          status: errorData.status || errorData.code,
          statusText: errorData.statusText,
          response: responseData,
        };
      }
      return {
        isProxyError: true,
        isTargetError: true,
        errorType: WidgetErrorTypes.TARGET_ERROR,
        response: responseData,
        message: errorData.message,
      };
    }
    return {
      isProxyError: true,
      isTargetError: false,
      errorType: WidgetErrorTypes.PROXY_ERROR,
      response: responseData,
      message: errorData,
    };
  }

  return { isProxyError: false, response: responseData };
}

const WidgetMixin = {
  props: {
    options: {
      type: Object,
      default: {},
    },
  },
  data: () => ({
    progress: new Progress({ color: 'var(--progress-bar)' }),
    overrideProxyChoice: false,
    overrideUpdateInterval: null,
    disableLoader: false, // Prevent ever showing the loader
    updater: null, // Stores interval
    defaultTimeout: 50000,
  }),
  /* When component mounted, fetch initial data */
  mounted() {
    this.fetchData();
    if (this.updateInterval) {
      this.continuousUpdates();
      this.disableLoader = true;
    }
  },
  beforeDestroy() {
    if (this.updater) {
      clearInterval(this.updater);
    }
  },
  computed: {
    proxyReqEndpoint() {
      const baseUrl = process.env.VUE_APP_DOMAIN || window.location.origin;
      return `${baseUrl}${serviceEndpoints.corsProxy}`;
    },
    useProxy() {
      return this.options.useProxy || this.overrideProxyChoice;
    },
    /* Returns either a number in ms to continuously update widget data. Or 0 for no updates */
    updateInterval() {
      const usersInterval = this.options.updateInterval;
      if (usersInterval === null && this.overrideUpdateInterval) {
        return this.overrideUpdateInterval * 1000;
      }
      if (!usersInterval) return 0;
      // If set to `true`, then default to 30 seconds
      if (typeof usersInterval === 'boolean') return 30 * 1000;
      // If set to a number, and within valid range, return user choice
      if (typeof usersInterval === 'number'
        && usersInterval >= 2
        && usersInterval <= 7200) {
        return usersInterval * 1000;
      }
      return 0;
    },
  },
  methods: {
    /* Re-fetches external data, called by parent. Usually overridden by widget */
    update() {
      this.startLoading();
      this.fetchData();
    },
    /* If continuous updates enabled, create interval */
    continuousUpdates() {
      this.updater = setInterval(() => { this.update(); }, this.updateInterval);
    },
    /* Called when an error occurs. Logs to handler, and passes to parent component */
    error(msg, stackTrace, quite = false) {
      ErrorHandler(msg, stackTrace);
      if (!this.options.ignoreErrors && !quite) {
        this.$emit('error', msg);
      }
    },
    /* When a data request update starts, show loader */
    startLoading() {
      if (!this.disableLoader) {
        this.$emit('loading', true);
        this.progress.start();
      }
    },
    /* When a data request finishes, hide loader */
    finishLoading() {
      this.$emit('loading', false);
      setTimeout(() => { this.progress.end(); }, 500);
    },
    /* Overridden by child component. Will make network request, then end loader */
    fetchData() {
      this.finishLoading();
    },
    /* Used as v-tooltip, pass text content in, and will show on hover */
    tooltip(content, html = false) {
      return {
        content, html, trigger: 'hover focus', delay: 250,
      };
    },
    /* Makes data request, returns promise */
    makeRequest(endpoint, options, protocol, body) {
      const method = protocol || 'GET';
      const url = this.useProxy ? this.proxyReqEndpoint : endpoint;
      const data = JSON.stringify(body || {});
      const CustomHeaders = options || null;
      const headers = this.useProxy
        ? { 'Target-URL': endpoint, CustomHeaders: JSON.stringify(CustomHeaders) } : CustomHeaders;
      const timeout = this.options.timeout || this.defaultTimeout;
      const requestConfig = {
        method, url, headers, data, timeout,
      };
      
      const currentUseProxy = this.useProxy;
      const targetEndpoint = endpoint;

      return new Promise((resolve, reject) => {
        request(requestConfig)
          .then((response) => {
            const responseData = response.data;
            
            const proxyAnalysis = classifyProxyResponse(responseData, currentUseProxy);
            
            if (proxyAnalysis.isProxyError || proxyAnalysis.isTargetError) {
              let errorInfo;
              
              if (proxyAnalysis.errorType === WidgetErrorTypes.HTTP_ERROR) {
                errorInfo = {
                  type: WidgetErrorTypes.HTTP_ERROR,
                  message: proxyAnalysis.statusText || `HTTP ${proxyAnalysis.status}`,
                  status: proxyAnalysis.status,
                  statusText: proxyAnalysis.statusText,
                  data: responseData,
                };
              } else if (proxyAnalysis.errorType === WidgetErrorTypes.TIMEOUT_ERROR) {
                errorInfo = {
                  type: WidgetErrorTypes.TIMEOUT_ERROR,
                  message: 'Request timed out while proxying to target server',
                };
              } else if (proxyAnalysis.message) {
                errorInfo = {
                  type: proxyAnalysis.errorType || WidgetErrorTypes.TARGET_ERROR,
                  message: proxyAnalysis.message,
                };
              } else {
                errorInfo = {
                  type: WidgetErrorTypes.TARGET_ERROR,
                  message: proxyAnalysis.proxyMessage || 'Target server returned an error',
                };
              }
              
              const formattedError = formatWidgetError(errorInfo, currentUseProxy);
              formattedError.details.targetUrl = targetEndpoint;
              
              this.error(formattedError.message, { ...formattedError, responseData });
              reject(formattedError);
              return;
            }
            
            let dataToResolve = responseData;
            
            if (currentUseProxy && responseData && typeof responseData === 'object') {
              if (responseData.data !== undefined) {
                dataToResolve = responseData.data;
              }
            }
            
            if (dataToResolve === null || dataToResolve === undefined) {
              const errorInfo = {
                type: WidgetErrorTypes.EMPTY_DATA,
                message: 'The server returned null or undefined data',
              };
              const formattedError = formatWidgetError(errorInfo, currentUseProxy);
              this.error(formattedError.message, formattedError);
              reject(formattedError);
              return;
            }
            
            if (dataToResolve === '' || (typeof dataToResolve === 'object' && Object.keys(dataToResolve).length === 0 && !Array.isArray(dataToResolve))) {
              const errorInfo = {
                type: WidgetErrorTypes.EMPTY_DATA,
                message: 'The server returned empty data. Check if the endpoint is correct and returns the expected data format.',
              };
              const formattedError = formatWidgetError(errorInfo, currentUseProxy);
              this.error(formattedError.message, formattedError);
              reject(formattedError);
              return;
            }
            
            resolve(dataToResolve);
          })
          .catch((dataFetchError) => {
            let errorInfo;
            
            if (dataFetchError instanceof RequestError) {
              if (dataFetchError.code === 'ECONNABORTED') {
                errorInfo = {
                  type: WidgetErrorTypes.TIMEOUT_ERROR,
                  message: dataFetchError.message,
                };
              } else if (dataFetchError.response) {
                errorInfo = {
                  type: WidgetErrorTypes.HTTP_ERROR,
                  message: `HTTP ${dataFetchError.response.status}: ${dataFetchError.response.statusText}`,
                  status: dataFetchError.response.status,
                  statusText: dataFetchError.response.statusText,
                  data: dataFetchError.response.data,
                };
              } else if (dataFetchError.request) {
                const errorMsg = dataFetchError.message || '';
                if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
                  errorInfo = {
                    type: WidgetErrorTypes.NETWORK_ERROR,
                    message: currentUseProxy
                      ? 'Unable to connect to the proxy server. Check if Dashy server is running and accessible.'
                      : 'Unable to connect to the target server. This may be due to CORS restrictions, network outage, or the server is unreachable.',
                    originalMessage: errorMsg,
                  };
                } else if (errorMsg.includes('CORS') || errorMsg.includes('Access-Control')) {
                  errorInfo = {
                    type: WidgetErrorTypes.CORS_ERROR,
                    message: 'The target server does not allow cross-origin requests. Try enabling useProxy: true in your widget configuration.',
                    originalMessage: errorMsg,
                  };
                } else {
                  errorInfo = {
                    type: WidgetErrorTypes.NETWORK_ERROR,
                    message: errorMsg,
                    originalMessage: errorMsg,
                  };
                }
              } else {
                errorInfo = classifyError(dataFetchError);
              }
            } else if (dataFetchError && dataFetchError.type) {
              errorInfo = dataFetchError;
            } else {
              errorInfo = {
                type: WidgetErrorTypes.UNKNOWN_ERROR,
                message: dataFetchError?.message || 'Unknown error occurred during request',
                originalError: dataFetchError,
              };
            }
            
            const formattedError = formatWidgetError(errorInfo, currentUseProxy);
            formattedError.details.targetUrl = targetEndpoint;
            formattedError.rawError = dataFetchError;
            
            this.error(formattedError.message, formattedError);
            reject(formattedError);
          })
          .finally(() => {
            this.finishLoading();
          });
      });
    },
    /* Check if a value is an environment variable, return its value if so. */
    parseAsEnvVar(str) {
      if (typeof str !== 'string') return str;
      if (str.includes('VUE_APP_')) {
        const envVar = process.env[str];
        if (!envVar) {
          this.error(`Environment variable ${str} not found`);
        } else {
          return envVar;
        }
      }
      return str;
    },
  },
};

export default WidgetMixin;
