import { PropertyOwners, Uri } from '@/types/types';

export enum SearchItemType {
  SubPropertyOwner,
  PropertyOwner,
  Property
}

export interface SearchItem {
  type: SearchItemType;
  uri: string;
  searchKeys: string[];
}

export function collectSearchableItems(
  owners: Uri[],
  allPropertyOwners: PropertyOwners
): [Uri[], Uri[]] {
  let collectedOwners: Uri[] = [];
  let collectedProperties: Uri[] = [];
  let queue: Uri[] = [...owners];

  while (queue.length > 0) {
    const uri = queue.shift()!;
    const subowners = allPropertyOwners[uri]?.subowners || [];
    const propertiesUri = allPropertyOwners[uri]?.properties || [];

    collectedOwners = collectedOwners.concat(subowners);
    collectedProperties = collectedProperties.concat(propertiesUri);
    queue = queue.concat(subowners);
  }

  return [collectedOwners, collectedProperties];
}
