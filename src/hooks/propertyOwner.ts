import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { propertyOwnerSelectors } from '@/redux/propertyTreeTest/propertyOwnerSlice';
import { propertySelectors } from '@/redux/propertyTreeTest/propertySlice';
import { Identifier, PropertyOwner, Uri } from '@/types/types';
import { EnginePropertyVisibilityKey } from '@/util/keys';
import { checkVisiblity, isPropertyVisible } from '@/util/propertyTreeHelpers';
import { hasVisibleChildren } from '@/util/propertyTreeSelectors';
import { enabledPropertyUri, fadePropertyUri, sgnUri } from '@/util/uris';

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
