import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Groups, Properties, PropertyOwners } from '@/types/types';

export interface GroupsState {
  customGroupOrdering: object; // TODO specify this
  groups: Groups;
}

const initialState: GroupsState = {
  customGroupOrdering: {},
  groups: {}
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
      // Alternatively:
      // return {
      //   ...state,
      //   groups: computeGroups(propertyOwners, properties)
      // }
    },
    updateCustomGroupOrdering: (
      state,
      action: PayloadAction<object> // TODO: make a type?
    ) => {
      state.customGroupOrdering = action.payload;
      // Alternatively:
      // return {
      //   ...state,
      //   customGroupOrdering: action.payload
      // }
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { refreshGroups, updateCustomGroupOrdering } = groupsSlice.actions;
export const groupsReducer = groupsSlice.reducer;