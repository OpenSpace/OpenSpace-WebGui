import { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { removeProperties } from '@/redux/propertytree/properties/propertiesSlice';
import { removePropertyOwners } from '@/redux/propertytree/propertyowner/propertyOwnerSlice';
import { addUriToPropertyTree } from '@/redux/propertytree/propertyTreeMiddleware';
import { EventData } from '@/types/event-types';

let eventTopic: Topic;
let nSubscribers = 0;

function handleData(dispatch: Dispatch<UnknownAction>, data: EventData) {
  switch (data.Event) {
    case 'PropertyTreeUpdated':
      dispatch(addUriToPropertyTree({ uri: data.Uri }));
      break;
    case 'PropertyTreePruned':
      dispatch(removePropertyOwners({ uris: [data.Uri] }));
      dispatch(removeProperties({ uris: [data.Uri] }));
      //   dispatch(refreshGroups) // TODO: add refresh groups slice action
      break;
    default:
      return;
  }
}

function setupSubscription(dispatch: Dispatch<UnknownAction>) {
  eventTopic = api.startTopic('event', {
    event: '*',
    status: 'start_subscription'
  });

  (async () => {
    for await (const data of eventTopic.iterator()) {
      handleData(dispatch, data as EventData);
    }
  })();
}

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
        setupSubscription(listenerApi.dispatch);
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
