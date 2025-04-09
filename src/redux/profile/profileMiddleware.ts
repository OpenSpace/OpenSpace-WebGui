import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { Identifier } from '@/types/types';

import { setMenuItemVisible } from '../local/localSlice';

import { setMarkedNodes } from './profileSlice';

export interface ProfilePayload {
  uiPanelVisibility: {
    // The key here should match the id of the menu item, else will be ignored
    [key: string]: boolean;
  };
  markNodes: Identifier[];
}

export const getProfile = createAsyncThunk('profile/getProfile', async () => {
  const topic = api.startTopic('profile', {});
  const { value } = await topic.iterator().next();
  topic.cancel();
  return value as ProfilePayload;
});

export const addProfileListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(getProfile());
    }
  });

  startListening({
    actionCreator: getProfile.fulfilled,
    effect: async (action, listenerApi) => {
      // Get the data from the profile topic and set it in the redux store

      // Panel visibility settings
      Object.entries(action.payload.uiPanelVisibility).forEach(([key, value]) => {
        listenerApi.dispatch(setMenuItemVisible({ id: key, visible: value }));
      });

      // Marked nodes
      listenerApi.dispatch(setMarkedNodes(action.payload.markNodes));
    }
  });
};
