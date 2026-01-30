import { Identifier, Uri } from '@/types/types';

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

export function sgnUri(identifier: Identifier | undefined): Uri {
  return `${ScenePrefixKey}${identifier}`;
}

// Get the uri without the last word, or the full uri if it has no dot
export function removeLastWordFromUri(uri: Uri): Uri {
  const index = uri.lastIndexOf('.');
  return index === -1 ? uri : uri.substring(0, index);
}

export function guiOrderingNumberUri(uri: Uri): string {
  return `${uri}.UseGuiOrdering`;
}

export function isFadePropertyUri(uri: Uri): boolean {
  return uri.endsWith('.Fade');
}

export function isEnabledPropertyUri(uri: Uri): boolean {
  return uri.endsWith('.Enabled');
}

export function isSceneGraphNodeProperty(uri: Uri): boolean {
  return (
    uri.startsWith(ScenePrefixKey) &&
    uri.split('.').length > 2 &&
    removeLastWordFromUri(uri).endsWith('.Renderable')
  );
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

export function parentTypeUri(uri: Uri): string {
  const renderableUri = removeLastWordFromUri(uri);
  return `${renderableUri}.Type`;
}

export function isUriRenderableGlobe(uri: Uri): boolean {
  return uri === 'RenderableGlobe';
}

export function isGlobeLayersUri(uri: Uri): boolean {
  const isLayers = uri.endsWith('.Renderable.Layers');
  if (!isLayers) {
    return false;
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
