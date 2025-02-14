import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { ConnectionStatus } from '@/types/enums';

import { onOpenConnection } from '../connection/connectionSlice';
import { AppStartListening } from '../listenerMiddleware';

import { EngineModeState, updateEngineMode } from './engineModeSlice';

export const subscribeToEngineMode = createAction<void>('engineMode/subscribe');
export const unsubscribeToEngineMode = createAction<void>('engineMode/unsubscribe');

let topic: Topic | null = null;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'engineMode/setupSubscription',
  async (_, thunkApi) => {
    topic = api.startTopic('engineMode', {
      event: 'start_subscription',
      properties: ['mode']
    });
    (async () => {
      for await (const data of topic.iterator() as AsyncIterable<EngineModeState>) {
        thunkApi.dispatch(updateEngineMode(data));
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

export const addEngineModeListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      if (nSubscribers > 0) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: subscribeToEngineMode,
    effect: async (_, listenerApi) => {
      ++nSubscribers;
      const { connectionStatus } = listenerApi.getState().connection;
      if (nSubscribers === 1 && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToEngineMode,
    effect: async () => {
      --nSubscribers;
      if (nSubscribers === 0) {
        unsubscribe();
      }
    }
  });
};
