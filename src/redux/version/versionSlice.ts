import { createSlice } from '@reduxjs/toolkit';

import { OpenSpaceVersionInfo } from '@/types/types';

import { getVersion } from './versionMiddleware';

export type OpenSpaceVersionState = OpenSpaceVersionInfo;

const initialState: OpenSpaceVersionInfo = {};

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
