import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
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
  const [fadePropertyValue] = useProperty('FloatProperty', fadePropertyUri(uri));
  const isFadeable = fadePropertyValue !== undefined;

  const isVisible = checkVisiblity(enabledPropertyValue, fadePropertyValue);

  function setVisiblity(shouldShow: boolean, isImmediate: boolean = false) {
    if (!isFadeable || isImmediate) {
      setEnabledProperty(shouldShow);
    } else if (shouldShow) {
      luaApi?.fadeIn(uri);
    } else {
      luaApi?.fadeOut(uri);
    }
  }

  return {
    isVisible,
    setVisiblity
  };
}
