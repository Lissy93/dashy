/**
 * Handles app page meta tags. Like title, description, icon, color, etc.
 */

import { makePageName, viewFromPath } from '@/utils/config/ConfigHelpers';
import ErrorHandler from '@/utils/logging/ErrorHandler';

const FALLBACK_TITLE = 'Dashy';

export const VIEW_LABELS = { home: null, minimal: 'Minimal', workspace: 'Workspace' };

export const STATIC_ROUTE_LABELS = {
  login: 'Login',
  about: 'About',
  download: 'Download Config',
  404: 'Not Found',
};

/* Resolve the section display name from its URL slug, or undefined if no match */
const resolveSectionName = (sectionSlug, sections) => {
  if (!sectionSlug || !Array.isArray(sections)) return undefined;
  const match = sections.find((s) => makePageName(s?.name || '') === sectionSlug);
  return match?.name;
};

/* Reject bad URLs from favicon path. Only allows URLs, paths and data URI */
const validateFavicon = (value) => {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (!url) return null;
  if (/^(javascript|vbscript):/i.test(url)) {
    ErrorHandler(`Unsafe favicon URL rejected: ${value}`);
    return null;
  }
  return url;
};

/* Uses the browser's own CSS parser as the source of truth for valid color values. */
const validateColor = (value) => {
  if (typeof value !== 'string') return null;
  const color = value.trim();
  if (!color) return null;
  if (window.CSS?.supports?.('color', color)) return color;
  ErrorHandler(`Invalid theme color rejected: ${value}`);
  return null;
};

/* Compute the metadata object for the current route + store */
export const computePageMeta = (route, store) => {
  const staticLabel = STATIC_ROUTE_LABELS[route?.name];
  if (staticLabel) return { title: `${staticLabel} | ${FALLBACK_TITLE}`, description: '' };

  const pageInfo = store?.getters?.pageInfo || {};
  const base = pageInfo.title || FALLBACK_TITLE;
  const view = viewFromPath(route?.path);
  const viewLabel = VIEW_LABELS[view];
  const sectionName = resolveSectionName(route?.params?.section, store?.getters?.sections);
  const title = [sectionName, base, viewLabel].filter(Boolean).join(' | ') || FALLBACK_TITLE;
  return {
    title,
    description: pageInfo.description || '',
    themeColor: validateColor(pageInfo.color),
    favicon: validateFavicon(pageInfo.favicon),
  };
};

/* Upsert a <meta name="..."> tag in the document head */
const setMetaTag = (name, content) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content || '');
};

/* Update every <link rel="icon"> href, or create one if none exist */
const setFavicon = (href) => {
  const links = document.querySelectorAll('link[rel~="icon"]');
  if (links.length === 0) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'icon');
    link.setAttribute('href', href);
    document.head.appendChild(link);
    return;
  }
  links.forEach((l) => l.setAttribute('href', href));
};

/* Map of meta-field to DOM writer
 * If sub-page doesn't have an override, it will inherit from root */
const APPLIERS = {
  title: (v) => { document.title = v || FALLBACK_TITLE; },
  description: (v) => setMetaTag('description', v),
  themeColor: (v) => { if (v) setMetaTag('theme-color', v); },
  favicon: (v) => { if (v) setFavicon(v); },
};

/* Side-effect: push a meta object onto the DOM */
export const applyPageMeta = (meta) => {
  Object.entries(meta || {}).forEach(([key, value]) => {
    const apply = APPLIERS[key];
    if (apply) apply(value);
  });
};

/* Convenience: compute + apply in one call */
export const syncPageMeta = (route, store) => applyPageMeta(computePageMeta(route, store));
