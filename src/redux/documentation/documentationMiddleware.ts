import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';

import { initializeDocumentation } from './documentationSlice';
import { AssetMetaData } from './types';

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
