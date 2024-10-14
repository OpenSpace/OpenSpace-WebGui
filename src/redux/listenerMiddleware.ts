import { createListenerMiddleware, type TypedStartListening } from '@reduxjs/toolkit';

import { addConnectionListener } from './connection/connectionMiddleware';
import type { AppDispatch, RootState } from './store';
import { addActionsListener } from './actions/actionsMiddleware';

export const listenerMiddleware = createListenerMiddleware();
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = listenerMiddleware.startListening as AppStartListening;

addConnectionListener(startAppListening);
addActionsListener(startAppListening);
