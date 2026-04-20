/**
 * Handles app page meta tags. Like title, description, icon, color, etc.
 */

import { makePageName, viewFromPath } from '@/utils/config/ConfigHelpers';

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
  return { title, description: pageInfo.description || '' };
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

/* Map of meta-field -> DOM writer. Add new entries here to extend. */
const APPLIERS = {
  title: (v) => { document.title = v || FALLBACK_TITLE; },
  description: (v) => setMetaTag('description', v),
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
