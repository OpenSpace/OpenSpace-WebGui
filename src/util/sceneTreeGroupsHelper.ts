import { TreeNodeData } from '@mantine/core';

import { Group, Groups, Properties, PropertyOwners, Uri } from '@/types/types';

import { getGuiPath, isSceneGraphNode } from './propertyTreeHelpers';

// This key is added to the group path values in the tree data structure, to mark which
// tree nodes correspond to groups (as opposed to scene graph nodes).
export const SceneTreeGroupPrefixKey = '/groups/';

function emptyGroup(): Group {
  return { subgroups: [], propertyOwners: [] };
}

/**
 * Check if a node in the Scene tree is a group node, meaning that its identifiing value
 * starts with the specified prefix.
 */
export function isGroupNode(node: TreeNodeData): boolean {
  return node.value.startsWith(SceneTreeGroupPrefixKey);
}

/**
 * Compute the data structure for the groups, based on the GUI path for all added scene
 * graph nodes.
 */
export function computeGroups(
  propertyOwners: PropertyOwners,
  properties: Properties
): Groups {
  const groups: Groups = {};

  const sceneGraphNodes = Object.keys(propertyOwners).filter((uri) =>
    isSceneGraphNode(uri)
  );

  // Create links to all scene graph nodes based on their GUI path. If a node does not
  // have a GUI path, it is added to the top level
  sceneGraphNodes.forEach((uri) => {
    const guiPath = getGuiPath(uri, properties) || '/';
    groups[guiPath] = groups[guiPath] || emptyGroup();
    groups[guiPath].propertyOwners.push(uri);
  });

  // Create links from parent groups to subgroups
  Object.keys(groups).forEach((group) => {
    const path = group.split('/');
    for (let i = 1; i < path.length; ++i) {
      const parentPath = path.slice(0, i).join('/');
      const childPath = path.slice(0, i + 1).join('/');
      groups[parentPath] = groups[parentPath] || emptyGroup();
      const parentGroup = groups[parentPath];
      if (!parentGroup.subgroups.includes(childPath)) {
        parentGroup.subgroups.push(childPath);
      }
    }

    // After collecting all the subgroups, there is one extra group at the top with
    // an empty key keep that has the top levels as subgroups (this is due to all our
    // paths starting with an inital slash). We don't need to keep this around
    delete groups[''];
  });

  return groups;
}

/**
 * Create the data for a Scene tree node representing a scene graph node.
 */
export function treeDataForSceneGraphNode(
  uri: Uri,
  propertyOwners: PropertyOwners
): TreeNodeData {
  const propertyOwner = propertyOwners[uri];
  return {
    label: propertyOwner?.name || '',
    value: uri
  };
}

/**
 * Create the data for the Scene tree from the groups information.
 */
export function sceneTreeDataFromGroups(
  groups: Groups,
  propertyOwners: PropertyOwners
): TreeNodeData[] {
  const treeData: TreeNodeData[] = [];

  const topLevelGroupsPaths = Object.keys(groups).filter((path) => {
    // Get the number of slashes in the path
    const depth = (path.match(/\//g) || []).length;
    return depth === 1 && path !== '/';
  });

  // Build the data structure for the tree
  function generateGroupData(path: string) {
    const splitPath = path.split('/');
    const name = splitPath.length > 1 ? splitPath.pop() : 'Untitled';

    const groupNodeData: TreeNodeData = {
      value: SceneTreeGroupPrefixKey + path,
      label: name,
      children: []
    };

    const groupData = groups[path];

    // Add subgroups, recursively
    groupData.subgroups.forEach((subGroupPath) =>
      groupNodeData.children?.push(generateGroupData(subGroupPath))
    );

    // Add property owners, also recursively
    groupData.propertyOwners.forEach((uri) => {
      groupNodeData.children?.push(treeDataForSceneGraphNode(uri, propertyOwners));
    });

    return groupNodeData;
  }

  topLevelGroupsPaths.forEach((path) => {
    treeData.push(generateGroupData(path));
  });

  // Add the nodes without any group to the top level
  const nodesWithoutGroup = groups['/']?.propertyOwners || [];
  nodesWithoutGroup.forEach((uri) => {
    treeData.push(treeDataForSceneGraphNode(uri, propertyOwners));
  });

  return treeData;
}
