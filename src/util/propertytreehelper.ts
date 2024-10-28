import { PropertyOwners } from "src/types/types";

import { InterestingTag } from "./keys";

export function hasInterestingTag(uri: string, propertyOwners: PropertyOwners) {
  return propertyOwners[uri]?.tags.some((tag: string) => tag.includes(InterestingTag));
}
