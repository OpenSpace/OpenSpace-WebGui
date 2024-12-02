import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import type { AppStartListening } from '@/redux/listenerMiddleware';

import { onCloseConnection, onOpenConnection, startConnection } from './connectionSlice';

export const closeConnection = createAction<void>('closeConnection');

export const getLuaApi = createAsyncThunk('connection/getLuaApi', async () => {
  return await api.singleReturnLibrary();
});

export const connectToOpenSpace = createAsyncThunk(
  'connection/connectToOpenSpace',
  async (_, thunkAPI) => {
    async function onConnect() {
      thunkAPI.dispatch(onOpenConnection());
    }

    function onDisconnect() {
      thunkAPI.dispatch(onCloseConnection());

      let reconnectionInterval = 1000;
      setTimeout(() => {
        api.connect();
        reconnectionInterval += 1000;
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
      //if (listenerApi.getState().connection.isConnected) {
      api.disconnect();
      //}
    }
  });
};
