import { TreeNodeData } from '@mantine/core';

import { Properties } from '@/types/types';
import { shouldShowSceneGraphNode } from '@/util/propertyTreeHelpers';

export const GroupPrefixKey = '/groups/';

export function isGroupTreeNodeValue(treeNodeDataValue: string) {
  return treeNodeDataValue.startsWith(GroupPrefixKey);
}

export function isGroup(node: TreeNodeData) {
  return isGroupTreeNodeValue(node.value);
}

export function filterTreeData(
  nodes: TreeNodeData[],
  showOnlyVisible: boolean,
  showHiddenNodes: boolean,
  properties: Properties
): TreeNodeData[] {
  return nodes
    .map((node) => {
      const newNode = { ...node };
      if (isGroup(newNode)) {
        // Groups => filter children
        newNode.children = filterTreeData(
          newNode.children || [],
          showOnlyVisible,
          showHiddenNodes,
          properties
        );
        if (newNode.children.length === 0) {
          // Don't show empty groups
          return null;
        }
        return newNode;
      } else {
        // PropertyOwners (scene graph nodes), may be filtered out based on settings
        const shouldShow = shouldShowSceneGraphNode(
          newNode.value,
          properties,
          showOnlyVisible,
          showHiddenNodes
        );
        return shouldShow ? newNode : null;
      }
    })
    .filter((node) => node !== null) as TreeNodeData[];
}
