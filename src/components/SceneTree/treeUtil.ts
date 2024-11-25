import { PropertyOwners } from "@/types/types";
import { TreeNodeData } from "@mantine/core";

export const GroupPrefixKey = '/groups/';

export function hasChildren(node: TreeNodeData) {
  return node.children !== undefined && node.children.length > 0;
};

export function isGroup(node: TreeNodeData) {
  return node.value.startsWith(GroupPrefixKey);
};

export function isPropertyOwner(node: TreeNodeData) {
  return hasChildren(node) && !isGroup(node);
};

export function treeDataForPropertyOwner(uri: string, propertyOwners: PropertyOwners) {
  const propertyOwner = propertyOwners[uri];
  const properties = propertyOwner?.properties || [];
  const subPropertyOwners = propertyOwner?.subowners || [];
  const children: TreeNodeData[] = [];

  const sortedSubOwners = subPropertyOwners.slice().sort((uriA, uriB) => {
    const a = propertyOwners[uriA]?.name || '';
    const b = propertyOwners[uriB]?.name || '';
    return a.localeCompare(b);
  });

  sortedSubOwners.forEach((subOwner) => {
    children.push(treeDataForPropertyOwner(subOwner, propertyOwners));
  });

  properties.forEach((uri) => {
    children.push({
      label: uri, // No need to get the name of the property here
      value: uri
    });
  });

  return {
    label: propertyOwner?.name || '',
    value: uri,
    children
  };
}
