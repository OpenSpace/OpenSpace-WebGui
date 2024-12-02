import { configureStore } from '@reduxjs/toolkit';

import { actionsReducer } from './actions/actionsSlice';
import { connectionReducer } from './connection/connectionSlice';
import { documentationReducer } from './documentation/documentationSlice';
import { exoplanetsReducer } from './exoplanets/exoplanetsSlice';
import { groupsReducer } from './groups/groupsSlice';
import { luaApiReducer } from './luaapi/luaApiSlice';
import { propertiesReducer } from './propertytree/properties/propertiesSlice';
import { propertyOwnersReducer } from './propertytree/propertyowner/propertyOwnerSlice';
import { sessionRecordingReducer } from './sessionrecording/sessionRecordingSlice';
import { timeReducer } from './time/timeSlice';
import { listenerMiddleware } from './listenerMiddleware';

export const store = configureStore({
  reducer: {
    actions: actionsReducer,
    connection: connectionReducer,
    documentation: documentationReducer,
    exoplanets: exoplanetsReducer,
    luaApi: luaApiReducer,
    groups: groupsReducer,
    properties: propertiesReducer,
    propertyOwners: propertyOwnersReducer,
    sessionRecording: sessionRecordingReducer,
    time: timeReducer
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
