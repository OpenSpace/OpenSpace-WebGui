import components from '@/public/locales/en/components.json';
import actionPanel from '@/public/locales/en/actionpanel.json'
import exoplanetsPanel from '@/public/locales/en/exoplanetspanel.json'

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    components: components,
    actionpanel: actionPanel,
    exoplanetspanel: exoplanetsPanel,
  }
} as const;

export type Resources = typeof resources;
