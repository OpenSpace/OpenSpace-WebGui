import { TreeNodeData } from '@mantine/core';
import { createAction } from '@reduxjs/toolkit';

import { GroupPrefixKey } from '@/panels/Scene/SceneTree/treeUtil';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { addUriToPropertyTree } from '@/redux/propertytree/propertyTreeMiddleware';
import { Properties, PropertyOwners } from '@/types/types';

import { RootState } from '../store';

import { Groups, setGroups, setSceneTreeData, setTags } from './groupsSlice';

export const refreshGroups = createAction<void>('groups/refresh');

const emptyGroup = () => ({
  subgroups: [],
  propertyOwners: []
});

const computeGroups = (propertyOwners: PropertyOwners, properties: Properties) => {
  const groups: Groups = {};

  // Create links to property owners
  Object.keys(propertyOwners).forEach((uri) => {
    const guiPathProp = properties[`${uri}.GuiPath`];
    const guiPath = guiPathProp ? guiPathProp.value : '/';

    if (typeof guiPath !== 'string') {
      throw new Error(`GuiPath property for ${uri} is not a string`);
    }

    // Only scene graph nodes can use the group feature.
    // Match children (but not grandchildren) of Scene:
    if (!uri.match(/^Scene\.[^.]+$/)) {
      return;
    }
    groups[guiPath] = groups[guiPath] || emptyGroup();
    groups[guiPath].propertyOwners.push(uri);

    // Finally, sort the property owners based on the GuiOrderingNumber
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
};

export function treeDataForPropertyOwner(uri: string, propertyOwners: PropertyOwners) {
  const propertyOwner = propertyOwners[uri];
  return {
    label: propertyOwner?.name || '',
    value: uri
  };
}

// The data that will be used to render the scene tree, so it uses the TreeNodeData type
function treeDataFromGroups(groups: Groups, propertyOwners: PropertyOwners) {
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
      value: GroupPrefixKey + path,
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
      groupNodeData.children?.push(treeDataForPropertyOwner(uri, propertyOwners));
    });

    return groupNodeData;
  }

  topLevelGroupsPaths.forEach((path) => {
    treeData.push(generateGroupData(path));
  });

  // Add the nodes without any group to the top level
  const nodesWithoutGroup = groups['/']?.propertyOwners || [];
  nodesWithoutGroup.forEach((uri) => {
    treeData.push(treeDataForPropertyOwner(uri, propertyOwners));
  });

  return treeData;
}

function collectExistingTags(propertyOwners: PropertyOwners) {
  const tags = new Set<string>();
  Object.values(propertyOwners).forEach((propertyOwner) => {
    propertyOwner?.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export const addGroupsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: addUriToPropertyTree.fulfilled,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(refreshGroups());
    }
  });
  startListening({
    actionCreator: refreshGroups,
    effect: (_, listenerApi) => {
      const state = listenerApi.getState() as RootState;

      const newGroups = computeGroups(
        state.propertyOwners.propertyOwners,
        state.properties.properties
      );
      listenerApi.dispatch(setGroups(newGroups));

      const newSceneTreeData = treeDataFromGroups(
        newGroups,
        state.propertyOwners.propertyOwners
      );
      listenerApi.dispatch(setSceneTreeData(newSceneTreeData));

      const newTags = collectExistingTags(state.propertyOwners.propertyOwners);
      listenerApi.dispatch(setTags(newTags));
    }
  });
};
