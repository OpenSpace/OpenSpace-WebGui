import { api } from '@/api/api';
import { AppStartListening } from '@/redux/listenerMiddleware';

import { onOpenConnection } from '../connection/connectionSlice';

import { AssetMetaData, initializeDocumentation } from './documentationSlice';

// TODO: Ask Ylva about the async thunk implementation
const getDocumentation = async (callback: (data: AssetMetaData[]) => void) => {
  // TODO: We could also get the rest of the documentation data here. Like keybindings,
  // lua function, etc.
  const assetsMetaData = await api.getDocumentation('meta');
  callback(assetsMetaData as AssetMetaData[]);
};

export const addDocumentationListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      getDocumentation((data) => {
        listenerApi.dispatch(initializeDocumentation(data));
      });
    }
  });
};
