import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setPropertyValue } from '@/redux/propertytree/properties/propertiesSlice';
import { Identifier, PropertyOwner, Uri } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import {
  checkVisiblity,
  enabledPropertyUri,
  fadePropertyUri,
  hasVisibleChildren,
  isPropertyVisible,
  sgnUri
} from '@/util/propertyTreeHelpers';

export function usePropertyOwner(uri: Uri): PropertyOwner | undefined {
  return useAppSelector((state) => state.propertyOwners.propertyOwners[uri]);
}

export function useSceneGraphNode(identifier: Identifier): PropertyOwner | undefined {
  const uri = sgnUri(identifier);
  return usePropertyOwner(uri);
}

/**
 * Returns a function that checks whether a scene graph node with the given identifier
 * exists among the propertyOwners.
 */
export function useIsSceneGraphNodeAdded() {
  const { propertyOwners } = useAppSelector((state) => state.propertyOwners);

  function isSceneGraphNodeAdded(identifier: Identifier): boolean {
    const uri = sgnUri(identifier);
    return uri in propertyOwners;
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
      propertyOwnerUri,
      visibilityLevelSetting,
      state.propertyOwners.propertyOwners,
      state.properties.propertyOverview
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

  const propertyOverview = useAppSelector((state) => state.properties.propertyOverview);
  return (
    propertyOwner?.properties.filter((p) =>
      isPropertyVisible(propertyOverview[p], visibilityLevelSetting)
    ) ?? []
  );
}

/**
 * Check if the property ower is visible, based on the current visibility level setting.
 * Also provides a function to set the visibility of the property owner.
 */
export function usePropertyOwnerVisibility(uri: Uri) {
  const luaApi = useOpenSpaceApi();

  const [enabledPropertyValue, setEnabledProperty] = useProperty(
    'BoolProperty',
    enabledPropertyUri(uri)
  );
  const [fadePropertyValue, setFadePropertyValue] = useProperty(
    'FloatProperty',
    fadePropertyUri(uri)
  );
  const isFadeable = fadePropertyValue !== undefined;

  const isVisible = checkVisiblity(enabledPropertyValue, fadePropertyValue);

  function setVisibility(shouldShow: boolean, isImmediate: boolean = false) {
    if (!isFadeable) {
      setEnabledProperty(shouldShow);
    } else if (isImmediate) {
      setEnabledProperty(shouldShow);
      setFadePropertyValue(shouldShow ? 1.0 : 0.0);
    } else if (shouldShow) {
      luaApi?.fadeIn(uri);
    } else {
      luaApi?.fadeOut(uri);
    }
  }

  return {
    isVisible,
    setVisibility
  };
}

export function useSceneGraphNodeVisibility(uri: Uri) {
  const luaApi = useOpenSpaceApi();
  const isVisible = useAppSelector((state) => state.local.sceneTreeVisible?.[uri]);
  const isFadeable = useAppSelector(
    (state) => state.properties.properties[fadePropertyUri(uri)] !== undefined
  );
  const dispatch = useAppDispatch();

  function setVisibility(shouldShow: boolean, isImmediate: boolean = false) {
    if (!isFadeable) {
      // Just setting the value of the property here to avoid subscriptions
      dispatch(setPropertyValue({ uri: enabledPropertyUri(uri), value: shouldShow }));
    } else if (isImmediate) {
      // Just setting the value of the properties here to avoid subscriptions
      dispatch(setPropertyValue({ uri: enabledPropertyUri(uri), value: shouldShow }));
      dispatch(
        setPropertyValue({ uri: fadePropertyUri(uri), value: shouldShow ? 1.0 : 0.0 })
      );
    } else if (shouldShow) {
      luaApi?.fadeIn(uri);
    } else {
      luaApi?.fadeOut(uri);
    }
  }

  return {
    isVisible,
    setVisibility
  };
}
