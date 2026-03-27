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
import { addPropertyOwners, removePropertyOwners } from '../hoot/propertyOwnerSlice';
import {
  propertySelectors,
  updateMany,
  updateOne,
  upsertMany
} from '../hoot/propertySlice';

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

function maybeDispatchVisibilityUpdate(
  uri: string,
  value: AnyProperty['value'] | undefined,
  dispatch: (action: unknown) => void
) {
  if (hasSgnUpdatedVisibility(uri, value)) {
    dispatch(updateSgnVisibility({ uri, value: value as boolean | number }));
  }
}

export const addLocalListener = (startListening: AppStartListening) => {
  // Create default toolbar items configuration upon startup
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      // When the connection opens, we need to create a default configuration for the
      // menu items if it has not been set yet
      if (listenerApi.getState().local.menuItems.config.length === 0) {
        listenerApi.dispatch(resetMenuItemConfig());
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

  // Listens to both updateOne and updateMany actions to catch any updates to
  // properties that might affect SGN visibility
  startListening({
    predicate: (action) => updateOne.match(action) || updateMany.match(action),
    effect: async (action, listenerApi) => {
      const updates = updateOne.match(action) ? [action.payload] : action.payload;
      for (const { id: uri, changes } of updates) {
        maybeDispatchVisibilityUpdate(uri, changes.value, listenerApi.dispatch);
      }
    }
  });

  startListening({
    matcher: upsertMany.match,
    effect: async (action, listenerApi) => {
      const properties = Array.isArray(action.payload)
        ? action.payload
        : (Object.values(action.payload) as AnyProperty[]);

      for (const { uri, value } of properties) {
        maybeDispatchVisibilityUpdate(uri, value, listenerApi.dispatch);
      }
    }
  });

  startListening({
    actionCreator: updateSgnVisibility,
    effect: async (action, listenerApi) => {
      const { uri, value } = action.payload;
      const sceneGraphNodeUri = sgnUri(sgnIdentifierFromSubownerUri(uri));
      const renderableUri = sgnRenderableUri(sceneGraphNodeUri);
      const state = listenerApi.getState();

      const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';
      const isNumber = (v: unknown): v is number => typeof v === 'number';

      const storedValue = <T>(
        propUri: string,
        guard: (v: unknown) => v is T
      ): T | undefined => {
        const v = propertySelectors.selectById(state, propUri)?.value;
        return guard(v) ? v : undefined;
      };

      // Use the incoming value if it matches the URI, otherwise fall back to stored state
      const currentEnabled = isEnabledPropertyUri(uri)
        ? isBoolean(value)
          ? value
          : undefined
        : storedValue(enabledPropertyUri(renderableUri), isBoolean);

      const currentFade = isFadePropertyUri(uri)
        ? isNumber(value)
          ? value
          : undefined
        : storedValue(fadePropertyUri(renderableUri), isNumber);

      const visibility = checkVisibility(currentEnabled, currentFade);
      const prevVisibility = state.local.sceneTree.visibility[sceneGraphNodeUri];

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

      listenerApi.dispatch(setMenuItemsConfig(defaultConfig));
    }
  });
};
