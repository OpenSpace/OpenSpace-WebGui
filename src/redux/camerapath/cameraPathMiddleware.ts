import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js/topics';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { ConnectionStatus } from '@/types/enums';

import { updateCameraPath } from './cameraPathSlice';

export const subscribeToCameraPath = createAction<void>('cameraPath/subscribe');
export const unsubscribeToCameraPath = createAction<void>('cameraPath/unsubscribe');

let topic: Topic<'cameraPath'> | null = null;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'cameraPath/setupSubscription',
  async (_, thunkApi) => {
    topic = api.startTopic('cameraPath', {
      event: 'start_subscription'
    });
    (async () => {
      for await (const data of topic) {
        thunkApi.dispatch(updateCameraPath(data));
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

export const addCameraPathListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      if (nSubscribers > 0) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: subscribeToCameraPath,
    effect: async (_, listenerApi) => {
      ++nSubscribers;
      const { connectionStatus } = listenerApi.getState().connection;
      if (nSubscribers === 1 && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToCameraPath,
    effect: async () => {
      --nSubscribers;
      if (nSubscribers === 0) {
        unsubscribe();
      }
    }
  });
};
