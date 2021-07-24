// Locales - Import translation files here!
import en from '@/assets/locales/en.json';
import de from '@/assets/locales/de.json';

// Language data - Add your country name, locale code and imported file here
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
  // Including:
  // name - Human readable name for your language
  // code - ISO language code
  // locale - The file that you imported above
  // flag - A nice emoji flag (optional)
];

const i18nMessages = {};
languages.forEach((lang) => {
  i18nMessages[lang.code] = lang.locale;
});
export const messages = i18nMessages;
