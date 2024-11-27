import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppStartListening } from '@/redux/listenerMiddleware';

import { initializeExoplanets } from './exoplanetsSlice';
import { RootState } from '../store';

export const loadExoplanetsData = createAsyncThunk(
  'exoplanets/loadExoplanetsData',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    return await state.luaApi?.exoplanets.listOfExoplanets();
  }
);

export const addExoplanetListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: loadExoplanetsData.fulfilled,
    effect: async (action, listenerApi) => {
      if (action.payload) {
        listenerApi.dispatch(initializeExoplanets(Object.values(action.payload)));
      }
    }
  });
};
