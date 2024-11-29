import { Properties, PropertyOwners } from '@/types/types';

import { InterestingTagKey } from './keys';

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

export function shouldShowSceneGraphNode(
  uri: string,
  properties: Properties,
  showOnlyVisible: boolean,
  showHidden: boolean
) {
  let shouldShow = true;
  if (showOnlyVisible) {
    shouldShow &&= isSceneGraphNodeVisible(uri, properties);
  }
  if (!showHidden) {
    shouldShow &&= !isPropertyOwnerHidden(properties, uri);
  }
  return shouldShow;
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
