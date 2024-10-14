import { createListenerMiddleware } from '@reduxjs/toolkit';
//import api from '../api';
import OpenSpaceApi from 'openspace-api-js';

import { onCloseConnection, onOpenConnection, startConnection } from './connectionSlice';
export const connectionMiddleware = createListenerMiddleware();
import { initializeLuaApi } from '../luaapi/luaApiSlice';
let openspace: OpenSpace.openspace;

connectionMiddleware.startListening({
  actionCreator: startConnection,
  effect: async (action, listenerApi) => {
    const api = OpenSpaceApi('localhost', 4682);

    async function onConnect() {
      openspace = await api.singleReturnLibrary();
      listenerApi.dispatch(onOpenConnection());
      listenerApi.dispatch(initializeLuaApi(openspace));
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
    api.connect();
  }
});
