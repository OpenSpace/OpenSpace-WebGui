import { useMemo } from 'react';

import { useStringProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { Uri } from '@/types/types';

import { NavigationAimKey, NavigationAnchorKey } from './keys';
import { hasInterestingTag, sgnUri } from './propertyTreeHelpers';

export function useInterestingTagOwners() {
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

export function useAnchorNode() {
  const [anchor] = useStringProperty(NavigationAnchorKey);
  const anchorNode = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[sgnUri(anchor)]
  );
  return anchorNode;
}

export function useAimNode() {
  const [aim] = useStringProperty(NavigationAimKey);
  const aimNode = useAppSelector(
    (state) => state.propertyOwners.propertyOwners[sgnUri(aim)]
  );

  return aimNode;
}
