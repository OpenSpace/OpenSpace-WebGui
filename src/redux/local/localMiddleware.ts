import { createAction } from '@reduxjs/toolkit';

import { PropertyOwner } from '@/types/types';
import { checkVisibilityTest } from '@/util/propertyTreeHelpers';
import {
  enabledPropertyUri,
  fadePropertyUri,
  isEnabledPropertyUri,
  isFadePropertyUri,
  isSceneGraphNode,
  isSceneGraphNodeProperty,
  removeLastWordFromUri,
  sgnIdentifierFromSubownerUri,
  sgnRenderableUri,
  sgnUri
} from '@/util/uris';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';
import { upsertMany, upsertOne } from '../propertyTreeTest/propertyOwnerSlice';
import {
  propertySelectors,
  updateMany,
  updateOne
} from '../propertyTreeTest/propertySlice';

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
    matcher: upsertMany.match,
    effect: async (action, listenerApi) => {
      const owners: PropertyOwner[] = Array.isArray(action.payload)
        ? action.payload
        : Object.values(action.payload);
      for (const owner of owners) {
        if (isSceneGraphNode(owner.uri)) {
          listenerApi.dispatch(setVisibilityForUri({ uri: owner.uri }));
        }
      }
    }
  });

  startListening({
    matcher: upsertOne.match,
    effect: async (action, listenerApi) => {
      const { uri } = action.payload;
      if (isSceneGraphNode(uri)) {
        listenerApi.dispatch(setVisibilityForUri({ uri }));
      }
    }
  });

  startListening({
    matcher: updateOne.match,
    effect: async (action, listenerApi) => {
      const uri = action.payload.id;
      const { value } = action.payload.changes;

      if (
        (isSceneGraphNodeProperty(uri) && typeof value === 'number') ||
        typeof value === 'boolean'
      ) {
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
        if (
          (isSceneGraphNodeProperty(uri) && typeof value === 'number') ||
          typeof value === 'boolean'
        ) {
          listenerApi.dispatch(setVisibilityForUri({ uri, value }));
        }
      }
    }
  });

  startListening({
    actionCreator: setVisibilityForUri,
    effect: async (action, listenerApi) => {
      const { uri, value } = action.payload;

      let currentEnabled;
      let currentFade;
      const parent = removeLastWordFromUri(uri);

      if (isSceneGraphNode(uri) && value === undefined) {
        currentEnabled = propertySelectors.selectById(
          listenerApi.getState(),
          enabledPropertyUri(sgnRenderableUri(uri))
        )?.value as boolean;
        currentFade = propertySelectors.selectById(
          listenerApi.getState(),
          fadePropertyUri(sgnRenderableUri(uri))
        )?.value as number;
      } else if (isFadePropertyUri(uri)) {
        currentEnabled = propertySelectors.selectById(
          listenerApi.getState(),
          enabledPropertyUri(parent)
        )?.value as boolean;
        currentFade = value as number;
      } else if (isEnabledPropertyUri(uri)) {
        currentFade = propertySelectors.selectById(
          listenerApi.getState(),
          fadePropertyUri(parent)
        )?.value as number;
        currentEnabled = value as boolean;
      }
      const visibility = checkVisibilityTest(currentEnabled, currentFade);

      // Update the scene tree visibility if it has changed
      if (
        listenerApi.getState().local.sceneTree.visibility[uri] !== visibility &&
        visibility !== undefined
      ) {
        const sceneGraphNodeUri = sgnUri(sgnIdentifierFromSubownerUri(uri));
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
