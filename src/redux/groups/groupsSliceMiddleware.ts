import { createAction } from '@reduxjs/toolkit';

import { computeGroups } from '@/redux/groups/util';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { RootState } from '@/redux/store';
import { PropertyOwner } from '@/types/types';

import { propertyOwnerSelectors } from '../propertyTree/propertyOwnerSlice';
import { propertySelectors } from '../propertyTree/propertySlice';

import { setGroups, setTags } from './groupsSlice';

export const refreshGroups = createAction<void>('groups/refresh');

function collectExistingTags(propertyOwners: PropertyOwner[]) {
  const tags = new Set<string>();
  propertyOwners.forEach((propertyOwner) => {
    propertyOwner?.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export const addGroupsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: refreshGroups,
    effect: (_, listenerApi) => {
      const state = listenerApi.getState() as RootState;
      const propertyOwners = propertyOwnerSelectors.selectAll(state);
      const properties = propertySelectors.selectEntities(state);
      const newGroups = computeGroups(propertyOwners, properties);
      listenerApi.dispatch(setGroups(newGroups));

      const newTags = collectExistingTags(propertyOwners);
      listenerApi.dispatch(setTags(newTags));
    }
  });
};
