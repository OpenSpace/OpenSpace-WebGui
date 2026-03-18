import { PropertyVisibilityNumber } from '@/types/enums';
import { AnyProperty } from '@/types/Property/property';
import { PropertyOwner, Uri, Visibility } from '@/types/types';

// Determines the visibility state of an object based on its enabled and fade properties
export function checkVisibility(
  enabled: boolean | undefined,
  fade: number | undefined // Between 0 and 1
): Visibility | undefined {
  // Enabled is required, but fade can be optional
  // If enabled is undefined, there is no visibility information,
  // so we return undefined
  if (enabled === undefined) {
    return undefined;
  }
  // If there is no fade property, the object is either Visible or
  // Hidden based on the enabled value
  if (fade === undefined) {
    return enabled ? 'Visible' : 'Hidden';
  }
  // This should technically never happen but checking to be sure
  if (fade < 0 || fade > 1) {
    throw new Error(`fade must be between 0 and 1, got ${fade}`);
  }
  // If both enabled and fade are defined, we can determine the visibility
  // based on their values

  // Both enabled and fade are defined
  if (!enabled || fade === 0) {
    return 'Hidden';
  }
  // Enabled is true so determining visibility based on fade value
  return fade === 1 ? 'Visible' : 'Fading';
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

export function hasVisibleChildren(
  propertyOwners: Record<Uri, PropertyOwner | undefined>,
  properties: Record<Uri, AnyProperty | undefined>,
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
      visiblitySetting !== undefined &&
      propertyOwner.properties.some((uri: Uri) =>
        isPropertyVisible(properties[uri]?.metaData?.visibility, visiblitySetting)
      )
    ) {
      return true;
    }

    // Add subowners to the queue for further checking
    queue = queue.concat(propertyOwner.subowners);
  }

  return false;
}
