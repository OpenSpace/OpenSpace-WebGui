import { useCallback } from 'react';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { propertyOwnerSelectors } from '@/redux/propertyTreeTest/propertyOwnerSlice';
import { propertySelectors } from '@/redux/propertyTreeTest/propertySlice';
import { setPropertyValue } from '@/redux/propertyTreeTest/propertyTreeTestMiddleware';
import { Identifier, PropertyOwner, Uri } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import { isPropertyVisible } from '@/util/propertyTreeHelpers';
import { hasVisibleChildren } from '@/util/propertyTreeSelectors';
import {
  enabledPropertyUri,
  fadePropertyUri,
  removeLastWordFromUri,
  sgnUri
} from '@/util/uris';

export function usePropertyOwner(uri: Uri): PropertyOwner | undefined {
  return useAppSelector((state) => propertyOwnerSelectors.selectById(state, uri));
}

export function useSceneGraphNode(identifier: Identifier): PropertyOwner | undefined {
  const uri = sgnUri(identifier);
  return usePropertyOwner(uri);
}

/**
 * Returns a function that checks whether a scene graph node with the given identifier
 * exists among the propertyOwners.
 */
export function useIsSceneGraphNodeAdded(): (id: Identifier) => boolean {
  const propertyOwners = useAppSelector((state) =>
    propertyOwnerSelectors.selectAll(state)
  );

  function isSceneGraphNodeAdded(identifier: Identifier): boolean {
    const uri = sgnUri(identifier);
    return propertyOwners.findIndex((po) => po.uri === uri) !== -1;
  }

  return isSceneGraphNodeAdded;
}

/**
 * Return true if the property owner has any visible children, according to the current
 * visibility level setting.
 */
export function useHasVisibleChildren(propertyOwnerUri: Uri): boolean {
  const [visibilityLevelSetting] = useProperty(
    'OptionProperty',
    EnginePropertyVisibilityKey
  );

  return useAppSelector((state) =>
    hasVisibleChildren(
      propertyOwnerSelectors.selectEntities(state),
      propertySelectors.selectEntities(state),
      propertyOwnerUri,
      visibilityLevelSetting
    )
  );
}

/**
 * Find all the properties of a certain property owner that are visible, according to the
 * current visiblitity level setting. Also subscribe to changes for the visiblity level.
 */
export function useVisibleProperties(propertyOwner: PropertyOwner | undefined): Uri[] {
  const [visibilityLevelSetting] = useProperty(
    'OptionProperty',
    EnginePropertyVisibilityKey
  );

  const allProperties = useAppSelector((state) =>
    propertySelectors.selectEntities(state)
  );
  return (
    propertyOwner?.properties.filter((p) =>
      isPropertyVisible(allProperties[p].metaData.visibility, visibilityLevelSetting)
    ) ?? []
  );
}

/**
 * Check if the property ower is visible, based on the current visibility level setting.
 * Also provides a function to set the visibility of the property owner.
 */
export function usePropertyOwnerVisibility(uri: Uri) {
  // Not using the useProperty hooks here to minimize re-renders
  const fadeUri = fadePropertyUri(uri);
  const enabledUri = enabledPropertyUri(uri);

  const luaApi = useOpenSpaceApi();

  const visibility = useAppSelector(
    (state) => state.local.sceneTree.visibility[removeLastWordFromUri(uri)]
  );
  const isFadeable = useAppSelector((state) => {
    return propertySelectors.selectById(state, fadeUri) !== undefined;
  });

  const dispatch = useAppDispatch();

  const setVisibility = useCallback(
    (shouldShow: boolean, isImmediate: boolean = false) => {
      if (!isFadeable) {
        dispatch(setPropertyValue({ uri: enabledUri, value: shouldShow }));
      } else if (isImmediate) {
        dispatch(setPropertyValue({ uri: enabledUri, value: shouldShow }));
        dispatch(setPropertyValue({ uri: fadeUri, value: shouldShow ? 1.0 : 0.0 }));
      } else if (shouldShow) {
        luaApi?.fadeIn(uri);
      } else {
        luaApi?.fadeOut(uri);
      }
    },
    [dispatch, enabledUri, fadeUri, isFadeable, luaApi, uri]
  );
  return {
    visibility,
    setVisibility
  };
}
