// Locales - Import translation files here!
import en from '@/assets/locales/en.json';
import de from '@/assets/locales/de.json';
import nl from '@/assets/locales/nl.json';
import fr from '@/assets/locales/fr.json';
import sl from '@/assets/locales/sl.json';
import es from '@/assets/locales/es.json';
import zhCN from '@/assets/locales/zh-CN.json';
import ar from '@/assets/locales/ar.json';
import hi from '@/assets/locales/hi.json';

// Language data - Next register your language by adding it to this list
export const languages = [
  {
    name: 'English',
    code: 'en',
    locale: en,
    flag: '🇬🇧',
  },
  {
    name: 'German',
    code: 'de',
    locale: de,
    flag: '🇩🇪',
  },
  {
    name: 'Dutch',
    code: 'nl',
    locale: nl,
    flag: '🇳🇱',
  },
  {
    name: 'French',
    code: 'fr',
    locale: fr,
    flag: '🇲🇫',
  },
  {
    name: 'Slovenian',
    code: 'sl',
    locale: sl,
    flag: '🇸🇮',
  },
  { // Spanish
    name: 'Spanish',
    code: 'es',
    locale: es,
    flag: '🇪🇸',
  },
  { // Chinese
    name: '简体中文',
    code: 'cn',
    locale: zhCN,
    flag: '🇨🇳',
  },
  { // Arabic
    name: 'العربية',
    code: 'ar',
    locale: ar,
    flag: '🇦🇪',
  },
  { // Hindi
    name: 'नहीं',
    code: 'hi',
    locale: hi,
    flag: '🇮🇳',
  },
];

/**
 * Include the following info:
 * name - Human readable name for your language (e.g German)
 * code - ISO language code (e.g. de)
 * locale - The file that you imported above
 * flag - A nice emoji flag (optional, e.g. 🇩🇪)
 */

// All done :)
// You can also add your language to /README.md and credit yourself if you like

// Prepare each language for export
const i18nMessages = {};
languages.forEach((lang) => {
  i18nMessages[lang.code] = lang.locale;
});
export const messages = i18nMessages;
