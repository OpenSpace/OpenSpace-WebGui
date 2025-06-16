import common from '@/public/locales/en/common.json';
import components from '@/public/locales/en/components.json';
import menu from '@/public/locales/en/menu.json';
import notifications from '@/public/locales/en/notifications.json';
import actionPanel from '@/public/locales/en/panel-actions.json';
import exoplanetsPanel from '@/public/locales/en/panel-exoplanets.json';
import flightControlPanel from '@/public/locales/en/panel-flightcontrol.json';
import geolocationPanel from '@/public/locales/en/panel-geolocation.json';
import gettingStartedTourPanel from '@/public/locales/en/panel-gettingstartedtour.json';
import keybindsPanel from '@/public/locales/en/panel-keybinds.json';
import missionsPanel from '@/public/locales/en/panel-missions.json';
import navigationPanel from '@/public/locales/en/panel-navigation.json';
import nightskyPanel from '@/public/locales/en/panel-nightsky.json';
import scenePanel from '@/public/locales/en/panel-scene.json';
import screenspaceRenderablePanel from '@/public/locales/en/panel-screenspacerenderable.json';
import scriptLogPanel from '@/public/locales/en/panel-scriptlog.json';
import sessionRecordingPanel from '@/public/locales/en/panel-sessionrecording.json';
import settingsPanel from '@/public/locales/en/panel-settings.json';
import skyBrowserPanel from '@/public/locales/en/panel-skybrowser.json';
import timePanel from '@/public/locales/en/panel-time.json';
import userPanel from '@/public/locales/en/panel-user.json';

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    common: common,
    components: components,
    menu: menu,
    notifications: notifications,
    'panel-actions': actionPanel,
    'panel-exoplanets': exoplanetsPanel,
    'panel-flightcontrol': flightControlPanel,
    'panel-geolocation': geolocationPanel,
    'panel-gettingstartedtour': gettingStartedTourPanel,
    'panel-keybinds': keybindsPanel,
    'panel-missions': missionsPanel,
    'panel-navigation': navigationPanel,
    'panel-nightsky': nightskyPanel,
    'panel-scene': scenePanel,
    'panel-screenspacerenderable': screenspaceRenderablePanel,
    'panel-sessionrecording': sessionRecordingPanel,
    'panel-scriptlog': scriptLogPanel,
    'panel-settings': settingsPanel,
    'panel-skybrowser': skyBrowserPanel,
    'panel-time': timePanel,
    'panel-user': userPanel
  }
} as const;

export type Resources = typeof resources;
