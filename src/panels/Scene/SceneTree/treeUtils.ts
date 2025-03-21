import { SceneTreeNodeData } from './types';

// This key is added to the group path values in the tree data structure, to mark which
// tree nodes correspond to groups (as opposed to scene graph nodes).
export const SceneTreeGroupPrefixKey = '/groups/';

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

/**
 * Check if a node in the Scene tree is a group node, meaning that its identifiing value
 * starts with the specified prefix.
 */
export function isGroupNode(node: SceneTreeNodeData): boolean {
  return node.value.startsWith(SceneTreeGroupPrefixKey);
}
