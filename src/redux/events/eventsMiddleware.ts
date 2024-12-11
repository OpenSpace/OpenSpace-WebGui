import { createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import {
  addUriToPropertyTree,
  removeUriFromPropertyTree
} from '@/redux/propertytree/propertyTreeMiddleware';
import { EventData } from '@/types/event-types';

let eventTopic: Topic;
let isSubscribed = false;

export const setupEventsSubscription = createAsyncThunk(
  'events/setupSubscription',
  async (_, thunkAPI) => {
    try {
      eventTopic = api.startTopic('event', {
        event: '*',
        status: 'start_subscription'
      });
    } catch (e) {
      console.error(e);
    }
    for await (const data of eventTopic.iterator() as AsyncIterable<EventData>) {
      switch (data.Event) {
        case 'PropertyTreeUpdated':
          thunkAPI.dispatch(addUriToPropertyTree(data.Uri));
          break;
        case 'PropertyTreePruned':
          thunkAPI.dispatch(removeUriFromPropertyTree({ uri: data.Uri }));
          break;
        default:
          break;
      }
    }
  }
);

function tearDownSubscription() {
  if (!eventTopic) {
    return;
  }
  eventTopic.talk({
    event: 'stop_subscription'
  });
  eventTopic.cancel();
  isSubscribed = false;
}

export const addEventsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: (_, listenerApi) => {
      if (!isSubscribed && listenerApi.getState().connection.isConnected) {
        listenerApi.dispatch(setupEventsSubscription());
        isSubscribed = true;
      }
    }
  });
  startListening({
    actionCreator: onCloseConnection,
    effect: (_, listenerApi) => {
      if (isSubscribed && listenerApi.getState().connection.isConnected) {
        tearDownSubscription();
      }
    }
  });
};
