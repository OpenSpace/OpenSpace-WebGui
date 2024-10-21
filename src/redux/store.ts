import { configureStore } from '@reduxjs/toolkit';

import { actionsReducer } from './actions/actionsSlice';
import { connectionReducer } from './connection/connectionSlice';
import { luaApiReducer } from './luaapi/luaApiSlice';
import { propertyTreeReducer } from './propertytree/propertyTreeSlice';
import { sessionRecordingReducer } from './sessionrecording/sessionRecordingSlice';
import { listenerMiddleware } from './listenerMiddleware';

export const store = configureStore({
  reducer: {
    sessionRecording: sessionRecordingReducer,
    connection: connectionReducer,
    luaApi: luaApiReducer,
    actions: actionsReducer,
    propertyTree: propertyTreeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['luaApi/initializeLuaApi'],
        ignoredPaths: ['luaApi']
      }
    }).prepend([listenerMiddleware.middleware])
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
