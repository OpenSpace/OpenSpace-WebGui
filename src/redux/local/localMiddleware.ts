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
import {
  propertySelectors,
  updateMany,
  updateOne,
  upsertMany
} from '../propertyTree/propertySlice';

import { removeSceneGraphNode, setMenuItemsConfig, setVisibility } from './localSlice';

function hasSgnUpdatedVisibility(uri: string, value: AnyProperty['value'] | undefined) {
  if (value === undefined) {
    return false;
  }
  const isSceneGraphNodeProp = isSceneGraphNodeProperty(uri);
  if (!isSceneGraphNodeProp) {
    return false;
  }
  const isFade = isFadePropertyUri(uri) && typeof value === 'number';
  const isEnabled = isEnabledPropertyUri(uri) && typeof value === 'boolean';
  return isFade || isEnabled;
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
      if (hasSgnUpdatedVisibility(uri, changes.value)) {
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
          const enabledValue = enabled?.value;
          const fadeValue = fade?.value;
          const visibility = checkVisibility(
            typeof enabledValue === 'boolean' ? enabledValue : undefined,
            typeof fadeValue === 'number' ? fadeValue : undefined
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
        if (hasSgnUpdatedVisibility(uri, changes.value)) {
          listenerApi.dispatch(
            updateSgnVisibility({ uri, value: changes.value as boolean | number })
          );
        }
      }
    }
  });

  // Handle the initial property load (upsertMany) in addition to incremental updates
  // (updateMany). This ensures visibility is set correctly regardless of whether
  // addPropertyOwners or upsertMany runs first.
  startListening({
    matcher: upsertMany.match,
    effect: async (action, listenerApi) => {
      const properties = Array.isArray(action.payload)
        ? action.payload
        : (Object.values(action.payload) as AnyProperty[]);
      for (const property of properties) {
        if (hasSgnUpdatedVisibility(property.uri, property.value)) {
          listenerApi.dispatch(
            updateSgnVisibility({
              uri: property.uri,
              value: property.value as boolean | number
            })
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

      const enabledStateValue = propertySelectors.selectById(
        listenerApi.getState(),
        enabledPropertyUri(renderableUri)
      )?.value;
      const fadeStateValue = propertySelectors.selectById(
        listenerApi.getState(),
        fadePropertyUri(renderableUri)
      )?.value;

      const currentEnabled = isEnabledPropertyUri(uri)
        ? typeof value === 'boolean'
          ? value
          : undefined
        : typeof enabledStateValue === 'boolean'
          ? enabledStateValue
          : undefined;

      const currentFade = isFadePropertyUri(uri)
        ? typeof value === 'number'
          ? value
          : undefined
        : typeof fadeStateValue === 'number'
          ? fadeStateValue
          : undefined;

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
