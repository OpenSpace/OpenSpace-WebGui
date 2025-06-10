import common from '@/public/locales/en/common.json';
import components from '@/public/locales/en/components.json';
import notifications from '@/public/locales/en/notifications.json';
import actionPanel from '@/public/locales/en/panel-actions.json';
import exoplanetsPanel from '@/public/locales/en/panel-exoplanets.json';
import flightControlPanel from '@/public/locales/en/panel-flightcontrol.json';
import geolocationPanel from '@/public/locales/en/panel-geolocation.json';
import keybindsPanel from '@/public/locales/en/panel-keybinds.json';
import missionsPanel from '@/public/locales/en/panel-missions.json';
import navigationPanel from '@/public/locales/en/panel-navigation.json';
import nightskyPanel from '@/public/locales/en/panel-nightsky.json';
import scenePanel from '@/public/locales/en/panel-scene.json';
import screenspaceRenderablePanel from '@/public/locales/en/panel-screenspacerenderable.json';
import settingsPanel from '@/public/locales/en/panel-settings.json';

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    common: common,
    components: components,
    notifications: notifications,
    'panel-actions': actionPanel,
    'panel-exoplanets': exoplanetsPanel,
    'panel-flightcontrol': flightControlPanel,
    'panel-geolocation': geolocationPanel,
    'panel-keybinds': keybindsPanel,
    'panel-missions': missionsPanel,
    'panel-navigation': navigationPanel,
    'panel-nightsky': nightskyPanel,
    'panel-scene': scenePanel,
    'panel-screenspacerenderable': screenspaceRenderablePanel,
    'panel-settings': settingsPanel
  }
} as const;

export type Resources = typeof resources;
