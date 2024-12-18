import { PropertyOwners, Uri } from '@/types/types';

import { InterestingTagKey } from './keys';

export function hasInterestingTag(propertyOwners: PropertyOwners, uri: Uri) {
  return propertyOwners[uri]?.tags.some((tag) => tag.includes(InterestingTagKey));
}
