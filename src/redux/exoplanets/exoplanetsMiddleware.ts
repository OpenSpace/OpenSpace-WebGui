import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const loadExoplanetsData = createAsyncThunk(
  'exoplanets/loadExoplanetsData',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    return await state.luaApi?.exoplanets.listOfExoplanets();
  }
);
