// Locales - Import translation files here!
import en from '@/assets/locales/en.json';
import de from '@/assets/locales/de.json';
import nl from '@/assets/locales/nl.json';
import pl from '@/assets/locales/pl.json';
import fr from '@/assets/locales/fr.json';
import sl from '@/assets/locales/sl.json';
import es from '@/assets/locales/es.json';
import it from '@/assets/locales/it.json';
import zhCN from '@/assets/locales/zh-CN.json';
import zhTW from '@/assets/locales/zh-TW.json';
import ar from '@/assets/locales/ar.json';
import hi from '@/assets/locales/hi.json';
import ja from '@/assets/locales/ja.json';
import pt from '@/assets/locales/pt.json';
import ru from '@/assets/locales/ru.json';
import nb from '@/assets/locales/nb.json';
import pirate from '@/assets/locales/zz-pirate.json';
import sv from '@/assets/locales/sv.json';

// Language data - Next register your language by adding it to this list
export const languages = [
  {
    name: 'English',
    code: 'en',
    locale: en,
    flag: '🇬🇧',
  },
  { // German
    name: 'Deutsch',
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
    name: 'polski',
    code: 'pl',
    locale: pl,
    flag: '🇵🇱',
  },
  {
    name: 'Français',
    code: 'fr',
    locale: fr,
    flag: '🇲🇫',
  },
  {
    name: 'Slovenščina',
    code: 'sl',
    locale: sl,
    flag: '🇸🇮',
  },
  { // Spanish
    name: 'Español',
    code: 'es',
    locale: es,
    flag: '🇪🇸',
  },
  { // Italian
    name: 'Italiano',
    code: 'it',
    locale: it,
    flag: '🇮🇹',
  },
  { // Chinese
    name: '简体中文',
    code: 'cn',
    locale: zhCN,
    flag: '🇨🇳',
  },
  { // Chinese
    name: '繁體中文',
    code: 'zh-TW',
    locale: zhTW,
    flag: '🇹🇼',
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
  { // Japanese
    name: '日本語',
    code: 'ja',
    locale: ja,
    flag: '🇯🇵',
  },
  { // Portuguese
    name: 'Português',
    code: 'pt',
    locale: pt,
    flag: '🇵🇹',
  },
  { // Russian
    name: 'Русский',
    code: 'ru',
    locale: ru,
    flag: '🇷🇺',
  },
  { // Norwegian
    name: 'Norsk',
    code: 'nb',
    locale: nb,
    flag: '🇳🇴',
  },
  { // Joke Language - Pirate
    name: 'Pirate',
    code: 'pirate',
    locale: pirate,
    flag: '🏴‍☠️',
  },
  { // Swedish
    name: 'Svenska',
    code: 'sv',
    locale: sv,
    flag: '🇸🇪',
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
