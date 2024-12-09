import {
  Properties,
  PropertyDetails,
  PropertyOwner,
  PropertyOwners,
  PropertyVisibility
} from '@/types/types';

import { InterestingTagKey } from './keys';

export function identifierFromUri(uri: string) {
  // The identifier is always the last word in the URI
  const identifier = uri.split('.').pop();
  if (!identifier) {
    throw Error(`Tried to get identifier from invalid URI '${uri}'`);
  }
  return identifier;
}

export function sgnIdentifierFromSubownerUri(uri: string) {
  const splitUri = uri.split('.');
  if (splitUri.length < 2 || splitUri[0] !== 'Scene') {
    throw Error(`Invalid SGN URI '${uri}'`);
  }
  return splitUri[1];
}

export function displayName(propertyOwner: PropertyOwner) {
  return propertyOwner.name ?? propertyOwner.identifier ?? propertyOwner.uri;
}

export function hasInterestingTag(uri: string, propertyOwners: PropertyOwners) {
  return propertyOwners[uri]?.tags.some((tag) => tag.includes(InterestingTagKey));
}

export function guiOrderingNumber(
  properties: Properties,
  uri: string
): number | undefined {
  const shouldUseGuiOrderingNumber = properties[`${uri}.UseGuiOrdering`]?.value || false;
  if (!shouldUseGuiOrderingNumber) {
    return undefined;
  }
  return properties[`${uri}.GuiOrderingNumber`]?.value as number | undefined;
}

export function isRenderable(uri: string) {
  const renderableSuffix = '.Renderable';
  return uri.endsWith(renderableSuffix);
}

export function isGlobe(renderableUri: string, properties: Properties) {
  const renderableSuffix = '.Renderable';
  return (
    renderableUri.endsWith(renderableSuffix) &&
    properties[`${renderableUri}.Type`]?.value === 'RenderableGlobe'
  );
}

export function isGlobeLayersUri(uri: string, properties: Properties) {
  const suffix = '.Renderable.Layers';
  return uri.endsWith(suffix) && isGlobe(uri.replace('.Layers', ''), properties);
}

export function isPropertyOwnerHidden(properties: Properties, uri: string) {
  const prop = properties[`${uri}.GuiHidden`];
  if (prop && prop.value) {
    return true;
  }
  return false;
}

export function isSceneGraphNodeVisible(uri: string, properties: Properties) {
  const renderableUri = `${uri}.Renderable`;
  const enabledValue = properties[`${renderableUri}.Enabled`]?.value as boolean;
  const fadeValue = properties[`${renderableUri}.Fade`]?.value as number;
  return checkVisiblity(enabledValue, fadeValue) || false;
}

// Visible means that the object is enabled, based on the values of its enabled and fade
// properties (which both may be undefined)
export function checkVisiblity(enabled: boolean | undefined, fade: number | undefined) {
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
) {
  if (visiblitySetting === undefined || !propertyDetails) {
    return true;
  }

  function propertyVisibilityNumber(visibility: PropertyVisibility) {
    switch (visibility) {
      case 'Hidden':
        return 5;
      case 'Developer':
        return 4;
      case 'AdvancedUser':
        return 3;
      case 'User':
        return 2;
      case 'NoviceUser':
        return 1;
      case 'Always':
        return 0;
      default:
        return 0;
    }
  }

  const propertyVisibility = propertyVisibilityNumber(
    propertyDetails.metaData.Visibility
  );
  return visiblitySetting >= propertyVisibility;
}
