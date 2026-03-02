import { createAction } from '@reduxjs/toolkit';

import { AnyProperty } from '@/types/Property/property';
import { checkVisibility } from '@/util/propertyTreeHelpers';
import {
  enabledPropertyUri,
  fadePropertyUri,
  isEnabledPropertyUri,
  isFadePropertyUri,
  isSceneGraphNode,
  isSceneGraphNodeProperty,
  sgnIdentifierFromSubownerUri,
  sgnRenderableUri,
  sgnUri
} from '@/util/uris';
import { menuItemsData } from '@/windowmanagement/data/MenuItems';

import { onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';
import {
  addPropertyOwners,
  removePropertyOwners
} from '../propertyTree/propertyOwnerSlice';
import { propertySelectors, updateMany, updateOne } from '../propertyTree/propertySlice';

import { removeSceneGraphNode, setMenuItemsConfig, setVisibility } from './localSlice';

function sgnUpdatedVisibilityProperty(uri: string, value: AnyProperty['value']) {
  const isSceneGraphNodeProp = isSceneGraphNodeProperty(uri);
  if (!isSceneGraphNodeProp) {
    return false;
  }
  const isFade = isFadePropertyUri(uri) && typeof value === 'number';
  const isEnabled = isEnabledPropertyUri(uri) && typeof value === 'boolean';
  const isFadeOrEnabled = isFade || isEnabled;
  if (!isFadeOrEnabled) {
    return false;
  }
  return true;
}

export const resetMenuItemConfig = createAction<void>('local/resetMenu');
const updateSgnVisibility = createAction<{
  uri: string;
  value?: boolean | number;
}>('local/setVisibilityForUri');

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
      const { id: uri, changes } = action.payload;
      if (
        changes.value !== undefined &&
        sgnUpdatedVisibilityProperty(uri, changes.value)
      ) {
        listenerApi.dispatch(
          updateSgnVisibility({ uri, value: changes.value as boolean | number })
        );
      }
    }
  });

  startListening({
    matcher: addPropertyOwners.match,
    effect: async (action, listenerApi) => {
      const propertyOwners = action.payload;
      for (const owner of propertyOwners) {
        if (isSceneGraphNode(owner.uri)) {
          const renderable = sgnRenderableUri(owner.uri);
          const fade = propertySelectors.selectById(
            listenerApi.getState(),
            fadePropertyUri(renderable)
          );
          const enabled = propertySelectors.selectById(
            listenerApi.getState(),
            enabledPropertyUri(renderable)
          );
          const visibility = checkVisibility(
            enabled?.value as boolean | undefined,
            fade?.value as number | undefined
          );
          if (visibility !== undefined) {
            listenerApi.dispatch(setVisibility({ uri: owner.uri, visibility }));
          }
        }
      }
    }
  });

  startListening({
    matcher: removePropertyOwners.match,
    effect: async (action, listenerApi) => {
      const { uris } = action.payload;
      for (const uri of uris) {
        if (isSceneGraphNode(uri)) {
          listenerApi.dispatch(removeSceneGraphNode(uri));
        }
      }
    }
  });

  startListening({
    matcher: updateMany.match,
    effect: async (action, listenerApi) => {
      for (const update of action.payload) {
        const { id: uri, changes } = update;
        // Check if a fade value or an enabled value has been updated
        // for a scene graph node
        if (
          changes.value !== undefined &&
          sgnUpdatedVisibilityProperty(uri, changes.value)
        ) {
          listenerApi.dispatch(
            updateSgnVisibility({ uri, value: changes.value as boolean | number })
          );
        }
      }
    }
  });

  startListening({
    actionCreator: updateSgnVisibility,
    effect: async (action, listenerApi) => {
      // The uri can be either Fade, Enabled, or the scene graph node itself
      const { uri, value } = action.payload;
      const sceneGraphNodeUri = sgnUri(sgnIdentifierFromSubownerUri(uri));
      const renderableUri = sgnRenderableUri(sceneGraphNodeUri);

      const currentEnabled = isEnabledPropertyUri(uri)
        ? (value as boolean)
        : (propertySelectors.selectById(
            listenerApi.getState(),
            enabledPropertyUri(renderableUri)
          )?.value as boolean);

      const currentFade = isFadePropertyUri(uri)
        ? (value as number)
        : (propertySelectors.selectById(
            listenerApi.getState(),
            fadePropertyUri(renderableUri)
          )?.value as number);
      const visibility = checkVisibility(currentEnabled, currentFade);

      const prevVisibility =
        listenerApi.getState().local.sceneTree.visibility[sceneGraphNodeUri];

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
