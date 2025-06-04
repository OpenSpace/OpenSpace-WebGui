import components from '@/public/locales/en/components.json';
import notifications from '@/public/locales/en/notifications.json';
import actionPanel from '@/public/locales/en/panel-actions.json';
import exoplanetsPanel from '@/public/locales/en/panel-exoplanets.json';
import flightControlPanel from '@/public/locales/en/panel-flightcontrol.json';
import geolocationPanel from '@/public/locales/en/panel-geolocation.json';
import nightskyPanel from '@/public/locales/en/panel-nightsky.json';

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    components: components,
    notifications: notifications,
    'panel-actions': actionPanel,
    'panel-exoplanets': exoplanetsPanel,
    'panel-flightcontrol': flightControlPanel,
    'panel-geolocation': geolocationPanel,
    'panel-nightsky': nightskyPanel
  }
} as const;

export type Resources = typeof resources;
