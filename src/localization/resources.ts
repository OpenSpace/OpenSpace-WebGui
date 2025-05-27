import common from '@/public/locales/en/common.json';
import components from '@/public/locales/en/components.json';
import notifications from '@/public/locales/en/notifications.json';

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    common: common,
    components: components,
    notifications: notifications
  }
} as const;

export type Resources = typeof resources;
