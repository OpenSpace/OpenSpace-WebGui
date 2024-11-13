import { PropertyOwners } from 'src/types/types';

import { InterestingTagKey } from './keys';

export function hasInterestingTag(propertyOwners: PropertyOwners, uri: string) {
  return propertyOwners[uri]?.tags.some((tag) => tag.includes(InterestingTagKey));
}
