import { useMemo } from 'react';

import { useStringProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { PropertyOwner } from '@/types/types';

import { NavigationAimKey, NavigationAnchorKey } from './keys';
import { sgnUri } from './propertyTreeHelpers';

/**
 * Get all the nodes marked in the profile, as a memoized list of property owners.
 */
export function useFeaturedNodes() : PropertyOwner[] {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const markedNodes = useAppSelector((state) => state.profile.markNodes);

  return useMemo(
    () => markedNodes.map(
      (id) => propertyOwners[sgnUri(id)]).filter((po) => po !== undefined
    ),
    [markedNodes, propertyOwners]
  );
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
