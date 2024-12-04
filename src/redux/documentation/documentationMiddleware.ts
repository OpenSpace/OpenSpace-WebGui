import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { AppStartListening } from '@/redux/listenerMiddleware';

import { onOpenConnection } from '../connection/connectionSlice';

import { AssetMetaData, initializeDocumentation } from './documentationSlice';

export const fetchDocumentation = createAsyncThunk(
  'documentation/fetchDocumentation',
  async (_, thunkAPI) => {
    // @TODO (emmbr, 2024-12-04): We could also get the rest of the documentation data
    // here. Like keybindings, lua function descriptions, etc., but for now we only get
    // the meta data
    const assetsMetaData = (await api.getDocumentation('meta')) as AssetMetaData[];
    thunkAPI.dispatch(initializeDocumentation(assetsMetaData));
  }
);

export const addDocumentationListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(fetchDocumentation());
    }
  });
};
