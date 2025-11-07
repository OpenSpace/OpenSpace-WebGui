import { createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { getAction } from '@/redux/actions/actionsMiddleware';
import { removeAction } from '@/redux/actions/actionsSlice';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { refreshMissions } from '@/redux/missions/missionsMiddleware';
import {
  addUriToPropertyTree,
  removeUriFromPropertyTree
} from '@/redux/propertytree/propertyTreeMiddleware';
import { ConnectionStatus, LogLevel } from '@/types/enums';
import { eventBus } from '@/util/eventBus';

import { showGUI } from '../sessionrecording/sessionRecordingMiddleware';

import { EventData } from './types';

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
      thunkAPI.dispatch(
        handleNotificationLogging(
          'Error subscribing to OpenSpace events',
          e,
          LogLevel.Error
        )
      );
      thunkAPI.rejectWithValue(e);
    }
    for await (const data of eventTopic.iterator() as AsyncIterable<EventData>) {
      switch (data.Event) {
        case 'PropertyTreeUpdated':
          thunkAPI.dispatch(addUriToPropertyTree(data.Uri));
          break;
        case 'PropertyTreePruned':
          thunkAPI.dispatch(removeUriFromPropertyTree({ uri: data.Uri }));
          break;
        case 'ActionAdded':
          thunkAPI.dispatch(getAction(data.Uri));
          break;
        case 'ActionRemoved':
          thunkAPI.dispatch(removeAction(data.Uri));
          break;
        case 'MissionAdded':
        case 'MissionRemoved':
          thunkAPI.dispatch(refreshMissions());
          break;
        case 'SessionRecordingPlayback':
          if (data.State === 'Finished') {
            thunkAPI.dispatch(showGUI(true));
          }
          break;
        case 'AssetLoadingFinished':
          eventBus.emit(data);
          break;
        case 'AssetLoadingError':
          eventBus.emit(data);
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
      const { connectionStatus } = listenerApi.getState().connection;
      if (!isSubscribed && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupEventsSubscription());
        isSubscribed = true;
      }
    }
  });
  startListening({
    actionCreator: onCloseConnection,
    effect: (_, listenerApi) => {
      const { connectionStatus } = listenerApi.getState().connection;
      if (isSubscribed && connectionStatus === ConnectionStatus.Connected) {
        tearDownSubscription();
      }
    }
  });
};
