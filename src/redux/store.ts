import { configureStore } from '@reduxjs/toolkit';
import { sessionRecordingReducer } from './features/sessionRecordingSlice';

export const store = configureStore({
  reducer: {
    sessionRecording: sessionRecordingReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
