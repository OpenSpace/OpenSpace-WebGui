import { createListenerMiddleware, type TypedStartListening } from '@reduxjs/toolkit';

import { addActionsListener } from './actions/actionsMiddleware';
import { addConnectionListener } from './connection/connectionMiddleware';
import { addSessionRecordingListener } from './sessionrecording/sessionRecordingMiddleware';
import { addExoplanetListener } from './exoplanets/exoplanetsMiddleware';
import type { AppDispatch, RootState } from './store';

export const listenerMiddleware = createListenerMiddleware();
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = listenerMiddleware.startListening as AppStartListening;

addConnectionListener(startAppListening);
addSessionRecordingListener(startAppListening);
addActionsListener(startAppListening);
addExoplanetListener(startAppListening);
