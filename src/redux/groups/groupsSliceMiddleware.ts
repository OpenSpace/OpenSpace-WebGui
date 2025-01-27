import { createAction } from '@reduxjs/toolkit';

import type { AppStartListening } from '@/redux/listenerMiddleware';
import { addUriToPropertyTree } from '@/redux/propertytree/propertyTreeMiddleware';
import { PropertyOwners } from '@/types/types';
import { computeGroups, sceneTreeDataFromGroups } from '@/util/sceneTreeGroupsHelper';

import { RootState } from '../store';

import { setGroups, setSceneTreeData, setTags } from './groupsSlice';

export const refreshGroups = createAction<void>('groups/refresh');

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

      const newSceneTreeData = sceneTreeDataFromGroups(
        newGroups,
        state.propertyOwners.propertyOwners
      );
      listenerApi.dispatch(setSceneTreeData(newSceneTreeData));

      const newTags = collectExistingTags(state.propertyOwners.propertyOwners);
      listenerApi.dispatch(setTags(newTags));
    }
  });
};
