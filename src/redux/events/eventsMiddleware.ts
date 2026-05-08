import { createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js/topics';

import { api } from '@/api/api';
import { getAction } from '@/redux/actions/actionsMiddleware';
import { removeAction } from '@/redux/actions/actionsSlice';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { refreshMissions } from '@/redux/missions/missionsMiddleware';
import { ConnectionStatus, NotificationLevel } from '@/types/enums';
import { eventBus } from '@/util/eventBus';

import {
  addUriToPropertyTree,
  removeUriFromPropertyTree
} from '../propertytree/propertyTreeMiddleware';
import { showGUI } from '../sessionrecording/sessionRecordingMiddleware';

let eventTopic: Topic<'event'>;
let isSubscribed = false;

export const setupEventsSubscription = createAsyncThunk(
  'events/setupSubscription',
  async (_, thunkAPI) => {
    try {
      eventTopic = api.startTopic('event', {
        event: 'start_subscription',
        eventType: '*'
      });
    } catch (e) {
      thunkAPI.dispatch(
        handleNotificationLogging(
          'Error subscribing to OpenSpace events',
          e,
          NotificationLevel.Error
        )
      );
      thunkAPI.rejectWithValue(e);
    }
    for await (const data of eventTopic) {
      switch (data.event) {
        case 'PropertyTreeUpdated':
          thunkAPI.dispatch(addUriToPropertyTree(data.uri));
          break;
        case 'PropertyTreePruned':
          thunkAPI.dispatch(removeUriFromPropertyTree({ uri: data.uri }));
          break;
        case 'ActionAdded':
          thunkAPI.dispatch(getAction(data.uri));
          break;
        case 'ActionRemoved':
          thunkAPI.dispatch(removeAction(data.uri));
          break;
        case 'MissionAdded':
        case 'MissionRemoved':
          thunkAPI.dispatch(refreshMissions());
          break;
        case 'SessionRecordingPlayback':
          if (data.state === 'Finished') {
            thunkAPI.dispatch(showGUI(true));
          }
          break;
        case 'AssetLoading':
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
    event: 'stop_subscription',
    eventType: '*'
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
