import { Groups } from "@/redux/groups/groupsSlice";
import { PropertyOwners } from "@/types/types";
import { TreeNodeData } from "@mantine/core";

export const GroupPrefixKey = '/groups/';

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
      label: uri,
      value: uri
    });
  });

  return {
    label: propertyOwner?.name || '',
    value: uri,
    children
  };
}

export function treeDataFromGroups(groups: Groups, propertyOwners: PropertyOwners) {
  const treeData: TreeNodeData[] = [];

  // const customGuiGroupOrdering = useAppSelector(
  //   (state) => state.groups.customGroupOrdering
  // );

  const topLevelGroupsPaths = Object.keys(groups).filter((path) => {
    // Get the number of slashes in the path
    const depth = (path.match(/\//g) || []).length;
    return depth === 1 && path !== '/';
  });

  // TODO: Filter the nodes and property owners based on visiblity
  // TODO: Remember which parts of the menu were open?

  // Build the data structure for the tree
  function generateGroupData(path: string) {
    const splitPath = path.split('/');
    const name = splitPath.length > 1 ? splitPath.pop() : 'Untitled';

    const groupItem: TreeNodeData = {
      value: GroupPrefixKey + path,
      label: name,
      children: []
    };

    const groupData = groups[path];

    // Add subgroups, recursively
    groupData.subgroups.forEach((subGroupPath) =>
      groupItem.children?.push(generateGroupData(subGroupPath))
    );

    // Add property owners, also recursively
    groupData.propertyOwners.forEach((uri) => {
      groupItem.children?.push(treeDataForPropertyOwner(uri, propertyOwners));
    });

    return groupItem;
  }

  topLevelGroupsPaths.forEach((path) => {
    treeData.push(generateGroupData(path));
  });

  // Add the nodes without any group to the top level
  const nodesWithoutGroup = groups['/']?.propertyOwners || [];
  nodesWithoutGroup.forEach((uri) => {
    treeData.push(treeDataForPropertyOwner(uri, propertyOwners))
  });

  return treeData;
}
