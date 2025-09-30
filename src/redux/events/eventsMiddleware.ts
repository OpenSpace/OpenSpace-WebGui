import { createAsyncThunk } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { getAction } from '@/redux/actions/actionsMiddleware';
import { removeAction } from '@/redux/actions/actionsSlice';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { setSceneTreeNodeVisibility } from '@/redux/local/localSlice';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { refreshMissions } from '@/redux/missions/missionsMiddleware';
import {
  addUriToPropertyTree,
  removeUriFromPropertyTree
} from '@/redux/propertytree/propertyTreeMiddleware';
import { showGUI } from '@/redux/sessionrecording/sessionRecordingMiddleware';
import { ConnectionStatus, LogLevel } from '@/types/enums';
import { sgnRenderableUri, sgnUri } from '@/util/propertyTreeHelpers';

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
        case 'RenderableDisabled':
          thunkAPI.dispatch(
            setSceneTreeNodeVisibility({
              uri: sgnRenderableUri(sgnUri(data.Node)),
              isVisible: false
            })
          );
          break;
        case 'RenderableEnabled':
          thunkAPI.dispatch(
            setSceneTreeNodeVisibility({
              uri: sgnRenderableUri(sgnUri(data.Node)),
              isVisible: true
            })
          );
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
