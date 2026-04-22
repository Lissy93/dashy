import { localStorageKeys, sortOrder as defaultSortOrder } from '@/utils/config/defaults';
import ErrorHandler from '@/utils/logging/ErrorHandler';

/* Reads a `{ itemId: count }` map out of local storage, returning {} on any error. */
const readUsage = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return {}; }
};

const byTitle = (items) => [...items].sort(
  (a, b) => ((a.title || '').toLowerCase() > (b.title || '').toLowerCase() ? 1 : -1),
);

const byUsage = (items, key) => {
  const counts = readUsage(key);
  const get = (item) => counts[item.id] || 0;
  return [...items].reverse().sort((a, b) => (get(a) < get(b) ? 1 : -1));
};

const shuffled = (items) => items
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value);

/* If valid sort order provided, then returns a sorted copy of items */
export default function sortItems(items, order, sectionTitle = '') {
  const list = Array.isArray(items) ? items.slice() : [];
  const ord = order || defaultSortOrder;
  if (ord === 'default') return list;
  if (ord === 'alphabetical') return byTitle(list);
  if (ord === 'reverse-alphabetical') return byTitle(list).reverse();
  if (ord === 'most-used') return byUsage(list, localStorageKeys.MOST_USED);
  if (ord === 'last-used') return byUsage(list, localStorageKeys.LAST_USED);
  if (ord === 'random') return shuffled(list);
  ErrorHandler(`Unknown Sort order '${ord}'${sectionTitle ? ` under '${sectionTitle}'` : ''}`);
  return list;
}
