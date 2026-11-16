import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NotificationLevel } from '@/types/enums';

export interface LoggingState {
  logLevel: NotificationLevel;
  showNotifications: boolean;
}

const initialState: LoggingState = {
  showNotifications: true,
  logLevel: NotificationLevel.Warning
};

export const loggingSlice = createSlice({
  name: 'logging',
  initialState,
  reducers: {
    updateLogLevel: (state, action: PayloadAction<NotificationLevel>) => {
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
