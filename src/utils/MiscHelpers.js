import { hideFurnitureOn } from '@/utils/defaults';

/* Returns false if page furniture should be hidden on said route */
export const shouldBeVisible = (routeName) => !hideFurnitureOn.includes(routeName);

/* Very rudimentary hash function for generative icons */
export const asciiHash = (input) => {
  const str = (!input || input.length === 0) ? Math.random().toString() : input;
  const reducer = (previousHash, char) => (previousHash || 0) + char.charCodeAt(0);
  const asciiSum = str.split('').reduce(reducer).toString();
  const shortened = asciiSum.slice(0, 30) + asciiSum.slice(asciiSum.length - 30);
  return window.btoa(shortened);
};

/* Encode potentially malicious characters from string */
export const sanitize = (string) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>"'/]/ig;
  return string.replace(reg, (match) => (map[match]));
};
