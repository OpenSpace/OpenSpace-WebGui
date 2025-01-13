import { PropertyVisibilityNumber, TransformType } from '@/types/enums';
import {
  Identifier,
  Properties,
  PropertyDetails,
  PropertyOwner,
  PropertyOwners,
  Uri
} from '@/types/types';

import {
  InterestingTagKey,
  LayersSuffixKey,
  RenderableSuffixKey,
  RotationKey,
  ScaleKey,
  ScenePrefixKey,
  TranslationKey
} from './keys';

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
  return `${sceneGraphNodeUri}${RenderableSuffixKey}`;
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

export function sgnUri(identifier: Identifier): Uri {
  return `${ScenePrefixKey}${identifier}`;
}

export function getSgnRenderable(
  sceneGraphNode: PropertyOwner,
  propertyOwners: PropertyOwners
): PropertyOwner | undefined {
  return propertyOwners[sgnRenderableUri(sceneGraphNode.uri)];
}

export function getSgnTransform(
  sceneGraphNode: PropertyOwner,
  transformType: TransformType,
  propertyOwners: PropertyOwners
): PropertyOwner | undefined {
  switch (transformType) {
    case TransformType.Scale:
      return propertyOwners[`${sceneGraphNode.uri}.${ScaleKey}`];
    case TransformType.Translation:
      return propertyOwners[`${sceneGraphNode.uri}.${TranslationKey}`];
    case TransformType.Rotation:
      return propertyOwners[`${sceneGraphNode.uri}.${RotationKey}`];
    default:
      return undefined;
  }
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
  return uri.endsWith(RenderableSuffixKey);
}

export function isGlobe(renderableUri: Uri, properties: Properties): boolean {
  return (
    renderableUri.endsWith(RenderableSuffixKey) &&
    properties[`${renderableUri}.Type`]?.value === 'RenderableGlobe'
  );
}

export function isGlobeLayersUri(uri: Uri, properties: Properties): boolean {
  const isLayers = uri.endsWith(LayersSuffixKey);
  if (!isLayers) {
    return false;
  }
  // The renderable is the parent of the Layers property owner
  const renderableUri = uri.replace(LayersSuffixKey, '');
  return isGlobe(renderableUri, properties);
}

export function isPropertyOwnerHidden(uri: Uri, properties: Properties) {
  const isHidden = properties[`${uri}.GuiHidden`]?.value as boolean | undefined;
  return isHidden || false;
}

export function isSceneGraphNodeVisible(uri: Uri, properties: Properties): boolean {
  const renderableUri = sgnRenderableUri(uri);
  const enabledValue = properties[enabledPropertyUri(renderableUri)]?.value as boolean;
  const fadeValue = properties[fadePropertyUri(renderableUri)]?.value as number;
  return checkVisiblity(enabledValue, fadeValue) || false;
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
  propertyDetails: PropertyDetails | undefined,
  visiblitySetting: number | undefined
): boolean {
  if (visiblitySetting === undefined || !propertyDetails) {
    return true;
  }

  const propertyVisibility =
    PropertyVisibilityNumber[propertyDetails.metaData.Visibility] ?? 0;

  return visiblitySetting >= propertyVisibility;
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
