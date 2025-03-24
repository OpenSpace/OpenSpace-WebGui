import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';

import { NavigationAimKey, NavigationAnchorKey } from './keys';
import { hasInterestingTag, sgnUri } from './propertyTreeHelpers';
import { useStringProperty } from '@/hooks/properties';

export function useGetInterestingTagOwners() {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  const sortedDefaultList = useMemo(() => {
    const uris: Uri[] = propertyOwners.Scene?.subowners ?? [];
    const markedInterestingNodeUris = uris.filter((uri) =>
      hasInterestingTag(uri, propertyOwners)
    );
    const favorites = markedInterestingNodeUris
      .map((uri) => propertyOwners[uri])
      .filter((po) => po !== undefined);
    return favorites.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [propertyOwners]);

  return sortedDefaultList;
}

export function useGetAnchorNode() {
  const [anchor] = useStringProperty(NavigationAnchorKey);
  const anchorNode = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[sgnUri(anchor)]
  );
  return anchorNode;
}

export function useGetAimNode() {
  const [aim] = useStringProperty(NavigationAimKey);
  const aimNode = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[sgnUri(aim)]
  );

  return aimNode;
}
