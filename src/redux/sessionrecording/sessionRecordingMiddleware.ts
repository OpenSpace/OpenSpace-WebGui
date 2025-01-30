import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { ConnectionStatus } from '@/types/enums';

import { SessionRecordingState, updateSessionrecording } from './sessionRecordingSlice';

const subscribeToSessionRecording = createAction<void>('sessionRecording/subscribe');
const unsubscribeToSessionRecording = createAction<void>('sessionRecording/unsubscribe');

let topic: Topic;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'sessionRecording/setupSubscription',
  async (_, thunkAPI) => {
    topic = api.startTopic('sessionRecording', {
      event: 'start_subscription',
      properties: ['state', 'files']
    });
    (async () => {
      for await (const data of topic.iterator()) {
        thunkAPI.dispatch(updateSessionrecording(data));
      }
    })();
  }
);

// TODO (ylvse) 2024-12-02: This action is actually never used. In the previous repo we
// dispatched this when the session recording popover was closed.
// Now with the window system what to do?
export const refreshSessionRecording = createAsyncThunk(
  'sessionRecording/refresh',
  async (_, thunkAPI) => {
    if (topic) {
      topic.talk({
        event: 'refresh'
      });
    } else {
      // If we do not have a subscription, we need to create a new topic
      const tmpTopic = api.startTopic('sessionrecording', {
        event: 'refresh',
        properties: ['state', 'files']
      });
      (async () => {
        const data = (await tmpTopic
          .iterator()
          .next()) as unknown as SessionRecordingState;
        thunkAPI.dispatch(updateSessionrecording(data));
        tmpTopic.cancel();
      })();
    }
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
}

export const addSessionRecordingListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      if (nSubscribers > 0) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: subscribeToSessionRecording,
    effect: async (_, listenerApi) => {
      ++nSubscribers;
      const { connectionStatus } = listenerApi.getState().connection;
      if (nSubscribers === 1 && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToSessionRecording,
    effect: async () => {
      --nSubscribers;
      if (nSubscribers === 0) {
        unsubscribe();
      }
    }
  });
};

export { subscribeToSessionRecording, unsubscribeToSessionRecording };
