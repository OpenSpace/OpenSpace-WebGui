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

export function collectSearchableItemsRecursively(
  owners: Uri[],
  allPropertyOwners: PropertyOwners,
  collectedOwners: Uri[],
  collectedProperties: Uri[]
) {
  owners.forEach((uri) => {
    const subowners = allPropertyOwners[uri]?.subowners || [];
    const propertiesUri = allPropertyOwners[uri]?.properties || [];

    collectedOwners = collectedOwners.concat(subowners);
    collectedProperties = collectedProperties.concat(propertiesUri);

    [collectedOwners, collectedProperties] = collectSearchableItemsRecursively(
      subowners,
      allPropertyOwners,
      collectedOwners,
      collectedProperties
    );
  });
  return [collectedOwners, collectedProperties];
}
