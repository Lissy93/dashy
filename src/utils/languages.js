// Locales - Import translation files here!
import en from '@/assets/locales/en.json';
import de from '@/assets/locales/de.json';
import nl from '@/assets/locales/nl.json';
import fr from '@/assets/locales/fr.json';

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
  // Including:
  // name - Human readable name for your language (e.g German)
  // code - ISO language code (e.g. de)
  // locale - The file that you imported above
  // flag - A nice emoji flag (optional, e.g. 🇩🇪)
];

const i18nMessages = {};
languages.forEach((lang) => {
  i18nMessages[lang.code] = lang.locale;
});
export const messages = i18nMessages;
