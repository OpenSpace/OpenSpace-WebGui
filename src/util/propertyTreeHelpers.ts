import { PropertyVisibilityNumber } from '@/types/enums';
import { PropertyOwner, Visibility } from '@/types/types';

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
