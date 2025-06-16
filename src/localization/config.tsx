import { initReactI18next } from 'react-i18next';
import { SE, US } from 'country-flag-icons/react/3x2';
import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';

import { LanguageInfo } from '@/types/types';

// Key should match the IEFT language code: https://en.wikipedia.org/wiki/IETF_language_tag
// See available icons at https://catamphetamine.gitlab.io/country-flag-icons/3x2/index.html
export const SupportedLanguages: Record<string, LanguageInfo> = {
  en: { language: 'English-US', icon: <US width={20} /> },
  sv: { language: 'Swedish', icon: <SE width={20} /> }
};

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    // Specifies default language
    lng: 'en',
    // Fallback when a locale translation is missing
    fallbackLng: 'en',
    supportedLngs: Object.keys(SupportedLanguages),
    ns: ['common'],
    defaultNS: false,
    debug: true,
    interpolation: {
      // React already escapes any code in translation messages, safguarding against XSS
      escapeValue: false
    },
    backend: {
      loadPath: `locales/{{lng}}/{{ns}}.json`
    }
  });

export default i18n;
