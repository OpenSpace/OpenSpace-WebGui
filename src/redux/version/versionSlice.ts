import { createSlice } from '@reduxjs/toolkit';

import { OpenSpaceVersion } from '@/types/types';

import { getVersion } from './versionMiddleware';

const initialState: OpenSpaceVersion = {};

export const versionSlice = createSlice({
  name: 'version',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getVersion.fulfilled, (state, action) => {
      state = action.payload;
      return state;
    });
  }
});

export const versionReducer = versionSlice.reducer;
