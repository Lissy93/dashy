/**
 * Sanitization Utilities
 * Used by RSS feed widgets, preventing XSS
 */

import DOMPurify from 'dompurify';
import ErrorHandler from '@/utils/ErrorHandler';

// DOMPurify settings
const HTML_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'a', 'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
    'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'img', 'figure', 'figcaption',
    'span', 'div', 'hr',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'id',
    'width', 'height', 'target', 'rel',
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'base', 'form', 'input', 'button'],
  KEEP_CONTENT: true,
  SAFE_FOR_TEMPLATES: true,
};

// DOMPurify configuration for text-only sanitization
const TEXT_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [],
  KEEP_CONTENT: true,
};

/**
 * Sanitizes HTML content from RSS feeds, to only allow safe tags
 * @param {string} html - The HTML content to sanitize
 * @returns {string} Sanitized HTML safe for rendering with v-html
 */
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';

  try {
    return DOMPurify.sanitize(html, HTML_SANITIZE_CONFIG);
  } catch (error) {
    ErrorHandler('HTML sanitization error', error);
    return '';
  }
};

/**
 * Validates and sanitizes URLs from RSS feeds, only accept http/https
 * @param {string} url - The URL to validate
 * @returns {string|null} Sanitized URL or null if invalid/malicious
 */
export const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  try {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return null;
    const parsedUrl = new URL(trimmedUrl);
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return trimmedUrl;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Sanitizes text fields by stripping all HTML tags
 * Use for titles, author names, and other text-only fields
 * @param {string} text - The text to sanitize
 * @returns {string} Plain text with HTML stripped
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';

  try {
    return DOMPurify.sanitize(text, TEXT_SANITIZE_CONFIG);
  } catch (error) {
    ErrorHandler('Text sanitization error', error);
    return '';
  }
};

/**
 * Sanitizes all fields of an RSS item
 * @param {object} item - RSS item with title, description, link, etc.
 * @returns {object} Sanitized RSS item
 */
export const sanitizeRssItem = (item) => {
  if (!item || typeof item !== 'object') return {};

  try {
    return {
      title: sanitizeText(item.title || ''),
      description: sanitizeHtml(item.description || item.content || item.contentSnippet || ''),
      link: sanitizeUrl(item.link),
      author: sanitizeText(item.author || ''),
      pubDate: sanitizeText(item.pubDate || item.isoDate || ''),
      thumbnail: sanitizeUrl(item.thumbnail || item.enclosure?.url),
    };
  } catch (error) {
    ErrorHandler('RSS item sanitization error', error);
    return {};
  }
};

/**
 * Sanitizes RSS feed metadata
 * @param {object} meta - Feed metadata with title, link, description, etc.
 * @returns {object} Sanitized feed metadata
 */
export const sanitizeRssMeta = (meta) => {
  if (!meta || typeof meta !== 'object') return {};

  try {
    return {
      title: sanitizeText(meta.title || ''),
      description: sanitizeText(meta.description || ''),
      link: sanitizeUrl(meta.link),
      author: sanitizeText(meta.author || ''),
      image: sanitizeUrl(meta.image),
    };
  } catch (error) {
    ErrorHandler('RSS metadata sanitization error', error);
    return {};
  }
};
