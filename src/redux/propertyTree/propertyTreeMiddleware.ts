import { createAction, createAsyncThunk, Update } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { AnyProperty } from '@/types/Property/property';
import {
  OpenSpacePropertyOwner,
  Properties,
  PropertyOwner,
  Uri,
  Visibility
} from '@/types/types';
import { Batcher } from '@/util/batcher';
import { rootOwnerKey } from '@/util/keys';
import { checkVisibility } from '@/util/propertyTreeHelpers';
import { isGlobeLayer, isSceneGraphNode, removeLastWordFromUri } from '@/util/uris';

import { refreshGroups } from '../groups/groupsSliceMiddleware';
import { setSceneGraphNodesVisibility } from '../local/localSlice';

import {
  addPropertyOwners,
  removePropertyOwners,
  reset as resetPropertyOwners,
  setInitialState
} from './propertyOwnerSlice';
import {
  removeMany,
  reset as resetProperties,
  updateMany as updateManyProperties,
  updateOne as updateProperty,
  upsertMany as upsertManyProperties
} from './propertySlice';

export const setPropertyValue = createAction<{ uri: Uri; value: AnyProperty['value'] }>(
  'propertyTreeTest/setProperty'
);

export const removeUriFromPropertyTree = createAction<{ uri: Uri }>(
  'propertyTreeTest/removeUri'
);

let topic: Topic;

function calculateVisibility(propertyOwners: PropertyOwner[], properties: Properties) {
  const sceneGraphNodes = propertyOwners.filter((p) => isSceneGraphNode(p.uri));
  const visibility = sceneGraphNodes.map((sgn) => {
    const fade = properties[`${sgn.uri}.Renderable.Fade`]?.value as number | undefined;
    const enabled = properties[`${sgn.uri}.Renderable.Enabled`]?.value as
      | boolean
      | undefined;
    return checkVisibility(enabled, fade);
  });
  const visibilityMap: Record<Uri, Visibility | undefined> = {};
  sceneGraphNodes.forEach((sgn, i) => {
    visibilityMap[sgn.uri] = visibility[i];
  });
  return visibilityMap;
}

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

    function updateFunc(updates: Update<AnyProperty, Uri>[]) {
      thunkAPI.dispatch(updateManyProperties(updates));
    }

    // Instead of throttling each property update, we batch them together
    // This ensures we don't miss any updates
    const batcher = new Batcher<AnyProperty>(updateFunc);

    (async () => {
      for await (const data of topic.iterator()) {
        const property = data as { property: Uri; value: AnyProperty['value'] };

        batcher.add({
          id: property.property,
          changes: { value: property.value }
        });
      }
    })();
  }
);

const getRoot = createAsyncThunk('propertyTreeTest/getRoot', async (_, thunkAPI) => {
  const response = (await api.getProperty(rootOwnerKey)) as
    | AnyProperty
    | OpenSpacePropertyOwner;
  const { propertyOwners, properties } = flattenPropertyTree(
    response as OpenSpacePropertyOwner
  );
  const propertiesMap: Properties = {};

  properties.forEach((p) => {
    propertiesMap[p.uri] = p;
  });
  const visibilityMap = calculateVisibility(propertyOwners, propertiesMap);

  thunkAPI.dispatch(upsertManyProperties(properties));
  thunkAPI.dispatch(setInitialState(propertyOwners));
  thunkAPI.dispatch(setSceneGraphNodesVisibility(visibilityMap));
  thunkAPI.dispatch(refreshGroups());
});

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

      const visibility = calculateVisibility(propertyOwners, propertiesMap);

      return {
        properties: propertiesMap,
        propertyOwners,
        visibility
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

export const addPropertyTreeListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(resetPropertyOwners());
      listenerApi.dispatch(resetProperties());
      listenerApi.dispatch(getRoot());
      listenerApi.dispatch(setupSubscription());
    }
  });

  startListening({
    actionCreator: onCloseConnection,
    effect: () => {
      unsubscribe();
    }
  });

  startListening({
    actionCreator: addUriToPropertyTree.fulfilled,
    effect: (action, listenerApi) => {
      if (action.payload?.propertyOwners) {
        listenerApi.dispatch(addPropertyOwners(action.payload.propertyOwners));
      }
      if (action.payload?.properties) {
        listenerApi.dispatch(upsertManyProperties(action.payload.properties));
      }
      listenerApi.dispatch(refreshGroups());
    }
  });

  startListening({
    actionCreator: removeUriFromPropertyTree,
    effect: (action, listenerApi) => {
      const uriToRemove = action.payload.uri;
      listenerApi.dispatch(removePropertyOwners({ uris: [uriToRemove] }));
      listenerApi.dispatch(removeMany([uriToRemove]));
      listenerApi.dispatch(refreshGroups());
    }
  });

  startListening({
    actionCreator: setPropertyValue,
    effect: (action, listenerApi) => {
      api.setProperty(action.payload.uri, action.payload.value);
      // Optimistically update the property value in the store
      listenerApi.dispatch(
        updateProperty({
          id: action.payload.uri,
          changes: { value: action.payload.value }
        })
      );
    }
  });
};
