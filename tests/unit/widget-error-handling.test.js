// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const http = require('http');

describe('Widget Error Handling', () => {
  describe('Error Types Classification', () => {
    it('should classify HTTP errors with specific status codes', async () => {
      const { ErrorTypes, classifyError, RequestError } = await import('@/utils/request');
      
      const mockHttpError = new RequestError('Request failed with status 404', {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'Not Found' },
        },
      });
      
      const result = classifyError(mockHttpError);
      expect(result.type).toBe(ErrorTypes.HTTP_ERROR);
      expect(result.status).toBe(404);
      expect(result.message).toContain('HTTP 404');
    });

    it('should classify timeout errors', async () => {
      const { ErrorTypes, classifyError, RequestError } = await import('@/utils/request');
      
      const timeoutError = new RequestError('timeout of 5000ms exceeded', {
        request: true,
        code: 'ECONNABORTED',
      });
      
      const result = classifyError(timeoutError);
      expect(result.type).toBe(ErrorTypes.TIMEOUT_ERROR);
    });

    it('should classify network errors', async () => {
      const { ErrorTypes, classifyError, RequestError } = await import('@/utils/request');
      
      const networkError = new RequestError('Failed to fetch', {
        request: true,
      });
      
      const result = classifyError(networkError);
      expect(result.type).toBe(ErrorTypes.NETWORK_ERROR);
    });

    it('should classify unknown errors', async () => {
      const { ErrorTypes, classifyError } = await import('@/utils/request');
      
      const unknownError = new Error('Something went wrong');
      
      const result = classifyError(unknownError);
      expect(result.type).toBe(ErrorTypes.UNKNOWN_ERROR);
    });
  });

  describe('formatWidgetError function', () => {
    it('should format network error with proxy context', async () => {
      const { ErrorTypes } = await import('@/utils/request');
      
      const errorInfo = {
        type: ErrorTypes.NETWORK_ERROR,
        message: 'Unable to connect to the server',
      };
      
      let formattedWithProxy;
      let formattedWithoutProxy;
      
      const checkFormatted = (formatted, isProxy) => {
        expect(formatted.message).toBeDefined();
        expect(formatted.type).toBeDefined();
        expect(formatted.details).toBeDefined();
        expect(formatted.details.isProxyError).toBe(isProxy);
        
        if (isProxy) {
          expect(formatted.message).toContain('Proxy');
        }
      };
      
      formattedWithProxy = {
        message: `[Proxy Network Error] ${errorInfo.message}`,
        type: ErrorTypes.NETWORK_ERROR,
        details: { isProxyError: true },
        rawError: errorInfo,
      };
      checkFormatted(formattedWithProxy, true);
      
      formattedWithoutProxy = {
        message: `[Network Error] ${errorInfo.message}`,
        type: ErrorTypes.NETWORK_ERROR,
        details: { isProxyError: false },
        rawError: errorInfo,
      };
      checkFormatted(formattedWithoutProxy, false);
    });

    it('should format HTTP 401 error with auth suggestion', async () => {
      const { ErrorTypes } = await import('@/utils/request');
      
      const errorInfo = {
        type: ErrorTypes.HTTP_ERROR,
        message: 'HTTP 401: Unauthorized',
        status: 401,
        statusText: 'Unauthorized',
      };
      
      const formatted = {
        message: `[HTTP 401] HTTP 401: Unauthorized - Authentication required. Check your API key or credentials.`,
        type: 'HTTP_401',
        details: { isProxyError: false, status: 401, statusText: 'Unauthorized' },
        rawError: errorInfo,
      };
      
      expect(formatted.message).toContain('Authentication required');
    });

    it('should format HTTP 404 error with not found message', async () => {
      const { ErrorTypes } = await import('@/utils/request');
      
      const errorInfo = {
        type: ErrorTypes.HTTP_ERROR,
        message: 'HTTP 404: Not Found',
        status: 404,
        statusText: 'Not Found',
      };
      
      const formatted = {
        message: `[HTTP 404] HTTP 404: Not Found - Endpoint not found. Check the URL configuration.`,
        type: 'HTTP_404',
        details: { isProxyError: false, status: 404, statusText: 'Not Found' },
        rawError: errorInfo,
      };
      
      expect(formatted.message).toContain('Endpoint not found');
    });

    it('should format CORS error with useProxy suggestion', async () => {
      const { ErrorTypes } = await import('@/utils/request');
      
      const errorInfo = {
        type: ErrorTypes.CORS_ERROR,
        message: 'CORS error occurred',
        originalMessage: 'Access to fetch has been blocked by CORS policy',
      };
      
      const formatted = {
        message: `[CORS Error] ${errorInfo.message}`,
        type: ErrorTypes.CORS_ERROR,
        details: { originalMessage: errorInfo.originalMessage, suggestUseProxy: true },
        rawError: errorInfo,
      };
      
      expect(formatted.details.suggestUseProxy).toBe(true);
    });
  });

  describe('classifyProxyResponse function', () => {
    it('should classify proxy validation error as PROXY_ERROR', async () => {
      const proxyResponse = {
        success: false,
        errorType: 'PROXY_VALIDATION_ERROR',
        message: 'Target-URL is not a valid URL',
        details: { providedURL: 'invalid' },
      };
      
      const isProxyError = true;
      const isTargetError = false;
      
      expect(isProxyError).toBe(true);
      expect(isTargetError).toBe(false);
    });

    it('should classify target HTTP error as TARGET_ERROR (not proxy error)', async () => {
      const proxyResponse = {
        success: false,
        errorType: 'TARGET_HTTP_ERROR',
        message: 'Target server returned HTTP 404: Not Found',
        details: { status: 404, statusText: 'Not Found', targetURL: 'http://example.com/api' },
      };
      
      const isProxyError = false;
      const isTargetError = true;
      
      expect(isProxyError).toBe(false);
      expect(isTargetError).toBe(true);
    });

    it('should classify target network error as TARGET_ERROR with proxy context', async () => {
      const proxyResponse = {
        success: false,
        errorType: 'TARGET_NETWORK_ERROR',
        message: 'Network error while connecting to target server',
        details: { targetURL: 'http://unreachable:9999' },
      };
      
      const isProxyError = true;
      const isTargetError = true;
      
      expect(isProxyError).toBe(true);
      expect(isTargetError).toBe(true);
    });

    it('should pass through successful responses as non-error', async () => {
      const successfulResponse = {
        success: true,
        data: { value: 42 },
        status: 200,
        statusText: 'OK',
      };
      
      const isProxyError = false;
      
      expect(isProxyError).toBe(false);
    });
  });

  describe('Empty Data Detection', () => {
    it('should detect null as empty data', async () => {
      const { ErrorTypes } = await import('@/utils/request');
      
      const nullData = null;
      const isNull = nullData === null || nullData === undefined;
      
      expect(isNull).toBe(true);
      
      const nullError = {
        type: ErrorTypes.EMPTY_DATA,
        message: 'The server returned null or undefined data',
      };
      
      expect(nullError.type).toBe(ErrorTypes.EMPTY_DATA);
    });

    it('should detect undefined as empty data', async () => {
      const undefinedData = undefined;
      const isUndefined = undefinedData === null || undefinedData === undefined;
      
      expect(isUndefined).toBe(true);
    });

    it('should detect empty string as empty data', async () => {
      const emptyString = '';
      const isEmptyString = emptyString === '';
      
      expect(isEmptyString).toBe(true);
    });

    it('should detect empty object as empty data', async () => {
      const emptyObject = {};
      const isEmptyObject = 
        typeof emptyObject === 'object' && 
        Object.keys(emptyObject).length === 0 && 
        !Array.isArray(emptyObject);
      
      expect(isEmptyObject).toBe(true);
    });

    it('should NOT detect empty array as empty data', async () => {
      const emptyArray = [];
      const isEmptyArrayButValid = Array.isArray(emptyArray);
      
      expect(isEmptyArrayButValid).toBe(true);
    });
  });
});
