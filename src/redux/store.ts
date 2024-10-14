import { configureStore } from '@reduxjs/toolkit';

import { actionsReducer } from './actions/actionsSlice';
import { connectionMiddleware } from './connection/connectionMiddleware';
import { connectionReducer } from './connection/connectionSlice';
import { luaApiReducer } from './luaapi/luaApiSlice';
import { sessionRecordingMiddleware } from './sessionrecording/sessionRecordingMiddleware';
import { sessionRecordingReducer } from './sessionrecording/sessionRecordingSlice';

export const store = configureStore({
  reducer: {
    sessionRecording: sessionRecordingReducer,
    connection: connectionReducer,
    luaApi: luaApiReducer,
    actions: actionsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['luaApi/initializeLuaApi'],
        ignoredPaths: ['luaApi']
      }
    }).prepend([sessionRecordingMiddleware.middleware, connectionMiddleware.middleware])
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
