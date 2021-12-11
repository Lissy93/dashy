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

/* Based on section title, item name and index, return a string value for ID */
const makeItemId = (sectionStr, itemStr, index) => {
  const charSum = sectionStr.split('').map((a) => a.charCodeAt(0)).reduce((x, y) => x + y);
  const itemTitleStr = itemStr.replace(/\s+/g, '-').replace(/[^a-zA-Z ]/g, '').toLowerCase();
  return `${index}_${charSum}_${itemTitleStr}`;
};

/* Given an array of sections, apply a unique ID to each item, and return modified array */
export const applyItemId = (inputSections) => {
  const sections = inputSections || [];
  sections.forEach((sec, secIdx) => {
    if (sec.items) {
      sec.items.forEach((item, itemIdx) => {
        sections[secIdx].items[itemIdx].id = makeItemId(sec.name, item.title, itemIdx);
        // TODO: Check if ID already exists, and if so, modify it
      });
    }
  });
  return sections;
};

export const convertTimestampToDate = (timestamp) => {
  const localFormat = navigator.language;
  const dateFormat = {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  };
  const date = new Date(timestamp).toLocaleDateString(localFormat, dateFormat);
  return `${date}`;
};

/* Given a currency code, return the corresponding unicode symbol */
export const findCurrencySymbol = (currencyCode) => {
  const code = currencyCode.toUpperCase().trim();
  const currencies = {
    USD: '$', // US Dollar
    EUR: '€', // Euro
    CRC: '₡', // Costa Rican Colón
    GBP: '£', // British Pound Sterling
    ILS: '₪', // Israeli New Sheqel
    INR: '₹', // Indian Rupee
    JPY: '¥', // Japanese Yen
    KRW: '₩', // South Korean Won
    NGN: '₦', // Nigerian Naira
    PHP: '₱', // Philippine Peso
    PLN: 'zł', // Polish Zloty
    PYG: '₲', // Paraguayan Guarani
    THB: '฿', // Thai Baht
    UAH: '₴', // Ukrainian Hryvnia
    VND: '₫', // Vietnamese Dong
  };
  if (currencies[code]) return currencies[code];
  return code;
};
