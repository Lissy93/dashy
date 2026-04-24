// @vitest-environment node
import { describe, it, expect } from 'vitest';
import request from 'supertest';

const app = require('../../services/app');

describe('CORS proxy', () => {
  describe('Validation errors (PROXY_VALIDATION_ERROR)', () => {
    it('rejects missing Target-URL', async () => {
      const res = await request(app).get('/cors-proxy');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_CONFIG_ERROR');
      expect(res.body.message).toContain('Target-URL');
    });

    it('rejects invalid URL', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'not-a-url');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
    });

    it('rejects file:// scheme', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'file:///etc/passwd');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
      expect(res.body.message).toContain('http');
    });

    it('rejects ftp:// scheme', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'ftp://x.com');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
    });

    it('blocks cloud metadata IPv4', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://169.254.169.254/');
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
      expect(res.body.message).toContain('blocked');
    });

    it('blocks cloud metadata decimal bypass', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://2852039166/');
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
    });

    it('blocks GCP metadata DNS', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://metadata.google.internal/');
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
    });

    it('blocks Alibaba metadata', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://100.100.100.200/');
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
    });

    it('blocks gopher:// scheme', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'gopher://evil:70/');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
    });

    it('blocks IPv4-mapped IPv6 metadata', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://[::ffff:169.254.169.254]/');
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
    });

    it('blocks AWS IPv6 metadata', async () => {
      const res = await request(app).get('/cors-proxy').set('Target-URL', 'http://[fd00:ec2::254]/');
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
    });

    it('rejects malformed CustomHeaders', async () => {
      const res = await request(app)
        .get('/cors-proxy')
        .set('Target-URL', 'http://example.com')
        .set('CustomHeaders', '{bad');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorType).toBe('PROXY_CONFIG_ERROR');
      expect(res.body.message).toContain('malformed JSON');
    });
  });

  describe('Standard functionality', () => {
    it('accepts POST method (needed for proxying APIs)', async () => {
      const res = await request(app).post('/cors-proxy').set('Target-URL', 'http://169.254.169.254/');
      expect(res.status).toBe(403);
      expect(res.body.errorType).toBe('PROXY_VALIDATION_ERROR');
    });

    it('handles OPTIONS preflight', async () => {
      const res = await request(app)
        .options('/cors-proxy')
        .set('Origin', 'http://localhost')
        .set('Access-Control-Request-Method', 'GET');
      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });
  });

  describe('Response format', () => {
    it('returns success response with proper format when target responds', async () => {
      const http = require('http');
      
      const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', data: { value: 42 } }));
      });
      
      return new Promise((resolve, reject) => {
        server.listen(0, async () => {
          const port = server.address().port;
          try {
            const res = await request(app)
              .get('/cors-proxy')
              .set('Target-URL', `http://localhost:${port}/test`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toBeDefined();
            expect(res.body.status).toBe(200);
            
            server.close(resolve);
          } catch (err) {
            server.close(() => reject(err));
          }
        });
      });
    });

    it('returns TARGET_HTTP_ERROR when target returns non-2xx status', async () => {
      const http = require('http');
      
      const server = http.createServer((req, res) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      });
      
      return new Promise((resolve, reject) => {
        server.listen(0, async () => {
          const port = server.address().port;
          try {
            const res = await request(app)
              .get('/cors-proxy')
              .set('Target-URL', `http://localhost:${port}/notfound`);
            
            expect(res.status).toBe(500);
            expect(res.body.success).toBe(false);
            expect(res.body.errorType).toBe('TARGET_HTTP_ERROR');
            expect(res.body.message).toContain('HTTP 404');
            expect(res.body.details).toBeDefined();
            expect(res.body.details.status).toBe(404);
            
            server.close(resolve);
          } catch (err) {
            server.close(() => reject(err));
          }
        });
      });
    });

    it('returns TARGET_NETWORK_ERROR when target is unreachable', async () => {
      const res = await request(app)
        .get('/cors-proxy')
        .set('Target-URL', 'http://localhost:9999/unreachable');
      
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(['TARGET_NETWORK_ERROR', 'TARGET_TIMEOUT_ERROR', 'TARGET_UNKNOWN_ERROR']).toContain(res.body.errorType);
      expect(res.body.details).toBeDefined();
    });
  });
});
