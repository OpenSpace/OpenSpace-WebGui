import { createAction } from '@reduxjs/toolkit';

import type { AppStartListening } from '@/redux/listenerMiddleware';
import { addUriToPropertyTree } from '@/redux/propertytree/propertyTreeMiddleware';
import { Groups, Properties, PropertyOwners } from '@/types/types';

import { RootState } from '../store';

import { setGroups } from './groupsSlice';

export const refreshGroups = createAction<void>('groups/refresh');

const emptyGroup = () => ({
  subgroups: [],
  propertyOwners: []
});

const computeGroups = (
  propertyOwners: PropertyOwners,
  properties: Properties
): Groups => {
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
    }
  });
};
