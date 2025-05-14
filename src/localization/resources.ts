import actionPanel from '@/public/locales/en/actionpanel.json';
import components from '@/public/locales/en/components.json';
import exoplanetsPanel from '@/public/locales/en/exoplanetspanel.json';
import flightcontrolPanel from '@/public/locales/en/flightcontrolpanel.json';
import geolocationPanel from '@/public/locales/en/geolocationpanel.json';
import notifications from '@/public/locales/en/notifications.json';

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    actionpanel: actionPanel,
    components: components,
    exoplanetspanel: exoplanetsPanel,
    flightcontrolpanel: flightcontrolPanel,
    geolocationpanel: geolocationPanel,
    notifications: notifications
  }
} as const;

export type Resources = typeof resources;
