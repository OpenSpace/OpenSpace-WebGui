import { configureStore } from '@reduxjs/toolkit';

import { actionsReducer } from './actions/actionsSlice';
import { cameraPathReducer } from './camerapath/cameraPathSlice';
import { connectionReducer } from './connection/connectionSlice';
import { documentationReducer } from './documentation/documentationSlice';
import { engineModeReducer } from './enginemode/engineModeSlice';
import { exoplanetsReducer } from './exoplanets/exoplanetsSlice';
import { flightControllerReducer } from './flightcontroller/flightControllerSlice';
import { groupsReducer } from './groups/groupsSlice';
import { localReducer } from './local/localSlice';
import { missionsReducer } from './missions/missionsSlice';
import { propertiesReducer } from './propertytree/properties/propertiesSlice';
import { propertyOwnersReducer } from './propertytree/propertyowner/propertyOwnerSlice';
import { sessionRecordingReducer } from './sessionrecording/sessionRecordingSlice';
import { skyBrowserReducer } from './skybrowser/skybrowserSlice';
import { timeReducer } from './time/timeSlice';
import { userPanelsReducer } from './userpanels/userPanelsSlice';
import { versionReducer } from './version/versionSlice';
import { listenerMiddleware } from './listenerMiddleware';

export const store = configureStore({
  reducer: {
    actions: actionsReducer,
    cameraPath: cameraPathReducer,
    connection: connectionReducer,
    documentation: documentationReducer,
    engineMode: engineModeReducer,
    exoplanets: exoplanetsReducer,
    flightController: flightControllerReducer,
    groups: groupsReducer,
    local: localReducer,
    missions: missionsReducer,
    properties: propertiesReducer,
    propertyOwners: propertyOwnersReducer,
    sessionRecording: sessionRecordingReducer,
    skybrowser: skyBrowserReducer,
    time: timeReducer,
    userPanels: userPanelsReducer,
    version: versionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([listenerMiddleware.middleware]),
  devTools: true
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
