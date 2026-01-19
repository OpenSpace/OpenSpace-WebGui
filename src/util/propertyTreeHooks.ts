import { useProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { propertyOwnerSelectors } from '@/redux/propertyTreeTest/propertyOwnerSlice';
import { PropertyOwner } from '@/types/types';

import { NavigationAimKey, NavigationAnchorKey } from './keys';
import { sgnUri } from './uris';

/**
 * Get all the nodes marked in the profile, as a list of property owners.
 */
export function useFeaturedNodes(): PropertyOwner[] {
  const propertyOwners = useAppSelector((state) =>
    propertyOwnerSelectors.selectEntities(state)
  );
  const markedNodes = useAppSelector((state) => state.profile.markNodes);
  return markedNodes.map((uri) => propertyOwners[sgnUri(uri)]);
}

export function useAnchorNode() {
  const [anchor] = useProperty('StringProperty', NavigationAnchorKey);
  const anchorNode = useAppSelector((state) =>
    propertyOwnerSelectors.selectById(state, sgnUri(anchor))
  );
  return anchorNode;
}

export function useAimNode() {
  const [aim] = useProperty('StringProperty', NavigationAimKey);
  const aimNode = useAppSelector((state) =>
    propertyOwnerSelectors.selectById(state, sgnUri(aim))
  );

  return aimNode;
}
