import components from '@/public/locales/en/components.json';

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    components: components
  }
} as const;

export type Resources = typeof resources;
