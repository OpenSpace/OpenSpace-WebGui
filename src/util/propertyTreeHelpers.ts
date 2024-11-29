import { Properties, PropertyOwners } from '@/types/types';

import { InterestingTagKey } from './keys';

export function hasInterestingTag(propertyOwners: PropertyOwners, uri: string) {
  return propertyOwners[uri]?.tags.some((tag) => tag.includes(InterestingTagKey));
}

export function guiOrderingNumber(
  properties: Properties,
  uri: string
): number | undefined {
  const shouldUseGuiOrderingNumber = properties[`${uri}.UseGuiOrdering`]?.value || false;
  if (!shouldUseGuiOrderingNumber) {
    return undefined;
  }
  return properties[`${uri}.GuiOrderingNumber`]?.value as number | undefined;
}

export function isRenderable(uri: string) {
  const renderableSuffix = '.Renderable';
  return uri.endsWith(renderableSuffix);
}

// Visible means that the object is enabled, based on the values of its enabled and fade
// properties (which both may be undefined)
export function checkIfVisible(enabled: boolean | undefined, fade: number | undefined) {
  // Enabled is required, but fade can be optional
  if (enabled === undefined) {
    return undefined;
  }

  if (fade == undefined) {
    return enabled;
  }

  return enabled && fade > 0;
}
