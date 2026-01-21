import { createAction, createAsyncThunk, Update } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { ConnectionStatus } from '@/types/enums';
import { AnyProperty } from '@/types/Property/property';
import {
  OpenSpacePropertyOwner,
  Properties,
  PropertyOwner,
  PropertyOwners,
  Uri
} from '@/types/types';
import { rootOwnerKey } from '@/util/keys';
import { isGlobeLayer, removeLastWordFromUri } from '@/util/uris';

import { PropertyBatcher } from './propertyBatcher';
import { upsertMany as upsertManyPropertyOwners } from './propertyOwnerSlice';
import {
  updateMany as updateManyProperties,
  updateOne as updateProperty,
  upsertMany as upsertManyProperties
} from './propertySlice';

const subscribeToPropertyTreeTest = createAction<void>('propertyTreeTest/subscribe');
const unsubscribeToPropertyTreeTest = createAction<void>('propertyTreeTest/unsubscribe');
export const setPropertyValue = createAction<{ uri: Uri; value: AnyProperty['value'] }>(
  'propertyTreeTest/setProperty'
);

export const removeUriFromPropertyTree = createAction<{ uri: Uri }>(
  'propertyTreeTest/removeUri'
);

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
    const batchTime = 50; // milliseconds

    function updateFunc(updates: Update<AnyProperty, string>[]) {
      thunkAPI.dispatch(updateManyProperties(updates));
    }

    // Instead of throttling each property update, we batch them together
    // This ensures we don't miss any updates
    const batcher = new PropertyBatcher(updateFunc, batchTime);

    (async () => {
      for await (const data of topic.iterator()) {
        if (data.event === 'root') {
          const { propertyOwners, properties } = flattenPropertyTree(
            data.payload as OpenSpacePropertyOwner
          );
          thunkAPI.dispatch(upsertManyProperties(properties));
          thunkAPI.dispatch(upsertManyPropertyOwners(propertyOwners));
        } else {
          const property = data as { property: Uri; value: AnyProperty['value'] };
          batcher.add({
            id: property.property,
            changes: { value: property.value }
          });
        }
      }
    })();
  }
);

export const addUriToPropertyTree = createAsyncThunk(
  'propertyTreeTest/addUri',
  async (uri: Uri) => {
    let uriToFetch = uri;
    // If the uri is to a layer, we want to get the parent property owner.
    // This is to preserve the order of the layers.
    if (isGlobeLayer(uri)) {
      uriToFetch = removeLastWordFromUri(uri);
    }

    const response = (await api.getProperty(uriToFetch)) as
      | AnyProperty
      | OpenSpacePropertyOwner;

    // Property Owner
    if ('properties' in response) {
      const { properties, propertyOwners } = flattenPropertyTree(response);
      const propertiesMap: Properties = {};

      properties.forEach((p) => {
        propertiesMap[p.uri] = p;
      });
      const propertyOwnerMap: PropertyOwners = {};
      propertyOwners.forEach((p) => {
        propertyOwnerMap[p.uri] = p;
      });
      return {
        properties: propertiesMap,
        propertyOwners: propertyOwnerMap
      };
    } else {
      // Property
      const propertiesMap: Properties = {};
      propertiesMap[response.uri] = response;

      return {
        properties: propertiesMap,
        propertyOwners: null
      };
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

export const addPropertyTreeTestListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      // if (nSubscribers > 0) {
      listenerApi.dispatch(setupSubscription());
      listenerApi.dispatch(addUriToPropertyTree(rootOwnerKey));
      // }
    }
  });

  startListening({
    actionCreator: addUriToPropertyTree.fulfilled,
    effect: (action, listenerApi) => {
      if (action.payload?.propertyOwners) {
        listenerApi.dispatch(upsertManyPropertyOwners(action.payload.propertyOwners));
      }
      if (action.payload?.properties) {
        listenerApi.dispatch(upsertManyProperties(action.payload.properties));
      }
    }
  });

  startListening({
    actionCreator: setPropertyValue,
    effect: (action, listenerApi) => {
      api.setProperty(action.payload.uri, action.payload.value);
      listenerApi.dispatch(
        updateProperty({
          id: action.payload.uri,
          changes: { value: action.payload.value }
        })
      );
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
