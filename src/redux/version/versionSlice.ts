import { createSlice } from '@reduxjs/toolkit';

import { getVersion } from './versionMiddleware';

export interface OpenSpaceVersion {
  latestOpenSpaceVersion?: { major: number; minor: number; patch: number };
  openSpaceVersion?: { major: number; minor: number; patch: number };
  socketApiVersion?: { major: number; minor: number; patch: number };
}

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
