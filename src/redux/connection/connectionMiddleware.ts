import { createListenerMiddleware } from '@reduxjs/toolkit';
import { startConnection, onCloseConnection, onOpenConnection } from './connectionSlice';
//import api from '../api';
import { OpenSpaceApi } from 'openspace-api-js';
import { Socket } from 'openspace-api-js';
export const connectionMiddleware = createListenerMiddleware();
import { initializeLuaApi } from '../luaApi/luaApiSlice';
let openspace;

connectionMiddleware.startListening({
  actionCreator: startConnection,
  effect: async (action, listenerApi) => {
    console.log('Connect');
    const openspaceApi = true;
    listenerApi.dispatch(initializeLuaApi(openspaceApi));

    /*  const socket = new Socket('localhost', 4680);
    const api = new OpenSpaceApi(socket);

    async function onConnect() {
      openspace = await api.library();
      listenerApi.dispatch(onOpenConnection());
      const tempApi = true;
      listenerApi.dispatch(initializeLuaApi({ luaApi: tempApi }));
    }

    function onDisconnect() {
      listenerApi.dispatch(onCloseConnection());

      let reconnectionInterval = 1000;
      setTimeout(() => {
        api.connect();
        reconnectionInterval += 1000;
      }, reconnectionInterval);
    }

    api.onConnect(onConnect);
    api.onDisconnect(onDisconnect);
    api.connect(); */
  }
});
