import { createListenerMiddleware, type TypedStartListening } from '@reduxjs/toolkit';

import { addActionsListener } from './actions/actionsMiddleware';
import { addConnectionListener } from './connection/connectionMiddleware';
import { addDocumentationListener } from './documentation/documentationMiddleware';
import { addEventsListener } from './events/eventsMiddleware';
import { addFlightControllerListener } from './flightcontroller/flightControllerMiddleware';
import { addGroupsListener } from './groups/groupsSliceMiddleware';
import { addPropertiesListener } from './propertytree/properties/propertiesMiddleware';
import { addPropertyTreeListener } from './propertytree/propertyTreeMiddleware';
import { addSessionRecordingListener } from './sessionrecording/sessionRecordingMiddleware';
import { addTimeListener } from './time/timeMiddleware';
import type { AppDispatch, RootState } from './store';

export const listenerMiddleware = createListenerMiddleware();
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = listenerMiddleware.startListening as AppStartListening;

addConnectionListener(startAppListening);
addSessionRecordingListener(startAppListening);
addActionsListener(startAppListening);
addDocumentationListener(startAppListening);
addEventsListener(startAppListening);
addPropertiesListener(startAppListening);
addPropertyTreeListener(startAppListening);
addFlightControllerListener(startAppListening);
addGroupsListener(startAppListening);
addTimeListener(startAppListening);
