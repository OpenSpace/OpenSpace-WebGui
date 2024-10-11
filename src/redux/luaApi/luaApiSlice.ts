import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';

const initialState = false;

export const luaApiSlice = createSlice({
  name: 'luaApi',
  initialState,
  reducers: {
    initializeLuaApi: (state, action: PayloadAction<boolean>) => {
      console.log('Set lua api');
      state = action.payload;
      return state;
    }
  }
});

// Hook to make it easier to get the api
export function useOpenSpaceApi() {
  const api = useAppSelector((state) => state.luaApi);
  return api;
}

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { initializeLuaApi } = luaApiSlice.actions;
export const luaApiReducer = luaApiSlice.reducer;
