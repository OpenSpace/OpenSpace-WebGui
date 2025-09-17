import { createListenerMiddleware, type TypedStartListening } from '@reduxjs/toolkit';

import { addActionsListener } from './actions/actionsMiddleware';
import { addCameraListener } from './camera/cameraMiddleware';
import { addCameraPathListener } from './camerapath/cameraPathMiddleware';
import { addConnectionListener } from './connection/connectionMiddleware';
import { addDocumentationListener } from './documentation/documentationMiddleware';
import { addDownloadEventListener } from './downloadevent/downloadEventMiddleware';
import { addEngineModeListener } from './enginemode/engineModeMiddleware';
import { addEventsListener } from './events/eventsMiddleware';
import { addFlightControllerListener } from './flightcontroller/flightControllerMiddleware';
import { addGroupsListener } from './groups/groupsSliceMiddleware';
import { addLocalListener } from './local/localMiddleware';
import { addLoggingListener } from './logging/loggingMiddleware';
import { addMissionsListener } from './missions/missionsMiddleware';
import { addProfileListener } from './profile/profileMiddleware';
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
addCameraListener(startAppListening);
addCameraPathListener(startAppListening);
addConnectionListener(startAppListening);
addDocumentationListener(startAppListening);
addDownloadEventListener(startAppListening);
addEngineModeListener(startAppListening);
addEventsListener(startAppListening);
addFlightControllerListener(startAppListening);
addLoggingListener(startAppListening);
addMissionsListener(startAppListening);
addProfileListener(startAppListening);
addPropertiesListener(startAppListening);
addPropertyTreeListener(startAppListening);
addSessionRecordingListener(startAppListening);
addSkyBrowserListener(startAppListening);
addTimeListener(startAppListening);
addVersionListener(startAppListening);
addLocalListener(startAppListening);

// @TODO (2024-02-17, emmbr): The scene tree currently breaks if this lsitener is added
// before the property tree listener. This should be investigated, and fixed so that
// the order of the listeners does not matter.
addGroupsListener(startAppListening);
