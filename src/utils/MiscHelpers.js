/* eslint-disable arrow-body-style */
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
      });
    }
    if (sec.widgets) {
      sec.widgets.forEach((widget, widgetIdx) => {
        sections[secIdx].widgets[widgetIdx].id = makeItemId(sec.name, widget.type, widgetIdx);
      });
    }
  });
  return sections;
};

/* Given a timestamp, returns formatted date, in local format */
export const timestampToDate = (timestamp) => {
  const localFormat = navigator.language;
  const dateFormat = {
    weekday: 'short', day: 'numeric', month: 'short', year: '2-digit',
  };
  const date = new Date(timestamp).toLocaleDateString(localFormat, dateFormat);
  return `${date}`;
};

/* Given a timestamp, returns formatted time in local format */
export const timestampToTime = (timestamp) => {
  const localFormat = navigator.language;
  const timeFormat = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const time = Intl.DateTimeFormat(localFormat, timeFormat).format(new Date(timestamp));
  return time;
};

export const timestampToDateTime = (timestamp) => {
  return `${timestampToDate(timestamp)} at ${timestampToTime(timestamp)}`;
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

/* Given a 2-digit country code, return path to flag image from Flagpedia */
export const getCountryFlag = (countryCode, dimens) => {
  const protocol = 'https';
  const cdn = 'flagcdn.com';
  const dimensions = dimens || '64x48';
  const country = countryCode.toLowerCase();
  const ext = 'png';
  return `${protocol}://${cdn}/${dimensions}/${country}.${ext}`;
};

/* Given a Latitude & Longitude object, and optional zoom level, return link to OSM */
export const getMapUrl = (location, zoom) => {
  return `https://www.openstreetmap.org/#map=${zoom || 10}/${location.lat}/${location.lon}`;
};

/* Given a large number, will add commas to make more readable */
export const putCommasInBigNum = (bigNum) => {
  const strNum = Number.isNaN(bigNum) ? bigNum : String(bigNum);
  return strNum.replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
};

/* Given a large number, will convert 1000 into k for readability */
export const showNumAsThousand = (bigNum) => {
  if (bigNum < 1000) return bigNum;
  return `${Math.round(bigNum / 1000)}k`;
};

export const capitalize = (str) => {
  return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
};
