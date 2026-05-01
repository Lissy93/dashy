import { createI18n } from 'vue-i18n';
import { messages, languages } from '@/utils/languages';
import { language as defaultLanguage } from '@/utils/config/defaults';

// Pre-register every code so `$i18n.availableLocales` lists the full set
// before each locale JSON has been fetched; empty locales fall back to English
const registered = { ...messages };
languages.forEach(({ code }) => {
  if (!registered[code]) registered[code] = {};
});

const i18n = createI18n({
  legacy: true,
  locale: defaultLanguage,
  fallbackLocale: defaultLanguage,
  messages: registered,
});

export default i18n;
