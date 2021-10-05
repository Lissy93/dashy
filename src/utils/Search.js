/* Dashy: Licensed under MIT, (C) Alicia Sykes 2021 <https://aliciasykes.com> */

/* Tile filtering utility */
import ErrorHandler from '@/utils/ErrorHandler';

/**
 * Extracts the site name from domain
 * @param {string} url The URL to process
 * @returns {string} The hostname from URL
 */
const getDomainFromUrl = (url) => {
  if (!url) return '';
  const urlPattern = /^(?:https?:\/\/)?(?:w{3}\.)?([a-z\d.-]+)\.(?:[a-z.]{2,10})(?:[/\w.-]*)*/;
  const domainPattern = url.match(urlPattern);
  return domainPattern ? domainPattern[1] : '';
};

/**
 * Compares search term to a given data attribute
 * Ignores case, special characters and order
 * @param {string or other} compareStr The value to compare to
 * @param {string} searchStr The users search term
 * @returns {boolean} true if a match, otherwise false
 */
const filterHelper = (compareStr, searchStr) => {
  if (!compareStr) return false;
  const process = (input) => input && input.toString().toLowerCase().replace(/[^\w\s]/gi, '');
  return process(compareStr).includes(process(searchStr));
};

/**
 * Filter tiles based on users search term, and returns a filtered list
 * Will match based on title, description, provider, hostname from url and tags
 * Ignores case, special characters and other irrelevant things
 * @param {array} allTiles An array of tiles
 * @param {string} searchTerm The users search term
 * @returns A filtered array of tiles
 */
export const searchTiles = (allTiles, searchTerm) => {
  if (!searchTerm) return allTiles; // If no search term, then return all
  if (!allTiles) return []; // If no data, then skip
  return allTiles.filter((tile) => {
    const {
      title, description, provider, url, tags,
    } = tile;
    return filterHelper(title, searchTerm)
      || filterHelper(provider, searchTerm)
      || filterHelper(description, searchTerm)
      || filterHelper(tags, searchTerm)
      || filterHelper(getDomainFromUrl(url), searchTerm);
  });
};

/* From a list of search bangs, return the URL associated with it */
export const getSearchEngineFromBang = (searchQuery, bangList) => {
  const bangNames = Object.keys(bangList);
  const foundBang = bangNames.find((bang) => searchQuery.includes(bang));
  return bangList[foundBang];
};

/* For a given search engine key, return the corresponding URL, or throw error */
export const findUrlForSearchEngine = (searchEngine, availableSearchEngines) => {
  // If missing search engine, report error return false
  if (!searchEngine) { ErrorHandler('No search engine specified'); return undefined; }
  // If search engine is already a URL, then return it
  if ((/(http|https):\/\/[^]*/).test(searchEngine)) return searchEngine;
  // If search engine was found successfully, return the URL
  if (availableSearchEngines[searchEngine]) return availableSearchEngines[searchEngine];
  // Otherwise, there's been an error, log it and return false
  ErrorHandler(`Specified Search Engine was not Found: '${searchEngine}'`);
  return undefined;
};

/* Removes all known bangs from a search query */
export const stripBangs = (searchQuery, bangList) => {
  const bangNames = Object.keys(bangList || {});
  let q = searchQuery;
  bangNames.forEach((bang) => { q = q.replace(bang, ''); });
  return q.trim();
};
