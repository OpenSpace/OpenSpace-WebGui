import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Properties, PropertyOwners } from '@/types/types';
import { GroupPrefixKey } from '@/components/SceneTree/treeUtil';
import { TreeNodeData } from '@mantine/core';

export interface GroupsState {
  customGroupOrdering: object; // TODO specify this
  groups: Groups;
}

export type Groups = {
  [key: string]: Group;
};

export type CustomGroupOrdering = {
  [key: string]: string[]; // group paths
};

export interface GroupsState {
  customGroupOrdering: CustomGroupOrdering;
  groups: Groups;
  sceneTreeData: TreeNodeData[];
}

const initialState: GroupsState = {
  customGroupOrdering: {},
  groups: {}, // TODO: is this part needed?
  sceneTreeData: []
};

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
      return; // This should not happen
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

// The data that will be used to render the scene tree
export function treeDataFromGroups(groups: Groups, propertyOwners: PropertyOwners) {
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

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    refreshGroups: (
      state,
      action: PayloadAction<{ propertyOwners: PropertyOwners; properties: Properties }>
    ) => {
      const { propertyOwners, properties } = action.payload;
      state.groups = computeGroups(propertyOwners, properties);
      state.sceneTreeData = treeDataFromGroups(state.groups, propertyOwners);
      return state;
    },
    updateCustomGroupOrdering: (
      state,
      action: PayloadAction<CustomGroupOrdering>
    ) => {
      state.customGroupOrdering = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { refreshGroups, updateCustomGroupOrdering } = groupsSlice.actions;
export const groupsReducer = groupsSlice.reducer;
