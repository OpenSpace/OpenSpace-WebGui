import { shallowEqual } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppSelector } from '@/redux/hooks';
import { PropertyOwner, Uri } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import {
  checkVisiblity,
  enabledPropertyUri,
  fadePropertyUri,
  hasVisibleChildren,
  isPropertyVisible,
  isSgnFocusable,
  isSgnHidden
} from '@/util/propertyTreeHelpers';

import { useBoolProperty, useFloatProperty, useOptionProperty } from './properties';

export function usePropertyOwner(uri: Uri): PropertyOwner | undefined {
  return useAppSelector((state) => state.propertyOwners.propertyOwners[uri]);
}

export const useHasVisibleChildren = (propertyOwnerUri: Uri): boolean => {
  const [visiblityLevelSetting] = useOptionProperty(EnginePropertyVisibilityKey);

  return useAppSelector((state) => {
    return hasVisibleChildren(
      propertyOwnerUri,
      visiblityLevelSetting,
      state.propertyOwners.propertyOwners,
      state.properties.propertyOverview
    );
  });
};

/**
 * Find all the properties of a certain property owner that are visible, according to the
 * current visiblitity level setting. Also subscribe to changes for the visiblity level.
 */
export const useVisibleProperties = (propertyOwner: PropertyOwner | undefined) => {
  const [visiblityLevelSetting] = useOptionProperty(EnginePropertyVisibilityKey);

  // @TODO (emmbr, 2024-12-03) Would be nicer if we didn't have to do the filtering as
  // part of the selector, but instead just get the state.properties.properties object
  // and then and do the filtering outside of the selector. However, as of now
  // state.properties.properties object includes the property values, and it would hence
  // lead to rerendering updates on every property change. One idea would be to seprate
  // the property values from the property descriptions in the redux store.
  return (
    useAppSelector(
      (state) =>
        propertyOwner?.properties.filter((p) =>
          isPropertyVisible(state.properties.properties[p], visiblityLevelSetting)
        ),
      shallowEqual
    ) || []
  );
};

export function usePropertyOwnerVisibility(uri: Uri) {
  const luaApi = useOpenSpaceApi();

  const [enabledPropertyValue, setEnabledProperty] = useBoolProperty(
    enabledPropertyUri(uri)
  );
  const [fadePropertyValue] = useFloatProperty(fadePropertyUri(uri));
  const isFadeable = fadePropertyValue !== undefined;

  const isVisible = checkVisiblity(enabledPropertyValue, fadePropertyValue);

  function setVisiblity(shouldShow: boolean, isImmediate: boolean = false) {
    const fadeTime = isImmediate ? 0 : undefined;
    if (!isFadeable) {
      setEnabledProperty(shouldShow);
    } else if (shouldShow) {
      luaApi?.fadeIn(uri, fadeTime);
    } else {
      luaApi?.fadeOut(uri, fadeTime);
    }
  }

  return {
    isVisible,
    setVisiblity
  };
}

interface UseSceneGraphNodesFilters {
  // If true, include nodes marked as hidden in the GUI
  includeHidden?: boolean;
  // If true, include nodes marked as non-focusable
  includeNonFocusable?: boolean;
}

export function useSceneGraphNodes(filters?: UseSceneGraphNodesFilters): PropertyOwner[] {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  const { includeHidden = false, includeNonFocusable = true } = filters || {};

  // @TODO (2025-04-07, emmbr): Remove dependency on full properties object. This
  // leads to rerendering on every property value change, which is not ideal.
  return (
    useAppSelector((state) => {
      const uris: Uri[] = propertyOwners.Scene?.subowners ?? [];
      const { properties } = state.properties;

      return uris
        .map((uri) => propertyOwners[uri])
        .filter((node) => node !== undefined)
        .filter((node) => {
          const isHidden = isSgnHidden(node.uri, properties);
          const isFocusable = isSgnFocusable(node.uri, properties);

          if (!includeHidden && isHidden) {
            return false;
          }
          if (!includeNonFocusable && !isFocusable) {
            return false;
          }
          return true;
        });
    }, shallowEqual) || []
  );
}

export function useIsSgnFocusable(uri: Uri): boolean {
  return (
    useAppSelector((state) => isSgnFocusable(uri, state.properties.properties)) || false
  );
}
