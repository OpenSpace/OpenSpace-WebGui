import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { ConnectionStatus } from '@/types/enums';

import { onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';

import { CameraState, updateCamera } from './cameraSlice';

export const subscribeToCamera = createAction<void>('camera/subscribe');
export const unsubscribeToCamera = createAction<void>('camera/unsubscribe');

let topic: Topic | null = null;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'camera/setupSubscription',
  async (_, thunkApi) => {
    topic = api.startTopic('camera', {
      event: 'start_subscription'
    });
    (async () => {
      for await (const data of topic.iterator() as AsyncIterable<CameraState>) {
        thunkApi.dispatch(updateCamera(data));
      }
    })();
  }
);

function unsubscribe() {
  if (!topic) {
    return;
  }

  topic.talk({
    event: 'stop_subscription'
  });
  topic.cancel();
  topic = null;
}

export const addCameraListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      if (nSubscribers > 0) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: subscribeToCamera,
    effect: async (_, listenerApi) => {
      ++nSubscribers;
      const { connectionStatus } = listenerApi.getState().connection;
      if (nSubscribers === 1 && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToCamera,
    effect: async () => {
      --nSubscribers;
      if (nSubscribers === 0) {
        unsubscribe();
      }
    }
  });
};
