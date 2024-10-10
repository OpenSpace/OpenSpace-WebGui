import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';

import { updateSessionrecording, SessionRecordingState } from './sessionRecordingSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useOpenSpaceApi } from '@/api/OpenspaceApi';
// Create the middleware instance and methods
export const sessionRecordingMiddleware = createListenerMiddleware();
interface TestState {
  test: string;
}
const subscribeToSessionRecording = createAction<void>('subscribeToSessionRecording');
const unsubscribeToSessionRecording = createAction<void>('unsubscribeToSessionRecording');
const refreshSessionRecording = createAction<void>('refreshSessionRecording');
const onOpenConnection = createAction<void>('onOpenConnection');

let topic;
let dataCallback;
let nSubscribers = 0;

function subscribe() {
  console.log('subscribe');
}

function unsubscribe() {
  console.log('unsubscribe');
}

function refresh() {
  console.log('refresh');
}

sessionRecordingMiddleware.startListening({
  actionCreator: onOpenConnection,
  effect: async (action, listenerApi) => {
    if (nSubscribers === 0) {
      return;
    }
    //console.log(openspace);
    //const dispatch = useAppDispatch();
    /* dataCallback = (data: SessionRecordingState) =>
      dispatch(updateSessionrecording(data)); */
  }
});

sessionRecordingMiddleware.startListening({
  actionCreator: refreshSessionRecording,
  effect: async (action, listenerApi) => {
    console.log(listenerApi);
    //const dispatch = useAppDispatch();
    /*  dataCallback = (data: SessionRecordingState) =>
      dispatch(updateSessionrecording(data)); */
    refresh();
  }
});

sessionRecordingMiddleware.startListening({
  actionCreator: subscribeToSessionRecording,
  effect: async (action, listenerApi) => {
    ++nSubscribers;
    // TODO: Add this to the if statement
    //const isConnected = useAppSelector(state => state.connection.isConnected);
    if (nSubscribers === 1) {
      //const dispatch = useAppDispatch();
      /*  dataCallback = (data: SessionRecordingState) =>
        dispatch(updateSessionrecording(data)); */
      subscribe();
    }
  }
});

sessionRecordingMiddleware.startListening({
  actionCreator: unsubscribeToSessionRecording,
  effect: async (action, listenerApi) => {
    --nSubscribers;
    if (nSubscribers === 0) {
      unsubscribe();
    }
  }
});

export {
  onOpenConnection,
  subscribeToSessionRecording,
  unsubscribeToSessionRecording,
  refreshSessionRecording
};
