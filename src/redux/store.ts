import { configureStore } from '@reduxjs/toolkit';

import { actionsReducer } from './actions/actionsSlice';
import { cameraReducer } from './camera/cameraSlice';
import { cameraPathReducer } from './camerapath/cameraPathSlice';
import { connectionReducer } from './connection/connectionSlice';
import { documentationReducer } from './documentation/documentationSlice';
import { engineModeReducer } from './enginemode/engineModeSlice';
import { exoplanetsReducer } from './exoplanets/exoplanetsSlice';
import { flightControllerReducer } from './flightcontroller/flightControllerSlice';
import { groupsReducer } from './groups/groupsSlice';
import { localReducer } from './local/localSlice';
import { loggingReducer } from './logging/loggingSlice';
import { missionsReducer } from './missions/missionsSlice';
import { profileReducer } from './profile/profileSlice';
import { propertyOwnerReducer } from './propertyTree/propertyOwnerSlice';
import { propertyReducer } from './propertyTree/propertySlice';
import { sessionRecordingReducer } from './sessionrecording/sessionRecordingSlice';
import { skyBrowserReducer } from './skybrowser/skybrowserSlice';
import { timeReducer } from './time/timeSlice';
import { userPanelsReducer } from './userpanels/userPanelsSlice';
import { versionReducer } from './version/versionSlice';
import { listenerMiddleware } from './listenerMiddleware';

export const store = configureStore({
  reducer: {
    actions: actionsReducer,
    camera: cameraReducer,
    cameraPath: cameraPathReducer,
    connection: connectionReducer,
    documentation: documentationReducer,
    engineMode: engineModeReducer,
    exoplanets: exoplanetsReducer,
    flightController: flightControllerReducer,
    groups: groupsReducer,
    local: localReducer,
    logging: loggingReducer,
    missions: missionsReducer,
    profile: profileReducer,
    sessionRecording: sessionRecordingReducer,
    skybrowser: skyBrowserReducer,
    time: timeReducer,
    userPanels: userPanelsReducer,
    version: versionReducer,
    properties: propertyReducer,
    propertyOwners: propertyOwnerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([listenerMiddleware.middleware]),
  devTools: true
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
