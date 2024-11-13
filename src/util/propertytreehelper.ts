import { Properties, PropertyOwners } from 'src/types/types';

import { EnginePropertyVisibilityKey, InterestingTagKey } from './keys';

export function hasInterestingTag(uri: string, propertyOwners: PropertyOwners) {
  return propertyOwners[uri]?.tags.some((tag: string) => tag.includes(InterestingTagKey));
}

/**
 * Filter based on show enabled/hidden
 */
export function shouldShowPropertyOwner(
  uri: string,
  properties: Properties,
  showOnlyEnabled: boolean,
  showHidden: boolean
) {
  let shouldShow = true;
  if (showOnlyEnabled) {
    shouldShow &&= isVisible(properties, uri);
  }
  if (!showHidden) {
    shouldShow &&= !isPropertyOwnerHidden(properties, uri);
  }
  return shouldShow;
}

export function isPropertyOwnerHidden(properties: Properties, uri: string) {
  const prop = properties[`${uri}.GuiHidden`];
  if (prop && prop.value) {
    return true;
  }
  return false;
}

export function isPropertyVisible(properties: Properties, uri: string) {
  const visibility = properties[uri]?.description?.metaData?.Visibility;
  const visibilitySetting = properties[EnginePropertyVisibilityKey]?.value;

  if (
    !visibility ||
    typeof visibilitySetting !== 'number' ||
    typeof visibility !== 'string'
  ) {
    return false;
  }

  const VisibilityLevelMap: { [key: string]: number } = {
    Hidden: 5,
    Developer: 4,
    AdvancedUser: 3,
    User: 2,
    NoviceUser: 1,
    Always: 0
  };
  return visibilitySetting >= (VisibilityLevelMap[visibility] || 0);
}

export function isRenderable(uri: string) {
  const splitUri = uri.split('.');
  return splitUri.length > 1 && splitUri[splitUri.length - 1] === 'Renderable'; // TODO: Use pop() ?
}

/**
 * Check if this property owner has a fade property, or a renderable with the property.
 * Note that a fadeable must have both the Fade and Enabled property, on the same level.
 */
export function findFadePropertyUri(properties: Properties, uri: string) {
  if (!isRenderable(uri) && properties[`${uri}.Fade`] && properties[`${uri}.Enabled`]) {
    return `${uri}.Fade`;
  }
  if (properties[`${uri}.Renderable.Fade`] && properties[`${uri}.Renderable.Enabled`]) {
    return `${uri}.Renderable.Fade`;
  }
  return undefined;
}

/**
 * Check if this property owner has an enabled property, or a renderable with the property
 */
export function findEnabledPropertyUri(properties: Properties, uri: string) {
  if (!isRenderable(uri) && properties[`${uri}.Enabled`]) {
    return `${uri}.Enabled`;
  }
  if (properties[`${uri}.Renderable.Enabled`]) {
    return `${uri}.Renderable.Enabled`;
  }
  return undefined;
}

/**
 * Visible means that the object is enabled and has a fade value that's not zero
 * ownerUri is the uri of the property owner that we want to check is visible or not
 */
export function isVisible(properties: Properties, ownerUri: string) {
  const enabledUri = findEnabledPropertyUri(properties, ownerUri);
  const fadeUri = findFadePropertyUri(properties, ownerUri);

  // console.log(fadeUri)

  // Enabled is required. But fade can be optional
  if (!enabledUri || !properties[enabledUri]) {
    return false;
  }

  const isEnabled = properties[enabledUri].value;
  if (typeof isEnabled !== 'boolean') {
    return false;
  }

  // Make fade == 0 correspond to disabled, according to the checkbox
  if (!fadeUri || !properties[fadeUri]) {
    return isEnabled;
  }

  const fadeValue = properties[fadeUri].value;
  if (typeof fadeValue !== 'number') {
    return isEnabled;
  }

  return isEnabled && fadeValue > 0;
}
