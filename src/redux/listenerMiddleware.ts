import { createListenerMiddleware, type TypedStartListening } from '@reduxjs/toolkit';

import { addActionsListener } from './actions/actionsMiddleware';
import { addCameraPathListener } from './camerapath/cameraPathMiddleware';
import { addConnectionListener } from './connection/connectionMiddleware';
import { addDocumentationListener } from './documentation/documentationMiddleware';
import { addEngineModeListener } from './enginemode/engineModeMiddleware';
import { addEventsListener } from './events/eventsMiddleware';
import { addFlightControllerListener } from './flightcontroller/flightControllerMiddleware';
import { addGroupsListener } from './groups/groupsSliceMiddleware';
import { addMissionsListener } from './missions/missionsMiddleware';
import { addPropertiesListener } from './propertytree/properties/propertiesMiddleware';
import { addPropertyTreeListener } from './propertytree/propertyTreeMiddleware';
import { addSessionRecordingListener } from './sessionrecording/sessionRecordingMiddleware';
import { addSkyBrowserListener } from './skybrowser/skybrowserMiddleware';
import { addTimeListener } from './time/timeMiddleware';
import { addVersionListener } from './version/versionMiddleware';
import type { AppDispatch, RootState } from './store';

export const listenerMiddleware = createListenerMiddleware();
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = listenerMiddleware.startListening as AppStartListening;

addActionsListener(startAppListening);
addCameraPathListener(startAppListening);
addConnectionListener(startAppListening);
addDocumentationListener(startAppListening);
addEngineModeListener(startAppListening);
addEventsListener(startAppListening);
addFlightControllerListener(startAppListening);
addGroupsListener(startAppListening);
addMissionsListener(startAppListening);
addPropertiesListener(startAppListening);
addPropertyTreeListener(startAppListening);
addSessionRecordingListener(startAppListening);
addTimeListener(startAppListening);
addVersionListener(startAppListening);
addSkyBrowserListener(startAppListening);
