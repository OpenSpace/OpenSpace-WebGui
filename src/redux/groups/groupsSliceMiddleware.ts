import { createAsyncThunk } from '@reduxjs/toolkit';

import type { AppStartListening } from '@/redux/listenerMiddleware';
import { addUriToPropertyTree } from '@/redux/propertytree/propertyTreeMiddleware';

import { refreshGroups, updateCustomGroupOrdering } from './groupsSlice';
import { RootState } from '../store';
import { initializeLuaApi } from '../luaapi/luaApiSlice';

export const getCustomGroupsOrdering = createAsyncThunk(
  'groups/getCustomGroupOrdering',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    return await state.luaApi?.guiOrder();
  }
);

export const addGroupsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: initializeLuaApi,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(getCustomGroupsOrdering());
    }
  });

  startListening({
    actionCreator: getCustomGroupsOrdering.fulfilled,
    effect: (action, listenerApi) => {
      if (!action.payload) {
        // eslint-disable-next-line no-console
        console.error('No GUI tree ordering was set');
        return;
      }
      listenerApi.dispatch(updateCustomGroupOrdering(action.payload));
    }
  });

  startListening({
    actionCreator: addUriToPropertyTree.fulfilled,
    effect: (action, listenerApi) => {
      const { properties, propertyOwners } = listenerApi.getState();
      listenerApi.dispatch(
        refreshGroups({
          propertyOwners: propertyOwners.propertyOwners,
          properties: properties.properties
        })
      );
    }
  });
};
