import { PropertyVisibilityNumber } from '@/types/enums';
import { PropertyOwner } from '@/types/types';

// Visible means that the object is enabled, based on the values of its enabled and fade
// properties (which both may be undefined)
export function checkVisiblity(
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
