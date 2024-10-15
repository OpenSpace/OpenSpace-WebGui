import { createAction } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';

import type { AppStartListening } from '../listenerMiddleware';

import { SessionRecordingState, updateSessionrecording } from './sessionRecordingSlice';

const subscribeToSessionRecording = createAction<void>('subscribeToSessionRecording');
const unsubscribeToSessionRecording = createAction<void>('unsubscribeToSessionRecording');
const refreshSessionRecording = createAction<void>('refreshSessionRecording');

let topic: Topic;
let dataCallback:
  | null
  | ((data: SessionRecordingState) => {
      payload: SessionRecordingState;
      type: string;
    }) = null;
let nSubscribers = 0;

function subscribe() {
  topic = api.startTopic('sessionRecording', {
    event: 'start_subscription',
    properties: ['state', 'files']
  });
  (async () => {
    for await (const data of topic.iterator()) {
      if (dataCallback) {
        dataCallback(data);
      }
    }
  })();
}

function unsubscribe() {
  if (!topic) {
    return;
  }
  topic.talk({
    event: 'stop_subscription'
  });
  topic.cancel();
}

function refresh() {
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
      const data = (await tmpTopic.iterator().next()) as unknown as SessionRecordingState;
      if (dataCallback) {
        dataCallback(data);
      }
      tmpTopic.cancel();
    })();
  }
}

export const addSessionRecordingListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (action, listenerApi) => {
      if (nSubscribers === 0) {
        return;
      }

      dataCallback = (data: SessionRecordingState) =>
        listenerApi.dispatch(updateSessionrecording(data));
      subscribe();
    }
  });

  startListening({
    actionCreator: refreshSessionRecording,
    effect: async (action, listenerApi) => {
      dataCallback = (data: SessionRecordingState) =>
        listenerApi.dispatch(updateSessionrecording(data));
      refresh();
    }
  });

  startListening({
    actionCreator: subscribeToSessionRecording,
    effect: async (action, listenerApi) => {
      ++nSubscribers;
      const { isConnected } = listenerApi.getState().connection;
      if (nSubscribers === 1 && isConnected) {
        dataCallback = (data: SessionRecordingState) =>
          listenerApi.dispatch(updateSessionrecording(data));
        subscribe();
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToSessionRecording,
    effect: async (_action, _listenerApi) => {
      --nSubscribers;
      if (nSubscribers === 0) {
        dataCallback = null;
        unsubscribe();
      }
    }
  });
};

export {
  refreshSessionRecording,
  subscribeToSessionRecording,
  unsubscribeToSessionRecording
};
