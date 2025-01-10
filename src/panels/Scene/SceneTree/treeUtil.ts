import { TreeNodeData } from '@mantine/core';

import { Properties, PropertyOwners, Uri } from '@/types/types';
import {
  isPropertyOwnerHidden,
  isSceneGraphNodeVisible
} from '@/util/propertyTreeHelpers';

export const GroupPrefixKey = '/groups/';

export function isGroup(treeNodeDataValue: string): boolean {
  return treeNodeDataValue.startsWith(GroupPrefixKey);
}

export function isGroupNode(node: TreeNodeData): boolean {
  return isGroup(node.value);
}

export interface SceneTreeFilterSettings {
  showOnlyVisible: boolean;
  showHiddenNodes: boolean;
  tags: string[];
}

export function filterTreeData(
  nodes: TreeNodeData[],
  filter: SceneTreeFilterSettings,
  properties: Properties,
  propertyOwners: PropertyOwners
): TreeNodeData[] {
  // Should the scene graph node be shown based on the current filter settings?
  function shouldShowSceneGraphNode(uri: Uri) {
    let shouldShow = true;
    if (filter.showOnlyVisible) {
      shouldShow &&= isSceneGraphNodeVisible(uri, properties);
    }
    if (!filter.showHiddenNodes) {
      shouldShow &&= !isPropertyOwnerHidden(uri, properties);
    }
    if (shouldShow && filter.tags.length > 0) {
      shouldShow &&= filter.tags.some((tag) => propertyOwners[uri]?.tags.includes(tag));
    }
    return shouldShow;
  }

  // Recursively apply filtering to one node in the tree. That is, if the node is a group,
  // filter its children. Set the nodes that should be filtered out to null, so that the
  // filtering can be done in a separate step.
  function recursivelyFilterSubTree(node: TreeNodeData): TreeNodeData | null {
    const newNode = { ...node };
    if (isGroupNode(newNode)) {
      // Groups => filter children
      newNode.children = filterTreeData(
        newNode.children || [],
        filter,
        properties,
        propertyOwners
      );
      if (newNode.children.length === 0) {
        // Don't show empty groups
        return null;
      }
      return newNode;
    } else {
      // PropertyOwners (scene graph nodes), may be filtered out based on current
      // filter settings
      return shouldShowSceneGraphNode(newNode.value) ? newNode : null;
    }
  }

  const filteredNodes = nodes
    .map((node) => recursivelyFilterSubTree(node))
    .filter((node) => node !== null);

  return filteredNodes || [];
}
