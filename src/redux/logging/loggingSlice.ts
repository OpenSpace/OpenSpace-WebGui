import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LogLevel } from '@/types/enums';

export interface LoggingState {
  logLevel: LogLevel;
  showNotifications: boolean;
}

const initialState: LoggingState = {
  showNotifications: true,
  logLevel: LogLevel.Warning
};

export const loggingSlice = createSlice({
  name: 'logging',
  initialState,
  reducers: {
    updateLogLevel: (state, action: PayloadAction<LogLevel>) => {
      state.logLevel = action.payload;
      return state;
    },
    showNotifications: (state, action: PayloadAction<boolean>) => {
      state.showNotifications = action.payload;
      return state;
    }
  }
});

export const { updateLogLevel, showNotifications } = loggingSlice.actions;
export const loggingReducer = loggingSlice.reducer;
