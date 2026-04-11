// Locales - Import translation files here! (sort alphabetically)
import en from '@/assets/locales/en.json';
import enGB from '@/assets/locales/en-GB.json';
import ar from '@/assets/locales/ar.json';
import bg from '@/assets/locales/bg.json';
import bn from '@/assets/locales/bn.json';
import cs from '@/assets/locales/cs.json';
import da from '@/assets/locales/da.json';
import de from '@/assets/locales/de.json';
import el from '@/assets/locales/el.json';
import es from '@/assets/locales/es.json';
import fr from '@/assets/locales/fr.json';
import hi from '@/assets/locales/hi.json';
import hu from '@/assets/locales/hu.json';
import it from '@/assets/locales/it.json';
import ja from '@/assets/locales/ja.json';
import ko from '@/assets/locales/ko.json';
import ky from '@/assets/locales/ky.json';
import nb from '@/assets/locales/nb.json';
import nl from '@/assets/locales/nl.json';
import pl from '@/assets/locales/pl.json';
import pt from '@/assets/locales/pt.json';
import gl from '@/assets/locales/gl.json';
import ru from '@/assets/locales/ru.json';
import ro from '@/assets/locales/ro.json';
import sk from '@/assets/locales/sk.json';
import sl from '@/assets/locales/sl.json';
import sv from '@/assets/locales/sv.json';
import tr from '@/assets/locales/tr.json';
import uk from '@/assets/locales/uk.json';
import zhCN from '@/assets/locales/zh-CN.json';
import zhTW from '@/assets/locales/zh-TW.json';
import pirate from '@/assets/locales/zz-pirate.json';

// Language data - Next register your language by adding it to this list
// Sorted alphabetically by code (except English which is first, and specials at the end)
export const languages = [
  {
    name: 'English',
    code: 'en',
    locale: en,
    flag: '🇬🇧',
  },
  { // Real English (just the overides from en.json)
    name: 'English (British)',
    code: 'en-GB',
    locale: enGB,
    flag: '🇬🇧',
  },
  { // Arabic
    name: 'العربية',
    code: 'ar',
    locale: ar,
    flag: '🇦🇪',
  },
  { // Bulgarian
    name: 'Български',
    code: 'bg',
    locale: bg,
    flag: '🇧🇬',
  },
  { // Bengali
    name: 'বাংলা',
    code: 'bn',
    locale: bn,
    flag: '🇧🇩',
  },
  { // Czech
    name: 'Čeština',
    code: 'cs',
    locale: cs,
    flag: '🇨🇿',
  },
  { // Danish
    name: 'Dansk',
    code: 'da',
    locale: da,
    flag: '🇩🇰',
  },
  { // German
    name: 'Deutsch',
    code: 'de',
    locale: de,
    flag: '🇩🇪',
  },
  { // Greek
    name: 'Ελληνικά',
    code: 'el',
    locale: el,
    flag: '🇬🇷',
  },
  { // Spanish
    name: 'Español',
    code: 'es',
    locale: es,
    flag: '🇪🇸',
  },
  {
    name: 'Français',
    code: 'fr',
    locale: fr,
    flag: '🇲🇫',
  },
  { // Hindi
    name: 'हिन्दी',
    code: 'hi',
    locale: hi,
    flag: '🇮🇳',
  },
  { // Hungarian
    name: 'Magyar',
    code: 'hu',
    locale: hu,
    flag: '🇭🇺',
  },
  { // Italian
    name: 'Italiano',
    code: 'it',
    locale: it,
    flag: '🇮🇹',
  },
  { // Japanese
    name: '日本語',
    code: 'ja',
    locale: ja,
    flag: '🇯🇵',
  },
  { // Korean
    name: '한국어',
    code: 'ko',
    locale: ko,
    flag: '🇰🇷',
  },
  { // Kyrgyz
    name: 'Кыргызча',
    code: 'ky',
    locale: ky,
    flag: '🇰🇬',
  },
  { // Norwegian
    name: 'Norsk',
    code: 'nb',
    locale: nb,
    flag: '🇳🇴',
  },
  { // Dutch
    name: 'Nederlands',
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
  { // Portuguese
    name: 'Português',
    code: 'pt',
    locale: pt,
    flag: '🇵🇹',
  },
  { // Galician
    name: 'Galego',
    code: 'gl',
    locale: gl,
    flag: '🛰️',
  },
  { // Russian
    name: 'Русский',
    code: 'ru',
    locale: ru,
    flag: '🇷🇺',
  },
  { // Romanian
    name: 'Romana',
    code: 'ro',
    locale: ro,
    flag: '🇷🇴',
  },
  { // Slovak
    name: 'Slovenčina',
    code: 'sk',
    locale: sk,
    flag: '🇸🇰',
  },
  {
    name: 'Slovenščina',
    code: 'sl',
    locale: sl,
    flag: '🇸🇮',
  },
  { // Swedish
    name: 'Svenska',
    code: 'sv',
    locale: sv,
    flag: '🇸🇪',
  },
  { // Turkish
    name: 'Türkçe',
    code: 'tr',
    locale: tr,
    flag: '🇹🇷',
  },
  { // Ukrainian
    name: 'Ukrainian',
    code: 'uk',
    locale: uk,
    flag: '🇺🇦',
  },
  { // Chinese
    name: '简体中文',
    code: 'zh-CN',
    locale: zhCN,
    flag: '🇨🇳',
  },
  { // Chinese
    name: '繁體中文',
    code: 'zh-TW',
    locale: zhTW,
    flag: '🇹🇼',
  },
  { // Joke Language - Pirate
    name: 'Pirate',
    code: 'pirate',
    locale: pirate,
    flag: '🏴‍☠️',
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
