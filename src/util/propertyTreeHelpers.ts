import { PropertyVisibilityNumber } from '@/types/enums';
import { AnyProperty } from '@/types/Property/property';
import { Properties, PropertyOwner, Uri, Visibility } from '@/types/types';

import { enabledPropertyUri, fadePropertyUri } from './uris';

// Visible means that the object is enabled, based on the values of its enabled and fade
// properties (which both may be undefined)
export function checkVisibilityTest(
  enabled: boolean | undefined,
  fade: number | undefined
): Visibility | undefined {
  // Enabled is required, but fade can be optional
  if (enabled === undefined) {
    return undefined;
  }
  if (fade == undefined) {
    return 'Visible';
  }
  if (enabled === true && fade < 1 && fade > 0) {
    return 'Fading';
  }
  if (enabled === false || fade === 0) {
    return 'Hidden';
  } else return 'Visible';
}

// Visible means that the object is enabled, based on the values of its enabled and fade
// properties (which both may be undefined)
export function checkVisibility(
  enabled: boolean | undefined,
  fade: number | undefined
): boolean | undefined {
  // Enabled is required, but fade can be optional
  if (enabled === undefined) {
    return undefined;
  }
  if (fade == undefined) {
    return enabled;
  }
  return enabled && fade > 0;
}

// Returns whether a property matches the current visiblity settings
export function isPropertyVisible(
  propertyVisibility: keyof typeof PropertyVisibilityNumber | undefined,
  visiblitySetting: number | undefined
): boolean {
  if (visiblitySetting === undefined || propertyVisibility === undefined) {
    return true;
  }

  return visiblitySetting >= PropertyVisibilityNumber[propertyVisibility];
}

export function displayName(propertyOwner: PropertyOwner): string {
  return propertyOwner.name ?? propertyOwner.identifier ?? propertyOwner.uri;
}

export function isPropertyOwnerVisible(properties: Properties, uri: Uri): boolean {
  const enabledValue = properties[enabledPropertyUri(uri)]?.value as boolean | undefined;
  const fadeValue = properties[fadePropertyUri(uri)]?.value as number | undefined;
  return checkVisibility(enabledValue, fadeValue) || false;
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
