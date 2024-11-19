import { createAction, Dispatch, UnknownAction } from '@reduxjs/toolkit';

import type { AppStartListening } from '@/redux/listenerMiddleware';
import { initializeLuaApi } from '@/redux/luaapi/luaApiSlice';
import { propertyTreeWasChanged } from '@/redux/propertytree/propertyTreeMiddleware';

import { refreshGroups, updateCustomGroupOrdering } from './groupsSlice';

export const getCustomGroupsOrdering = createAction<void>('getCustomGroupsOrdering');

async function getGuiGroupsOrdering(
  luaApi: OpenSpace.openspace | null,
  dispatch: Dispatch<UnknownAction>
) {
  await luaApi
    ?.guiOrder()
    // eslint-disable-next-line no-console
    .catch((e) => console.log(e))
    .then((data) => {
      if (!data) {
        console.error('No GUI tree ordering was set');
        data = {};
      }
      dispatch(updateCustomGroupOrdering(data));
    });
}

export const addGroupsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: propertyTreeWasChanged,
    effect: (_, listenerApi) => {
      const { properties, propertyOwners } = listenerApi.getState();
      listenerApi.dispatch(
        refreshGroups({
          propertyOwners: propertyOwners.propertyOwners,
          properties: properties.properties
        })
      );
    }
  });

  startListening({
    actionCreator: initializeLuaApi,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(getCustomGroupsOrdering());
    }
  });

  startListening({
    actionCreator: getCustomGroupsOrdering,
    effect: (_, listenerApi) => {
      getGuiGroupsOrdering(listenerApi.getState().luaApi, listenerApi.dispatch);
    }
  });
};
