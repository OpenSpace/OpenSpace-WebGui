import { PropertyVisibilityNumber } from '@/types/enums';
import {
  Identifier,
  Properties,
  Property,
  PropertyOverview,
  PropertyOwner,
  PropertyOwners,
  Uri
} from '@/types/types';

import { InterestingTagKey, ScenePrefixKey } from './keys';

// TODO: Maybe move some of these to a "uriHelpers" file?
export function identifierFromUri(uri: Uri): Identifier {
  // The identifier is always the last word in the URI
  const identifier = uri.split('.').pop();
  if (!identifier) {
    throw Error(`Tried to get identifier from invalid URI '${uri}'`);
  }
  return identifier;
}

export function sgnIdentifierFromSubownerUri(uri: Uri): Identifier {
  const splitUri = uri.split('.');
  if (splitUri.length < 2 || splitUri[0] !== 'Scene') {
    throw Error(`Invalid SGN URI '${uri}'`);
  }
  return splitUri[1];
}

export function sgnRenderableUri(sceneGraphNodeUri: Uri): Uri {
  return `${sceneGraphNodeUri}.Renderable`;
}

export function enabledPropertyUri(propertyOwnerUri: Uri): Uri {
  return `${propertyOwnerUri}.Enabled`;
}

export function fadePropertyUri(propertyOwnerUri: Uri): Uri {
  return `${propertyOwnerUri}.Fade`;
}

export function displayName(propertyOwner: PropertyOwner): string {
  return propertyOwner.name ?? propertyOwner.identifier ?? propertyOwner.uri;
}

export function sgnUri(identifier: Identifier | undefined): Uri {
  return `${ScenePrefixKey}${identifier}`;
}

// Get the uri without the last word, or the full uri if it has no dot
export function removeLastWordFromUri(uri: Uri): Uri {
  const index = uri.lastIndexOf('.');
  return index === -1 ? uri : uri.substring(0, index);
}

export function hasInterestingTag(
  uri: Uri,
  propertyOwners: PropertyOwners
): boolean | undefined {
  return propertyOwners[uri]?.tags.some((tag) => tag.includes(InterestingTagKey));
}

export function guiOrderingNumber(uri: Uri, properties: Properties): number | undefined {
  const shouldUseGuiOrderingNumber = properties[`${uri}.UseGuiOrdering`]?.value || false;
  if (!shouldUseGuiOrderingNumber) {
    return undefined;
  }
  return properties[`${uri}.GuiOrderingNumber`]?.value as number | undefined;
}

export function isSceneGraphNode(uri: Uri): boolean {
  return uri.startsWith(ScenePrefixKey) && uri.split('.').length === 2;
}

export function isRenderable(uri: Uri): boolean {
  return uri.endsWith('.Renderable');
}

export function isSgnTransform(uri: Uri): boolean {
  const isThirdLevel = (uri.match(/\./g) || []).length == 2;
  return (
    isThirdLevel &&
    (uri.endsWith('.Scale') || uri.endsWith('.Translation') || uri.endsWith('.Rotation'))
  );
}

export function isTopLevelPropertyOwner(uri: Uri): boolean {
  return !uri.includes('.');
}

export function isGlobe(renderableUri: Uri, properties: Properties): boolean {
  return properties[`${renderableUri}.Type`]?.value === 'RenderableGlobe';
}

export function isGlobeLayersUri(uri: Uri, properties?: Properties): boolean {
  const isLayers = uri.endsWith('.Renderable.Layers');
  if (!isLayers) {
    return false;
  }

  // If we passed in properties, check if the parent renderable is a globe (beacuse we
  // can). Otherwise, assume it is
  if (properties) {
    const renderableUri = removeLastWordFromUri(uri);
    return isGlobe(renderableUri, properties);
  }

  return true;
}

export function isGlobeLayer(uri: Uri): boolean {
  // The parent of the layer is the layer group
  const layerGroupUri = removeLastWordFromUri(uri);
  // The parent of the layer group should be the layers property owner
  const layersUri = removeLastWordFromUri(layerGroupUri);
  return isGlobeLayersUri(layersUri);
}

export function isPropertyOwnerActive(uri: Uri, properties: Properties): boolean {
  const enabledValue = properties[enabledPropertyUri(uri)]?.value as boolean | undefined;
  const fadeValue = properties[fadePropertyUri(uri)]?.value as number | undefined;
  return checkVisiblity(enabledValue, fadeValue) || false;
}

/**
 * Is the SGN marked to be hidden in the GUI?
 */
export function isSgnHidden(uri: Uri, properties: Properties): boolean {
  const isHidden = properties[`${uri}.GuiHidden`]?.value as boolean | undefined;
  return isHidden || false;
}

/**
 * Is the SGN marked to be non-focusable?
 */
export function isSgnFocusable(uri: Uri, properties: Properties): boolean {
  const isFocusable = properties[`${uri}.Focusable`]?.value as boolean | undefined;
  return isFocusable || false;
}

/**
 * Is the SGN currenlty visible, based on its enabled and fade properties?
 */
export function isSgnVisible(uri: Uri, properties: Properties): boolean {
  const renderableUri = sgnRenderableUri(uri);
  return isPropertyOwnerActive(renderableUri, properties);
}

// Visible means that the object is enabled, based on the values of its enabled and fade
// properties (which both may be undefined)
export function checkVisiblity(
  enabled: boolean | undefined,
  fade: number | undefined
): boolean | undefined {
  // Enabled is required, but fade can be optional
  if (enabled === undefined) {
    return undefined;
  }
  if (fade == undefined) {
    return enabled;
  }
  return enabled && fade > 0;
}

// Returns whether a property matches the current visiblity settings
export function isPropertyVisible(
  property: Property | undefined,
  visiblitySetting: number | undefined
): boolean {
  if (visiblitySetting === undefined || !property) {
    return true;
  }

  const propertyVisibility =
    PropertyVisibilityNumber[property?.description.metaData.Visibility] ?? 0;

  return visiblitySetting >= propertyVisibility;
}

export function hasVisibleChildren(
  ownerUri: Uri,
  visiblitySetting: number | undefined,
  propertyOwners: PropertyOwners,
  properties: PropertyOverview
): boolean {
  let queue: Uri[] = [ownerUri];

  while (queue.length > 0) {
    const currentOwner = queue.shift()!;
    const propertyOwner = propertyOwners[currentOwner];

    if (!propertyOwner) continue;

    // Check if any of the owner's properties are visible
    if (
      visiblitySetting &&
      propertyOwner.properties.some(
        (uri) => visiblitySetting >= properties[uri].visibility
      )
    ) {
      return true;
    }

    // Add subowners to the queue for further checking
    queue = queue.concat(propertyOwner.subowners);
  }

  return false;
}

/**
 * Get the Gui Path for a specific scene graph node, if it exists.
 */
export function getGuiPath(sgnUri: Uri, properties: Properties): string | undefined {
  const guiPath = properties[`${sgnUri}.GuiPath`]?.value;
  if (guiPath !== undefined && typeof guiPath !== 'string') {
    throw new Error(`GuiPath property for '${sgnUri}' is not a string`);
  }
  return guiPath as string | undefined;
}
