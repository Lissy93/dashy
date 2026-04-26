import en from '@/assets/locales/en.json';

export const languages = [
  { name: 'English', code: 'en', flag: '🇬🇧' },
  { name: 'English (British)', code: 'en-GB', flag: '🇬🇧' },
  { name: 'العربية', code: 'ar', flag: '🇦🇪' },
  { name: 'Български', code: 'bg', flag: '🇧🇬' },
  { name: 'বাংলা', code: 'bn', flag: '🇧🇩' },
  { name: 'Čeština', code: 'cs', flag: '🇨🇿' },
  { name: 'Dansk', code: 'da', flag: '🇩🇰' },
  { name: 'Deutsch', code: 'de', flag: '🇩🇪' },
  { name: 'Ελληνικά', code: 'el', flag: '🇬🇷' },
  { name: 'Español', code: 'es', flag: '🇪🇸' },
  { name: 'Français', code: 'fr', flag: '🇲🇫' },
  { name: 'हिन्दी', code: 'hi', flag: '🇮🇳' },
  { name: 'Magyar', code: 'hu', flag: '🇭🇺' },
  { name: 'Italiano', code: 'it', flag: '🇮🇹' },
  { name: '日本語', code: 'ja', flag: '🇯🇵' },
  { name: '한국어', code: 'ko', flag: '🇰🇷' },
  { name: 'Кыргызча', code: 'ky', flag: '🇰🇬' },
  { name: 'Norsk', code: 'nb', flag: '🇳🇴' },
  { name: 'Nederlands', code: 'nl', flag: '🇳🇱' },
  { name: 'polski', code: 'pl', flag: '🇵🇱' },
  { name: 'Português', code: 'pt', flag: '🇵🇹' },
  { name: 'Galego', code: 'gl', flag: '🛰️' },
  { name: 'Русский', code: 'ru', flag: '🇷🇺' },
  { name: 'Romana', code: 'ro', flag: '🇷🇴' },
  { name: 'Slovenčina', code: 'sk', flag: '🇸🇰' },
  { name: 'Slovenščina', code: 'sl', flag: '🇸🇮' },
  { name: 'Svenska', code: 'sv', flag: '🇸🇪' },
  { name: 'Türkçe', code: 'tr', flag: '🇹🇷' },
  { name: 'Ukrainian', code: 'uk', flag: '🇺🇦' },
  { name: '简体中文', code: 'zh-CN', flag: '🇨🇳' },
  { name: '繁體中文', code: 'zh-TW', flag: '🇹🇼' },
  { name: 'Pirate', code: 'zz-pirate', flag: '🏴‍☠️' },
];

export const messages = { en };

const loaders = import.meta.glob([
  '../assets/locales/*.json',
  '!../assets/locales/en.json', // Exclude English, needed as default + fallback
]);

export const loadLocale = async (code) => {
  if (code === 'en') return en;
  const loader = loaders[`../assets/locales/${code}.json`];
  if (!loader) throw new Error(`Unsupported locale: ${code}`);
  const mod = await loader();
  return mod.default;
};
