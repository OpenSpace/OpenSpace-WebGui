import { createAction } from '@reduxjs/toolkit';

import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';

import { setMenuItemsConfig } from './localSlice';

export const resetMenuItemConfig = createAction<void>('local/resetMenu');

export const addLocalListener = (startListening: AppStartListening) => {
  // Create default toolbar items configuration upon startup
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      // When the connection opens, we need to create a default configuration for the
      // menu items if it has not been set yet
      if (listenerApi.getState().local.menuItemsConfig.length === 0) {
        listenerApi.dispatch(resetMenuItemConfig());
      }
    }
  });

  startListening({
    actionCreator: resetMenuItemConfig,
    effect: async (_, listenerApi) => {
      // Read the menu items data and create a default configuration
      const menuItemsConfig = Object.values(menuItemsData).map((item) => ({
        id: item.componentID,
        visible: item.defaultVisible,
        name: item.title,
        isOpen: false
      }));

      // Override the default configuration from the profile settings
      const defaultVisibleItems = listenerApi.getState().profile.uiPanelVisibility;
      const defaultConfig = menuItemsConfig.map((item) => ({
        ...item,
        visible: defaultVisibleItems[item.id] ?? item.visible
      }));

      // Set the redux store
      listenerApi.dispatch(setMenuItemsConfig(defaultConfig));
    }
  });
};
