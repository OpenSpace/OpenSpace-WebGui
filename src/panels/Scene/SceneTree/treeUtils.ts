import { SceneTreeNodeData } from './types';

/**
 * Create the data for a Scene tree node representing a scene graph node.
 */
export function treeDataForSceneGraphNode(
  name: string,
  uri: string,
  path?: string
): SceneTreeNodeData {
  return {
    label: name || '',
    value: uri,
    guiPath: path?.split('/') ?? []
  };
}
