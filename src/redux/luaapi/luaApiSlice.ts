import { createSlice } from '@reduxjs/toolkit';

import { getLuaApi } from '../connection/connectionMiddleware';

type OpenSpaceApiState = OpenSpace.openspace | null;

const initialState: OpenSpaceApiState = null as OpenSpaceApiState;

export const luaApiSlice = createSlice({
  name: 'luaApi',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLuaApi.fulfilled, (state, action) => {
      if (action.payload) {
        state = action.payload;
      }
      return state;
    });
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const luaApiReducer = luaApiSlice.reducer;
