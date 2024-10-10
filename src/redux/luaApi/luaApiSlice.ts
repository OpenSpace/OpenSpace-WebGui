import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

export interface luaApiState {
  luaApi: boolean;
}

const initialState: luaApiState = {
  luaApi: false
};

export const luaApiSlice = createSlice({
  name: 'luaApi',
  initialState,
  reducers: {
    initializeLuaApi: (state, action: PayloadAction<luaApiState>) => {
      console.log('Set lua api');
      state.luaApi = action.payload.luaApi;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { initializeLuaApi } = luaApiSlice.actions;
export const luaApiReducer = luaApiSlice.reducer;
