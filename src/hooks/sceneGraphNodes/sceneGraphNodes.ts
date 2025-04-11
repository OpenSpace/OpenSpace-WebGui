import { useMemo } from 'react';

import { useAppSelector } from '@/redux/hooks';
import { PropertyOwner, SceneGraphNodeGuiSettings, Uri } from '@/types/types';

import { SceneGraphNodesFilters } from './types';
import {
  isSgnFocusable,
  isSgnHiddenInGui,
  sgnGuiOrderingNumber,
  sgnGuiPath
} from './util';

export function useIsSgnFocusable(uri: Uri): boolean {
  return (
    useAppSelector((state) => isSgnFocusable(uri, state.properties.properties)) || false
  );
}

export function useSceneGraphNodes({
  showHiddenNodes = false,
  onlyFocusable = false,
  tags = []
}: SceneGraphNodesFilters = {}): PropertyOwner[] {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const sgnGuiSettings = useSceneGraphNodeGuiSettings();

  return useMemo(() => {
    const sceneUris: Uri[] = propertyOwners.Scene?.subowners ?? [];
    return sceneUris
      .map((uri) => propertyOwners[uri])
      .filter((node) => node !== undefined)
      .filter((node) => {
        const guiSettings = sgnGuiSettings[node.uri];
        if (!guiSettings) {
          return true;
        }

        if (!showHiddenNodes && guiSettings.isHidden) {
          return false;
        }
        if (onlyFocusable && !guiSettings.isFocusable) {
          return false;
        }
        if (tags.length > 0) {
          const hasTag = node.tags.some((tag) => tags.includes(tag));
          if (!hasTag) {
            return false;
          }
        }
        return true;
      });
  }, [propertyOwners, showHiddenNodes, onlyFocusable, tags, sgnGuiSettings]);
}

/**
 * Returns an object with the GUI settings for each scene graph node, mapped by the URI of
 * the property owner for the node.
 *
 * @TODO (2025-04-08, emmbr): If we group the GUI properties into a single property owner,
 * we could potentially clear this up a bit.
 */
export function useSceneGraphNodeGuiSettings(): SceneGraphNodeGuiSettings {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
  const properties = useAppSelector((state) => state.properties.properties);

  return useMemo(() => {
    const sceneUris: Uri[] = propertyOwners.Scene?.subowners ?? [];
    const guiSettings: SceneGraphNodeGuiSettings = {};
    sceneUris
      .map((uri) => propertyOwners[uri])
      .filter((node) => node !== undefined)
      .forEach((node) => {
        guiSettings[node.uri] = {
          path: sgnGuiPath(node.uri, properties) || '',
          isHidden: isSgnHiddenInGui(node.uri, properties),
          isFocusable: isSgnFocusable(node.uri, properties),
          // @TODO (emmbr, 2024-04-08): The GUI number here is currently not used
          // anywhere, but we should try to rewrite the code to use it instead of
          // the current approach in the scene tree
          guiOrderingNumber: sgnGuiOrderingNumber(node.uri, properties)
        };
      });
    return guiSettings;
  }, [propertyOwners, properties]);
}
