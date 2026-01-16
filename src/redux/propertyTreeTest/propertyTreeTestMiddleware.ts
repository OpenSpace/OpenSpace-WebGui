import {
  createAction,
  createAsyncThunk,
  isAnyOf,
  PayloadAction,
  Update
} from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { ConnectionStatus } from '@/types/enums';
import { AnyProperty } from '@/types/Property/property';
import { OpenSpacePropertyOwner, PropertyOwner, Uri } from '@/types/types';

import { updateOne, upsertMany } from './propertySlice';

const subscribeToPropertyTreeTest = createAction<void>('propertyTreeTest/subscribe');
const unsubscribeToPropertyTreeTest = createAction<void>('propertyTreeTest/unsubscribe');

let topic: Topic;
let nSubscribers = 0;

function flattenPropertyTree(propertyOwner: OpenSpacePropertyOwner) {
  let propertyOwners: PropertyOwner[] = [];
  let properties: AnyProperty[] = [];

  if (propertyOwner.uri) {
    propertyOwners.push({
      uri: propertyOwner.uri,
      identifier: propertyOwner.identifier,
      name: propertyOwner.guiName ?? propertyOwner.identifier,
      properties: propertyOwner.properties.map((p) => p.uri),
      subowners: propertyOwner.subowners.map((p) => p.uri),
      tags: propertyOwner.tag,
      description: propertyOwner.description
    });
  }

  // Recursively flatten subowners of incoming propertyOwner
  propertyOwner.subowners.forEach((subowner) => {
    const childData = flattenPropertyTree(subowner);

    propertyOwners = propertyOwners.concat(childData.propertyOwners);
    properties = properties.concat(childData.properties);
  });

  propertyOwner.properties.forEach((property) => {
    properties.push(property);
  });

  return { propertyOwners, properties };
}

export const setupSubscription = createAsyncThunk(
  'propertyTreeTest/setupSubscription',
  async (_, thunkAPI) => {
    topic = api.startTopic('propertyTree', {
      event: 'start_subscription'
    });
    (async () => {
      for await (const data of topic.iterator()) {
        if (data.event === 'root') {
          const { propertyOwners, properties } = flattenPropertyTree(
            data.payload as OpenSpacePropertyOwner
          );
          thunkAPI.dispatch(upsertMany(properties));
        }
        // thunkAPI.dispatch(updateSessionrecording(data));
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
}

export const addPropertyTreeTestListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      // if (nSubscribers > 0) {
      listenerApi.dispatch(setupSubscription());
      // }
    }
  });

  startListening({
    matcher: isAnyOf(updateOne),
    effect: async (
      action: PayloadAction<{
        payload: Update<AnyProperty, string>;
        type: 'propertyTree/updateOne';
      }>
    ) => {
      console.log('Property tree test updated:', action);
      try {
        api.setProperty(action.payload.id, action.payload.changes.value);
      } catch (error) {
        console.error('Failed to set property:', error);
      }
    }
  });

  startListening({
    actionCreator: subscribeToPropertyTreeTest,
    effect: async (_, listenerApi) => {
      ++nSubscribers;
      const { connectionStatus } = listenerApi.getState().connection;
      if (nSubscribers === 1 && connectionStatus === ConnectionStatus.Connected) {
        listenerApi.dispatch(setupSubscription());
      }
    }
  });

  startListening({
    actionCreator: unsubscribeToPropertyTreeTest,
    effect: async () => {
      --nSubscribers;
      if (nSubscribers === 0) {
        unsubscribe();
      }
    }
  });
};

export { subscribeToPropertyTreeTest, unsubscribeToPropertyTreeTest };
