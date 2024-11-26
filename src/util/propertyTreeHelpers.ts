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
