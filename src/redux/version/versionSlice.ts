import { createSlice } from '@reduxjs/toolkit';

import { SemanticVersion } from '@/types/types';

import { getVersion } from './versionMiddleware';

export interface OpenSpaceVersionInfoState {
  latestOpenSpaceVersion?: SemanticVersion;
  openSpaceVersion?: SemanticVersion;
  socketApiVersion?: SemanticVersion;
}

const initialState: OpenSpaceVersionInfoState = {};

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
