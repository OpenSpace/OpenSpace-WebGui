import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

type OpenSpaceApiState = OpenSpace.openspace | null;

const initialState: OpenSpaceApiState = null as OpenSpaceApiState;

export const luaApiSlice = createSlice({
  name: 'luaApi',
  initialState,
  reducers: {
    initializeLuaApi: (state, action: PayloadAction<OpenSpace.openspace>) => {
      state = action.payload;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { initializeLuaApi } = luaApiSlice.actions;
export const luaApiReducer = luaApiSlice.reducer;
