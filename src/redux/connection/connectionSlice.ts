import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';
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

// Helper functions to check connection status
export function isConnected(status: ConnectionStatus): boolean {
  return status === ConnectionStatus.Connected;
}
export function isConnecting(status: ConnectionStatus): boolean {
  return status === ConnectionStatus.Connecting;
}
export function isDisconnected(status: ConnectionStatus): boolean {
  return status === ConnectionStatus.Disconnected;
}
export function selectIsConnected(state: RootState): boolean {
  return isConnected(state.connection.connectionStatus);
}
export function selectIsConnecting(state: RootState): boolean {
  return isConnecting(state.connection.connectionStatus);
}
export function selectIsDisconnected(state: RootState): boolean {
  return isDisconnected(state.connection.connectionStatus);
}
