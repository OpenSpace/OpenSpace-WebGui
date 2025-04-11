import { Properties, Uri } from '@/types/types';

import { SceneGraphNodesFilters } from './types';

/**
 * Get the GUI ordering number for a specific scene graph node, if it should be used.
 * Otherwise, return undefined.
 */
export function sgnGuiOrderingNumber(
  uri: Uri,
  properties: Properties
): number | undefined {
  const shouldUseGuiOrderingNumber = properties[`${uri}.UseGuiOrdering`]?.value || false;
  if (!shouldUseGuiOrderingNumber) {
    return undefined;
  }
  return properties[`${uri}.GuiOrderingNumber`]?.value as number | undefined;
}

/**
 * Get the GUI Path for a specific scene graph node, if it exists.
 */
export function sgnGuiPath(sgnUri: Uri, properties: Properties): string {
  const guiPath = properties[`${sgnUri}.GuiPath`]?.value;
  if (guiPath !== undefined && typeof guiPath !== 'string') {
    throw new Error(`GuiPath property for '${sgnUri}' is not a string`);
  }
  return guiPath || '/';
}

/**
 * Is the SGN marked to be hidden in the GUI?
 */
export function isSgnHiddenInGui(uri: Uri, properties: Properties): boolean {
  const isHidden = properties[`${uri}.GuiHidden`]?.value as boolean | undefined;
  return isHidden || false;
}

/**
 * Is the SGN marked to be non-focusable in the GUI?
 */
export function isSgnFocusable(uri: Uri, properties: Properties): boolean {
  const isFocusable = properties[`${uri}.Focusable`]?.value as boolean | undefined;
  return isFocusable || false;
}

export function hasActiveFilters(filters: SceneGraphNodesFilters): boolean {
  return (
    filters.showHiddenNodes ||
    filters.onlyFocusable ||
    (filters.tags && filters.tags.length > 0) ||
    false
  );
}
