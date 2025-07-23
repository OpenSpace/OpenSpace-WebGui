import { PropertyOwner } from '@/types/types';
import { useImageExists } from '@/util/fileIOhooks';
import { useWebGuiUrl } from '@/util/networkingHooks';

/**
 * Gets the path to the map image for a given scene graph node, from the files hosted by
 * OpenSpace.
 * @param sceneGraphNode The scene graph node to get the map path for.
 * @returns A tuple containing the path to the map image and a boolean indicating whether
 *          the map exists.
 */
export function useMapPath(
  sceneGraphNode: PropertyOwner | undefined
): [path: string, mapExists: boolean] {
  const baseUrl = useWebGuiUrl();
  const path = `${baseUrl}/assets/maps/${sceneGraphNode?.identifier.toLowerCase()}.jpg`;
  const mapExists = useImageExists(path);

  return [path, mapExists];
}
