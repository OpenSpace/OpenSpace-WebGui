import { propertyOwnerSelectors } from '@/redux/propertyTreeTest/propertyOwnerSlice';
import { propertySelectors } from '@/redux/propertyTreeTest/propertySlice';
import { RootState } from '@/redux/store';
import { PropertyOverview, Uri } from '@/types/types';

import { checkVisiblity, isPropertyVisible } from './propertyTreeHelpers';
import { enabledPropertyUri, fadePropertyUri, sgnRenderableUri } from './uris';

export function isPropertyOwnerActive(state: RootState, uri: Uri): boolean {
  const enabledValue = propertySelectors.selectById(state, enabledPropertyUri(uri))
    ?.value as boolean | undefined;
  const fadeValue = propertySelectors.selectById(state, fadePropertyUri(uri))?.value as
    | number
    | undefined;
  return checkVisiblity(enabledValue, fadeValue) || false;
}

/**
 * Is the SGN currently visible, based on its enabled and fade properties?
 */
export function isSgnVisible(state: RootState, uri: Uri): boolean {
  const renderableUri = sgnRenderableUri(uri);
  return isPropertyOwnerActive(state, renderableUri);
}

export function hasVisibleChildren(
  state: RootState,
  ownerUri: Uri,
  visiblitySetting: number | undefined,
  propertyOverview: PropertyOverview
): boolean {
  let queue: Uri[] = [ownerUri];

  while (queue.length > 0) {
    const currentOwner = queue.shift()!;
    const propertyOwner = propertyOwnerSelectors.selectById(state, currentOwner);

    if (!propertyOwner) continue;

    // Check if any of the owner's properties are visible
    if (
      visiblitySetting &&
      propertyOwner.properties.some((uri: Uri) =>
        isPropertyVisible(propertyOverview[uri], visiblitySetting)
      )
    ) {
      return true;
    }

    // Add subowners to the queue for further checking
    queue = queue.concat(propertyOwner.subowners);
  }

  return false;
}
