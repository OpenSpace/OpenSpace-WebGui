import common from '@/public/locales/en/common.json';
import components from '@/public/locales/en/components.json';
import log from '@/public/locales/en/log.json';
import menu from '@/public/locales/en/menu.json';
import notifications from '@/public/locales/en/notifications.json';
import sessionrecording from '@/public/locales/en/sessionrecordingpanel.json';

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    common: common,
    components: components,
    log: log,
    menu: menu,
    notifications: notifications,
    sessionrecording: sessionrecording
  }
} as const;

export type Resources = typeof resources;
