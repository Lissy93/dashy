import { createI18n } from 'vue-i18n';
import { messages } from '@/utils/languages';
import { language as defaultLanguage } from '@/utils/config/defaults';

/**
 * Single i18n instance used by the Vue app and shared with non-component
 * callers (e.g. the router guard) via the `i18n.global.t(...)` API.
 */
const i18n = createI18n({
  legacy: true,
  locale: defaultLanguage,
  fallbackLocale: defaultLanguage,
  messages,
});

export default i18n;
