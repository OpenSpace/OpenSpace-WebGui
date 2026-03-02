import { useCallback } from 'react';

import { useOpenSpaceApi } from '@/api/hooks';
import { usePropertyValue } from '@/hooks/properties';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { propertyOwnerSelectors } from '@/redux/propertyTree/propertyOwnerSlice';
import { propertySelectors } from '@/redux/propertyTree/propertySlice';
import { setPropertyValue } from '@/redux/propertyTree/propertyTreeMiddleware';
import { Identifier, PropertyOwner, Uri, Visibility } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import {
  checkVisibility,
  hasVisibleChildren,
  isPropertyVisible
} from '@/util/propertyTreeHelpers';
import {
  enabledPropertyUri,
  fadePropertyUri,
  isSceneGraphNode,
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
  const visibilityLevelSetting = usePropertyValue(
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
  const visibilityLevelSetting = usePropertyValue(
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
 * Retrieves the visibility status of a scene graph node based on its URI.
 *
 * @param uri - The URI of the scene graph node for which the visibility is being queried.
 * @returns The visibility status of the scene graph node, or undefined if not found.
 */
export function useSceneGraphNodeVisibility(uri: Uri): Visibility | undefined {
  const visibility = useAppSelector((state) => state.local.sceneTree.visibility[uri]);
  if (!isSceneGraphNode(uri)) {
    throw Error(`URI '${uri}' is not a valid scene graph node URI`);
  }
  return visibility;
}

/**
 * Creates a function that sets the visibility of a property owner by controlling its fade and enabled properties.
 *
 * @param uri - The URI of the property owner that directly owns the fade and enabled properties
 * @returns A callback function that sets the visibility state, with optional immediate mode
 *
 * @example
 * const setVisibility = useSetPropertyOwnerVisibility(ownerUri);
 * setVisibility(true); // Fade in
 * setVisibility(false, true); // Immediately hide
 */
export function useSetPropertyOwnerVisibility(
  uri: Uri
): (shouldShow: boolean, isImmediate?: boolean) => void {
  const fadeUri = fadePropertyUri(uri);
  const enabledUri = enabledPropertyUri(uri);

  const luaApi = useOpenSpaceApi();

  const isFadeable = useAppSelector(
    (state) => propertySelectors.selectById(state, fadeUri) !== undefined
  );

  const dispatch = useAppDispatch();

  // Not using the useProperty hooks here to minimize re-renders
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

  return setVisibility;
}

/**
 * Check if the property owner is visible, based on the current visibility level setting.
 * Also provides a function to set the visibility of the property owner.
 *
 * @param uri - The URI of the property owner for which visibility is being checked.
 * @returns An object containing the visibility status and a function to set the visibility.
 */
export function usePropertyOwnerVisibility(uri: Uri) {
  const fadeUri = fadePropertyUri(uri);
  const enabledUri = enabledPropertyUri(uri);

  // Not using the useProperty hooks here to minimize re-renders
  const visibility = useAppSelector((state) => {
    const enabled = propertySelectors.selectById(state, enabledUri)?.value as
      | boolean
      | undefined;
    const fade = propertySelectors.selectById(state, fadeUri)?.value as
      | number
      | undefined;
    return checkVisibility(enabled, fade);
  });

  const setVisibility = useSetPropertyOwnerVisibility(uri);

  return {
    visibility,
    setVisibility
  };
}
