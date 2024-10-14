import { api } from '@/api/api';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { initializeLuaApi } from '@/redux/luaapi/luaApiSlice';

import { onCloseConnection, onOpenConnection, startConnection } from './connectionSlice';

let openspace: OpenSpace.openspace;

export const addConnectionListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: startConnection,
    effect: async (_, listenerApi) => {
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
  startListening({
    actionCreator: onCloseConnection,
    effect: () => {
      api.disconnect;
    }
  });
};
