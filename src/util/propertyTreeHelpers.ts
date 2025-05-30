import {
  Identifier,
  Properties,
  PropertyOverview,
  PropertyOverviewData,
  PropertyOwner,
  PropertyOwners,
  Uri
} from '@/types/types';

import { ScenePrefixKey } from './keys';

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
 * Is the SGN currently visible, based on its enabled and fade properties?
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
  propertyData: PropertyOverviewData | undefined,
  visiblitySetting: number | undefined
): boolean {
  if (visiblitySetting === undefined || !propertyData) {
    return true;
  }

  return visiblitySetting >= propertyData.visibility;
}

export function hasVisibleChildren(
  ownerUri: Uri,
  visiblitySetting: number | undefined,
  propertyOwners: PropertyOwners,
  propertyOverview: PropertyOverview
): boolean {
  let queue: Uri[] = [ownerUri];

  while (queue.length > 0) {
    const currentOwner = queue.shift()!;
    const propertyOwner = propertyOwners[currentOwner];

    if (!propertyOwner) continue;

    // Check if any of the owner's properties are visible
    if (
      visiblitySetting &&
      propertyOwner.properties.some((uri) =>
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
