import { shallowEqual } from '@mantine/hooks';

import { useAppSelector } from '@/redux/hooks';
import { PropertyOwner, Uri } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import { hasVisibleChildren, isPropertyVisible } from '@/util/propertyTreeHelpers';

import { useOptionProperty } from './properties';

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
export const useGetVisibleProperties = (propertyOwner: PropertyOwner | undefined) => {
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
