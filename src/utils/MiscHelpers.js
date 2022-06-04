/* A collection of generic reusable functions for various string processing tasks */
/* eslint-disable arrow-body-style */

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
  return Intl.DateTimeFormat(localFormat, timeFormat).format(new Date(timestamp));
};

/* Given a timestamp, returns both human Date and Time */
export const timestampToDateTime = (timestamp) => {
  return `${timestampToDate(timestamp)} at ${timestampToTime(timestamp)}`;
};

/* Given a 2-letter country ISO code, return the countries name */
export const getCountryFromIso = (iso) => {
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  return regionNames.of(iso);
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

/* Given a currency code, return path to corresponding countries flag icon */
export const getCurrencyFlag = (currency) => {
  const cdn = 'https://raw.githubusercontent.com/transferwise/currency-flags';
  return `${cdn}/master/src/flags/${currency.toLowerCase()}.png`;
};

/* Given a Latitude & Longitude object, and optional zoom level, return link to OSM */
export const getMapUrl = (location, zoom) => {
  return `https://www.openstreetmap.org/#map=${zoom || 10}/${location.lat}/${location.lon}`;
};

/* Given a place name, return a link to Google Maps search page */
export const getPlaceUrl = (placeName) => {
  return `https://www.google.com/maps/search/${encodeURIComponent(placeName)}`;
};

/* Given a large number, will add commas to make more readable */
export const putCommasInBigNum = (bigNum) => {
  const strNum = Number.isNaN(bigNum) ? bigNum : String(bigNum);
  const [integerPart, decimalPart] = strNum.split('.');
  return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimalPart ? `.${decimalPart}` : '');
};

/* Given a large number, will convert 1000 into k for readability */
export const showNumAsThousand = (bigNum) => {
  if (bigNum < 1000) return bigNum;
  return `${Math.round(bigNum / 1000)}k`;
};

/* Capitalizes the first letter of each word within a string */
export const capitalize = (str) => {
  const words = str.replaceAll('_', ' ').replaceAll('-', ' ');
  return words.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
};

/* Given a mem size in bytes, will return it in appropriate unit */
export const convertBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / (k ** i)).toFixed(decimals))} ${sizes[i]}`;
};

/* Round price to appropriate number of decimals */
export const roundPrice = (price) => {
  if (Number.isNaN(price)) return price;
  let decimals;
  if (price > 1000) decimals = 0;
  else if (price > 1) decimals = 2;
  else if (price > 0.1) decimals = 3;
  else if (price > 0.01) decimals = 4;
  else if (price <= 0.01) decimals = 5;
  else decimals = 2;
  return price.toFixed(decimals);
};

/* Cuts string off at given length, and adds an ellipse */
export const truncateStr = (str, len = 60, ellipse = '...') => {
  return str.length > len + ellipse.length ? `${str.slice(0, len)}${ellipse}` : str;
};

/* Given two timestamp, return the difference in text format, e.g. '10 minutes' */
export const getTimeDifference = (startTime, endTime) => {
  const msDifference = new Date(endTime).getTime() - new Date(startTime).getTime();
  const diff = Math.abs(Math.round(msDifference / 1000));
  const divide = (time, round) => Math.round(time / round);
  if (diff < 60) return `${divide(diff, 1)} seconds`;
  if (diff < 3600) return `${divide(diff, 60)} minutes`;
  if (diff < 86400) return `${divide(diff, 3600)} hours`;
  if (diff < 604800) return `${divide(diff, 86400)} days`;
  if (diff >= 604800) return `${divide(diff, 604800)} weeks`;
  return 'unknown';
};

/* Given a timestamp, return how long ago it was, e.g. '10 minutes' */
export const getTimeAgo = (dateTime) => {
  const now = new Date().getTime();
  const diffStr = getTimeDifference(dateTime, now);
  if (diffStr === 'unknown') return diffStr;
  return `${diffStr} ago`;
};

/* Given the name of a CSS variable, returns it's value */
export const getValueFromCss = (colorVar) => {
  const cssProps = getComputedStyle(document.documentElement);
  return cssProps.getPropertyValue(`--${colorVar}`).trim();
};

/* Given a temperature in Fahrenheit, returns value in Celsius */
export const fahrenheitToCelsius = (fahrenheit) => {
  return Math.round(((fahrenheit - 32) * 5) / 9);
};

/* Given a currency code, return the corresponding unicode symbol */
export const findCurrencySymbol = (currencyCode) => {
  const code = currencyCode.toUpperCase().trim();
  const currencies = {
    USD: '$', // US Dollar
    EUR: '€', // Euro
    GBP: '£', // British Pound Sterling
    AFN: '؋', // Afghan Afghani
    ALL: 'Lek', // Albanian Lek
    AUD: '$', // Australian Dollar
    AWG: 'ƒ', // Aruban Guilder
    BAM: 'KM', // Bosnian Mark
    BWP: 'P', // Botswana Pula
    CAD: '$', // Canadian Dollar
    CNY: '¥', // Chinese Yuan Renminbi
    CRC: '₡', // Costa Rican Colón
    CRS: '₡', // Costa Rican Colon
    CUP: '₱', // Cuban Peso
    DKK: 'kr', // Danish Krone
    HKD: '$', // Hong Kong Dollar
    HUF: 'Ft', // Hungarian Forint
    HRK: 'kn', // Croatian Kuna
    ISK: 'kr', // Icelandic Krona
    ILS: '₪', // Israeli New Sheqel
    INR: '₹', // Indian Rupee
    IRR: '﷼', // Iranian Rial
    JPY: '¥', // Japanese Yen
    KRW: '₩', // South Korean Won
    LAK: '₭', // Laos Kip
    NGN: '₦', // Nigerian Naira
    NOK: 'kr', // Norwegian Krone
    PHP: '₱', // Philippine Peso
    PKR: '₨', // Pakistani Rupee
    PLN: 'zł', // Polish Zloty
    PYG: '₲', // Paraguayan Guarani
    RUB: '₽', // Russian Ruble
    THB: '฿', // Thai Baht
    UAH: '₴', // Ukrainian Hryvnia
    VND: '₫', // Vietnamese Dong
    YER: '﷼', // Yemen Rial
    ZWD: 'Z$', // Zimbabwean Dollar
  };
  if (currencies[code]) return currencies[code];
  return `${code} `; // Symbol not found, return text code instead
};
