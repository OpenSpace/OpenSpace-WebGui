import { AnyProperty } from '@/types/Property/property';
import { Properties, PropertyOwner, Uri } from '@/types/types';

import { checkVisibility, isPropertyVisible } from './propertyTreeHelpers';
import { enabledPropertyUri, fadePropertyUri, sgnRenderableUri } from './uris';

export function isPropertyOwnerVisible(properties: Properties, uri: Uri): boolean {
  const enabledValue = properties[enabledPropertyUri(uri)]?.value as boolean | undefined;
  const fadeValue = properties[fadePropertyUri(uri)]?.value as number | undefined;
  return checkVisibility(enabledValue, fadeValue) || false;
}

/**
 * Is the SGN currently visible, based on its enabled and fade properties?
 */
export function isSgnVisible(properties: Properties, uri: Uri): boolean {
  const renderableUri = sgnRenderableUri(uri);
  return isPropertyOwnerActive(properties, renderableUri);
}

export function hasVisibleChildren(
  propertyOwners: Record<Uri, PropertyOwner>,
  properties: Record<Uri, AnyProperty>,
  ownerUri: Uri,
  visiblitySetting: number | undefined
): boolean {
  let queue: Uri[] = [ownerUri];

  while (queue.length > 0) {
    const currentOwner = queue.shift()!;
    const propertyOwner = propertyOwners[currentOwner];

    if (!propertyOwner) continue;

    // Check if any of the owner's properties are visible
    if (
      visiblitySetting &&
      propertyOwner.properties.some((uri: Uri) =>
        isPropertyVisible(properties[uri].metaData.visibility, visiblitySetting)
      )
    ) {
      return true;
    }

    // Add subowners to the queue for further checking
    queue = queue.concat(propertyOwner.subowners);
  }

  return false;
}
