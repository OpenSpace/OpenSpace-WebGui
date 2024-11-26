import { TreeNodeData } from '@mantine/core';

import { Properties } from '@/types/types';
import { shouldShowPropertyOwner } from '@/util/propertytreehelper';

export const GroupPrefixKey = '/groups/';

export function hasChildren(node: TreeNodeData) {
  return node.children !== undefined && node.children.length > 0;
}

export function isGroup(node: TreeNodeData) {
  return node.value.startsWith(GroupPrefixKey);
}

export function isPropertyOwner(node: TreeNodeData) {
  return hasChildren(node) && !isGroup(node);
}

export function filterTreeData(
  nodes: TreeNodeData[],
  showOnlyEnabled: boolean,
  showHiddenNodes: boolean,
  properties: Properties
): TreeNodeData[] {
  return nodes
    .map((node) => {
      const newNode = { ...node };
      if (newNode.children && newNode.children.length > 0) {
        newNode.children = filterTreeData(
          newNode.children,
          showOnlyEnabled,
          showHiddenNodes,
          properties
        );
        if (newNode.children.length === 0) {
          return null;
        }

        if (isGroup(newNode)) {
          // Groups: Always show, if they have children
          return newNode;
        } else {
          // PropertyOwners, may be filtered out
          const shouldShow = shouldShowPropertyOwner(
            newNode.value,
            properties,
            showOnlyEnabled,
            showHiddenNodes
          );
          return shouldShow ? newNode : null;
        }
      }
      // Properties are returned as is
      return newNode;
    })
    .filter((node) => node !== null) as TreeNodeData[];
}
