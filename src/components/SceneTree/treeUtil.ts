import { TreeNodeData } from '@mantine/core';

import { Properties } from '@/types/types';
import { shouldShowPropertyOwner } from '@/util/propertytreehelper';

export const GroupPrefixKey = '/groups/';

export function isGroup(node: TreeNodeData) {
  return node.value.startsWith(GroupPrefixKey);
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
      if (isGroup(newNode)) {
        // Groups => filter children
        newNode.children = filterTreeData(
          newNode.children || [],
          showOnlyEnabled,
          showHiddenNodes,
          properties
        );
        if (newNode.children.length === 0) {
          // Don't show empty groups
          return null;
        }
        return newNode;
      }
      else {
        // PropertyOwners, may be filtered out based on settings
        const shouldShow = shouldShowPropertyOwner(
          newNode.value,
          properties,
          showOnlyEnabled,
          showHiddenNodes
        );
        return shouldShow ? newNode : null;
      }
    })
    .filter((node) => node !== null) as TreeNodeData[];
}
