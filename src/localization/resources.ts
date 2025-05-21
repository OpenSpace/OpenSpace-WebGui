import common from '@/public/locales/en/common.json';
import components from '@/public/locales/en/components.json';
import notifications from '@/public/locales/en/notifications.json';
import keybindsPanel from '@/public/locales/en/panel-keybinds.json';
import navigationPanel from '@/public/locales/en/panel-navigation.json';
import scenePanel from '@/public/locales/en/panel-scene.json';

/**
 * This object in combination with `i18next.d.ts` enables intellisense and syntax
 * highlighting when accessing the translation units, e.g., useTranslation('components');
 */
export const resources = {
  en: {
    common: common,
    components: components,
    notifications: notifications,
    'panel-keybinds': keybindsPanel,
    'panel-navigation': navigationPanel,
    'panel-scene': scenePanel
  }
} as const;

export type Resources = typeof resources;
