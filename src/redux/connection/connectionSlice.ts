import { createSlice } from '@reduxjs/toolkit';

import { ConnectionStatus } from '@/types/enums';

export interface ConnectionState {
  connectionStatus: ConnectionStatus;
}

const initialState: ConnectionState = {
  connectionStatus: ConnectionStatus.Connecting
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    startConnection: (state) => {
      state.connectionStatus = ConnectionStatus.Connecting;
    },
    onOpenConnection: (state) => {
      state.connectionStatus = ConnectionStatus.Connected;
      return state;
    },
    onCloseConnection: (state) => {
      state.connectionStatus = ConnectionStatus.Disconnected;
      return state;
    }
  }
});

// Action creators are generated for each case reducer function, replaces the `Actions/index.js`
export const { startConnection, onOpenConnection, onCloseConnection } =
  connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
