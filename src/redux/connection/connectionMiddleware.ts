import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import type { AppStartListening } from '@/redux/listenerMiddleware';

import {
  onCloseConnection,
  onOpenConnection,
  selectIsConnected,
  startConnection
} from './connectionSlice';

export const closeConnection = createAction<void>('closeConnection');

export const connectToOpenSpace = createAsyncThunk(
  'connection/connectToOpenSpace',
  async (_, thunkAPI) => {
    async function onConnect() {
      thunkAPI.dispatch(onOpenConnection());
    }

    function onDisconnect() {
      thunkAPI.dispatch(onCloseConnection());

      const reconnectionInterval = 1000;
      setTimeout(() => {
        api.connect();
      }, reconnectionInterval);
    }
    api.onConnect(onConnect);
    api.onDisconnect(onDisconnect);
    api.connect();
  }
);

export const addConnectionListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: startConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(connectToOpenSpace());
    }
  });
  startListening({
    actionCreator: closeConnection,
    effect: async (_, listenerApi) => {
      const state = listenerApi.getState();
      if (selectIsConnected(state)) {
        api.disconnect();
      }
    }
  });
};
