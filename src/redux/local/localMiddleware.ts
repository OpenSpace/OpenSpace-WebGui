import { createAction } from '@reduxjs/toolkit';

import { checkVisibilityTest } from '@/util/propertyTreeHelpers';
import {
  enabledPropertyUri,
  fadePropertyUri,
  isEnabledPropertyUri,
  isFadePropertyUri,
  isSceneGraphNodeProperty,
  removeLastWordFromUri,
  sgnIdentifierFromSubownerUri,
  sgnRenderableUri,
  sgnUri
} from '@/util/uris';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';
import { propertySelectors, updateMany, updateOne } from '../propertyTree/propertySlice';

import { setMenuItemsConfig, setVisibility } from './localSlice';

export const resetMenuItemConfig = createAction<void>('local/resetMenu');
const setVisibilityForUri = createAction<{ uri: string; value?: boolean | number }>(
  'local/setVisibilityForUri'
);

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
    matcher: updateOne.match,
    effect: async (action, listenerApi) => {
      const uri = action.payload.id;
      const { value } = action.payload.changes;

      const isSceneGraphNodeProp = isSceneGraphNodeProperty(uri);
      const isFadeOrEnabled =
        (isFadePropertyUri(uri) && typeof value === 'number') ||
        (isEnabledPropertyUri(uri) && typeof value === 'boolean');

      if (isSceneGraphNodeProp && isFadeOrEnabled) {
        listenerApi.dispatch(setVisibilityForUri({ uri, value }));
      }
    }
  });

  startListening({
    matcher: updateMany.match,
    effect: async (action, listenerApi) => {
      for (const update of action.payload) {
        const uri = update.id;
        const { value } = update.changes;

        const isSceneGraphNodeProp = isSceneGraphNodeProperty(uri);
        const isFadeOrEnabled =
          (isFadePropertyUri(uri) && typeof value === 'number') ||
          (isEnabledPropertyUri(uri) && typeof value === 'boolean');

        if (isSceneGraphNodeProp && isFadeOrEnabled) {
          listenerApi.dispatch(setVisibilityForUri({ uri, value }));
        }
      }
    }
  });

  startListening({
    actionCreator: setVisibilityForUri,
    effect: async (action, listenerApi) => {
      // The uri can be either Fade, Enabled, or the scene graph node itself
      const { uri, value } = action.payload;

      const isFadeProperty = isFadePropertyUri(uri);
      const isEnabledProperty = isEnabledPropertyUri(uri);

      const sceneGraphNodeUri = sgnUri(sgnIdentifierFromSubownerUri(uri));
      const renderableUri = sgnRenderableUri(sceneGraphNodeUri);

      let currentEnabled;
      let currentFade;

      if (isEnabledProperty) {
        currentEnabled = value as boolean;
      } else {
        currentEnabled = propertySelectors.selectById(
          listenerApi.getState(),
          enabledPropertyUri(renderableUri)
        )?.value as boolean;
      }

      if (isFadeProperty) {
        currentFade = value as number;
      } else {
        currentFade = propertySelectors.selectById(
          listenerApi.getState(),
          fadePropertyUri(renderableUri)
        )?.value as number;
      }

      const visibility = checkVisibilityTest(currentEnabled, currentFade);
      const prevVisibility =
        listenerApi.getState().local.sceneTree.visibility[removeLastWordFromUri(uri)];

      // Update the scene tree visibility if it has changed
      if (prevVisibility !== visibility && visibility !== undefined) {
        listenerApi.dispatch(setVisibility({ uri: sceneGraphNodeUri, visibility }));
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
