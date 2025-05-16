import common from '@/public/locales/en/common.json';
import components from '@/public/locales/en/components.json';
import notifications from '@/public/locales/en/notifications.json';
import panelKeybinds from '@/public/locales/en/panel-keybinds.json';
import panelNavigation from '@/public/locales/en/panel-navigation.json';
import panelScene from '@/public/locales/en/panel-scene.json';

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    common: common,
    components: components,
    notifications: notifications,
    'panel-keybinds': panelKeybinds,
    'panel-navigation': panelNavigation,
    'panel-scene': panelScene
  }
} as const;

export type Resources = typeof resources;
