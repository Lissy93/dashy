import { makePageSlug, viewFromPath } from '@/utils/config/ConfigHelpers';
import { checkPageVisibility } from '@/utils/CheckPageVisibility';

/* True when the string looks like an absolute http(s) URL */
export const isHttpUrl = (str) => /^(http|https):\/\/\S+/.test(str);

/* Map a link's `target` config value to a valid HTML anchor target */
export const resolveLinkTarget = (link) => {
  const t = link && link.target;
  if (t === 'sametab') return '_self';
  if (t === 'parent') return '_parent';
  if (t === 'top') return '_top';
  return '_blank';
};

/* Combined list of user-defined nav links + visible sub-pages for the current
 * view. Each entry: { path, title, target? }. Empty list means nothing to show. */
export const buildAllLinks = (store, route, extraLinks = []) => {
  const view = viewFromPath(route.path);
  const subPages = (store.getters.pages || []).filter(checkPageVisibility)
    .map((page) => ({ path: makePageSlug(page.name, view), title: page.name }));
  return [...(extraLinks || []), ...subPages];
};
