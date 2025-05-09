import { shallowEqual } from '@mantine/hooks';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { PropertyOwner, Uri } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import {
  checkVisiblity,
  enabledPropertyUri,
  fadePropertyUri,
  hasVisibleChildren,
  isPropertyVisible
} from '@/util/propertyTreeHelpers';

export function usePropertyOwner(uri: Uri): PropertyOwner | undefined {
  return useAppSelector((state) => state.propertyOwners.propertyOwners[uri]);
}

export const useHasVisibleChildren = (propertyOwnerUri: Uri): boolean => {
  const [visibilityLevelSetting] = useProperty(
    'OptionProperty',
    EnginePropertyVisibilityKey
  );

  return useAppSelector((state) => {
    return hasVisibleChildren(
      propertyOwnerUri,
      visibilityLevelSetting,
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
  const [visibilityLevelSetting] = useProperty(
    'OptionProperty',
    EnginePropertyVisibilityKey
  );

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
          isPropertyVisible(state.properties.properties[p], visibilityLevelSetting)
        ),
      shallowEqual
    ) || []
  );
};

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
