import { useMemo } from 'react';
import { shallowEqual } from '@mantine/hooks';

import { useAppSelector } from '@/redux/hooks';
import { PropertyOwner, SceneGraphNodeGuiSettings, Uri } from '@/types/types';
import {
  isSgnFocusable,
  isSgnHiddenInGui,
  sgnGuiOrderingNumber,
  sgnGuiPath
} from '@/util/propertyTreeHelpers';

export function useIsSgnFocusable(uri: Uri): boolean {
  return (
    useAppSelector((state) => isSgnFocusable(uri, state.properties.properties)) || false
  );
}

export interface SceneGraphNodesFilters {
  // If true, include nodes marked as hidden in the GUI
  includeGuiHidden?: boolean;
  // If true, only show nodes marked as focusable
  onlyFocusable?: boolean;
  // A list of tags to filter by
  tags?: string[];
}

export function useSceneGraphNodes({
  includeGuiHidden = false,
  onlyFocusable = false,
  tags = undefined
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

        if (!includeGuiHidden && guiSettings.isHidden) {
          return false;
        }
        if (onlyFocusable && !guiSettings.isFocusable) {
          return false;
        }
        if (tags) {
          const hasTag = node.tags.some((tag) => tags.includes(tag));
          if (!hasTag) {
            return false;
          }
        }
        return true;
      });
  }, [propertyOwners, includeGuiHidden, onlyFocusable, tags, sgnGuiSettings]);
}

export interface SgnGuiSettingsMap {
  [key: Uri]: SceneGraphNodeGuiSettings;
}

/**
 * Returns an object with the GUI settings for each scene graph node, mapped by the URI of
 * the property owner for the node.
 */
export function useSceneGraphNodeGuiSettings(): SgnGuiSettingsMap {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  return useAppSelector((state) => {
    const sceneUris: Uri[] = propertyOwners.Scene?.subowners ?? [];

    const guiSettings: SgnGuiSettingsMap = {};

    sceneUris
      .map((uri) => propertyOwners[uri])
      .filter((node) => node !== undefined)
      .forEach((node) => {
        const { properties } = state.properties;

        guiSettings[node.uri] = {
          path: sgnGuiPath(node.uri, properties) || '',
          isHidden: isSgnHiddenInGui(node.uri, properties),
          isFocusable: isSgnFocusable(node.uri, properties),
          guiOrderingNumber: sgnGuiOrderingNumber(node.uri, properties)
        };
      });
    return guiSettings;
  }, shallowEqual);
}
