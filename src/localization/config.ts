import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    // Specifies default language
    lng: 'en',
    // Fallback when a locale translation is missing
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      // React already escapes any code in
      escapeValue: false
    }
  });

export default i18n;
