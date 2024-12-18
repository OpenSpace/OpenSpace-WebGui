import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { AppStartListening } from '@/redux/listenerMiddleware';

import { onOpenConnection } from '../connection/connectionSlice';

import { AssetMetaData, initializeDocumentation } from './documentationSlice';

export const fetchDocumentation = createAsyncThunk(
  'documentation/fetchDocumentation',
  async (_, thunkAPI) => {
    // Only get the meta data information from the documentation topic here, for now
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
