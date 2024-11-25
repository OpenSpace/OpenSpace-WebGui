import { Tree, TreeNodeData } from '@mantine/core';

import { Groups } from '@/redux/groups/groupsSlice';
import { useAppSelector } from '@/redux/hooks';
import { hasInterestingTag, shouldShowPropertyOwner } from '@/util/propertytreehelper';
import { PropertyOwners } from '@/types/types';
import { Property } from '../Property/Property';
import { GroupHeader, PropertyOwnerHeader } from './SceneTreeHeaders';

const GROUP_PREFIX = '/groups/';

// TODO: Move this to Redux
function treeDataForPropertyOwner(uri: string, propertyOwners: PropertyOwners) {
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

// TODO: Move this to Redux
function treeDataFromGroups(groups: Groups, propertyOwners: PropertyOwners) {
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
      value: GROUP_PREFIX + path,
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

interface Props {
  propertyOwnerUri?: string;
  showOnlyEnabled?: boolean;
  showHiddenNodes?: boolean;
}

/**
 * This component displays a tree of the scene graph, either starting from a certain
 * property owner, or the entire tree.
 */
export function SceneTree({
  propertyOwnerUri = "",
  showOnlyEnabled = false,
  showHiddenNodes = false
}: Props) {
  const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);

  // TODO: Remove dependency on entire properties object. This means that the entire menu
  // is rerendered as soon as a property changes...
  const properties = useAppSelector((state) => state.properties.properties);
  const groups: Groups = useAppSelector((state) => state.groups.groups);

  function hidePropertyOwner(uri: string) {
    return !shouldShowPropertyOwner(uri, properties, showOnlyEnabled, showHiddenNodes);
  }

  function filterTreeData(nodes: TreeNodeData[]): TreeNodeData[] {
    return nodes
      .map((node) => {
        if (node.children && node.children.length > 0) {
          node.children = filterTreeData(node.children);
          if (node.children.length === 0) {
            return null;
          }

          if (node.value.startsWith(GROUP_PREFIX)) {
            // Groups: Always show, if they have children
            return node;
          }
          else {
            // PropertyOwners
            return !hidePropertyOwner(node.value) ? node : null;
          }
        }
        // Properties
        return node;
      })
      .filter((node) => node !== null) as TreeNodeData[];
  }

  let treeData: TreeNodeData[] = [];

  if (propertyOwnerUri) {
    // Create the tree from a certain property owner
    treeData = [treeDataForPropertyOwner(propertyOwnerUri, propertyOwners)];
  }
  else {
    // Otherwise, create the tree from the groups

    // Quick access
    // TODO: Maybe these should be part of their own tree, together with the
    // current focus node?
    let interestingNodesTreeData: TreeNodeData = {
      label: 'Quick Access',
      value: GROUP_PREFIX + 'interesting',
      children: []
    };

    const propertyOwnersScene = propertyOwners.Scene?.subowners ?? [];
    propertyOwnersScene.forEach((uri) => {
      if (hasInterestingTag(uri, propertyOwners)) {
        interestingNodesTreeData.children?.push(
          treeDataForPropertyOwner(uri, propertyOwners)
        );
      }
    });

    treeData = treeData.concat(
      interestingNodesTreeData,
      treeDataFromGroups(groups, propertyOwners)
    );

    treeData = filterTreeData(treeData);
  }

  return (
    <Tree
      data={treeData}
      renderNode={({ node, expanded, hasChildren, elementProps }) => {
        const isGroup = hasChildren && node.value.startsWith(GROUP_PREFIX);
        const isPropertyOwner = hasChildren && !isGroup;

        let content;
        if (isGroup) {
          content = <GroupHeader expanded={expanded} label={node.label} />
        } else if (isPropertyOwner) {
          content = <PropertyOwnerHeader expanded={expanded} label={node.label} />
        } else {
          content = <Property uri={node.value} />
        }

        return <div {...elementProps}>
          {content}
        </div>
      }}
    />
  );
}
