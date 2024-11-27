import { createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import {
  addUriToPropertyTree,
  removeUriFromPropertyTree
} from '@/redux/propertytree/propertyTreeMiddleware';

let eventTopic: Topic;
let nSubscribers = 0;

export const setupSubscription = createAsyncThunk(
  'propertyTree/addUriToPropertyTree',
  async (_, thunkAPI) => {
    eventTopic = api.startTopic('event', {
      event: '*',
      status: 'start_subscription'
    });

    (async () => {
      for await (const data of eventTopic.iterator()) {
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
    })();
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
  nSubscribers--;
}

export const addEventsListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: (_, listenerApi) => {
      if (nSubscribers === 0) {
        listenerApi.dispatch(setupSubscription());
        nSubscribers++;
      }
    }
  });
  startListening({
    actionCreator: onCloseConnection,
    effect: (_, listenerApi) => {
      if (nSubscribers === 1 && listenerApi.getState().connection.isConnected) {
        tearDownSubscription();
      }
    }
  });
};
