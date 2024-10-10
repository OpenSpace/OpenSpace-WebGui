import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, Action } from '@reduxjs/toolkit';

export interface ConnectionState {
  isConnected: boolean;
  connectionLost: boolean;
}

const initialState: ConnectionState = {
  isConnected: false,
  connectionLost: false
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    startConnection: (state) => {
      console.log('Start connection');
      state.isConnected = false;
      state.connectionLost = false;
      return state;
    },
    onOpenConnection: (state) => {
      state.isConnected = true;
      state.connectionLost = false;
      return state;
    },
    onCloseConnection: (state) => {
      state.isConnected = false;
      state.connectionLost = true;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { startConnection, onOpenConnection, onCloseConnection } =
  connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
