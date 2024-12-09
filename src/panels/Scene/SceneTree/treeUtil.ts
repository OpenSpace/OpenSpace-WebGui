import { TreeNodeData } from '@mantine/core';

import { Properties, PropertyOwners } from '@/types/types';
import {
  isPropertyOwnerHidden,
  isSceneGraphNodeVisible
} from '@/util/propertyTreeHelpers';

export const GroupPrefixKey = '/groups/';

export function isGroup(treeNodeDataValue: string) {
  return treeNodeDataValue.startsWith(GroupPrefixKey);
}

export function isGroupNode(node: TreeNodeData) {
  return isGroup(node.value);
}

export interface SceneTreeFilterProps {
  showOnlyVisible: boolean;
  showHiddenNodes: boolean;
  tags: string[];
}

export function filterTreeData(
  nodes: TreeNodeData[],
  filter: SceneTreeFilterProps,
  properties: Properties,
  propertyOwners: PropertyOwners
): TreeNodeData[] {
  return nodes
    .map((node) => {
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
        function shouldShowSceneGraphNode(uri: string) {
          let shouldShow = true;
          if (filter.showOnlyVisible) {
            shouldShow &&= isSceneGraphNodeVisible(uri, properties);
          }
          if (!filter.showHiddenNodes) {
            shouldShow &&= !isPropertyOwnerHidden(properties, uri);
          }
          if (shouldShow && filter.tags.length > 0) {
            shouldShow &&= filter.tags.some((tag) =>
              propertyOwners[newNode.value]?.tags.includes(tag)
            );
          }
          return shouldShow;
        }

        // PropertyOwners (scene graph nodes), may be filtered out based on settings
        const shouldShow = shouldShowSceneGraphNode(newNode.value);
        return shouldShow ? newNode : null;
      }
    })
    .filter((node) => node !== null) as TreeNodeData[];
}
