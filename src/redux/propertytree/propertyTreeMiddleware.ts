import { createAction, createAsyncThunk, Update } from '@reduxjs/toolkit';
import { Topic } from 'openspace-api-js/topics';
import { AnyProperty, AnyPropertyMetaData, PropertyOwner } from 'openspace-api-js/types';

import { api } from '@/api/api';
import { onCloseConnection, onOpenConnection } from '@/redux/connection/connectionSlice';
import { refreshGroups } from '@/redux/groups/groupsSliceMiddleware';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { setSceneGraphNodesVisibility } from '@/redux/local/localSlice';
import { Properties, PropertyOwnerRedux, Uri, Visibility } from '@/types/types';
import { Batcher } from '@/util/batcher';
import { rootOwnerKey } from '@/util/keys';
import { checkVisibility } from '@/util/propertyTreeHelpers';
import { isGlobeLayer, isSceneGraphNode, removeLastWordFromUri } from '@/util/uris';

import {
  addPropertyOwners,
  propertyOwnerSelectors,
  removePropertyOwners,
  reset as resetPropertyOwners,
  setInitialState,
  updateOne as updatePropertyOwner
} from './propertyOwnerSlice';
import {
  removeMany,
  reset as resetProperties,
  updateMany as updateManyProperties,
  updateOne as updateProperty,
  upsertMany as upsertManyProperties
} from './propertySlice';

export const setPropertyValue = createAction<{ uri: Uri; value: AnyProperty['value'] }>(
  'propertyTree/setProperty'
);

export const removeUriFromPropertyTree = createAction<{ uri: Uri }>(
  'propertyTree/removeUri'
);

let topic: Topic<'propertyTree'>;

function calculateSgnVisibilityMap(
  propertyOwners: PropertyOwnerRedux[],
  properties: Properties
) {
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

function flattenPropertyTree(propertyOwner: PropertyOwner) {
  let propertyOwners: PropertyOwnerRedux[] = [];
  let properties: AnyProperty[] = [];

  if (propertyOwner.uri) {
    propertyOwners.push({
      uri: propertyOwner.uri,
      identifier: propertyOwner.identifier,
      name: propertyOwner.guiName ?? propertyOwner.identifier,
      properties: propertyOwner.properties.map((p) => p.uri),
      subowners: propertyOwner.subowners.map((p) => p.uri),
      tags: propertyOwner.tags,
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
  'propertyTree/setupSubscription',
  async (_, thunkAPI) => {
    topic = api.startTopic('propertyTree', {
      event: 'start_subscription'
    });

    type PropertyUpdate = Record<
      Uri,
      {
        value?: AnyProperty['value'];
        metaData?: AnyPropertyMetaData;
        uri?: string;
      }
    >;

    function updateFunc(updates: Partial<PropertyUpdate>) {
      // Convert the updates into the format expected by our RTK updateMany reducer
      const rtkUpdates: Update<AnyProperty, string>[] = Object.entries(updates)
        .filter(([, value]) => value !== undefined)
        .map(([id, value]) => ({
          id,
          changes: value as Partial<AnyProperty>
        }));
      thunkAPI.dispatch(updateManyProperties(rtkUpdates));
    }

    // Instead of throttling each property update, we batch them together.
    // This ensures we don't miss any updates
    const batcher = new Batcher<PropertyUpdate>(updateFunc);

    (async () => {
      for await (const data of topic) {
        if (data.type === 'value') {
          // There is a missmatch between the `data.value` being a `JsonValue` and the
          // `AnyProperty['value']` where the JsonValue is wider (allows for mixed arrays
          // and nested objects). However, at runtime the data coming from OpenSpace will
          // always be a valid propety value for this uri, so it _should_ be ok to cast
          // here
          batcher.add({ [data.uri]: { value: data.value as AnyProperty['value'] } });
        } else {
          batcher.add({
            [data.uri]: { metaData: data.metaData }
          });
        }
      }
      // Empty out any remaining updates in the batcher
      batcher.flush();
    })();
  }
);

const getRoot = createAsyncThunk('propertyTree/getRoot', async (_, thunkAPI) => {
  const response = await api.getProperty(rootOwnerKey);

  if (response.type !== 'propertyOwner') {
    throw new Error(`Expected propertyOwner, got '${JSON.stringify(response)}'`);
  }

  const { propertyOwners, properties } = flattenPropertyTree(response.value);
  const propertiesMap: Properties = {};

  properties.forEach((p) => {
    propertiesMap[p.uri] = p;
  });

  const visibilityMap = calculateSgnVisibilityMap(propertyOwners, propertiesMap);

  thunkAPI.dispatch(upsertManyProperties(properties));
  thunkAPI.dispatch(setInitialState(propertyOwners));
  thunkAPI.dispatch(setSceneGraphNodesVisibility(visibilityMap));
  thunkAPI.dispatch(refreshGroups());
});

export const addUriToPropertyTree = createAsyncThunk(
  'propertyTree/addUri',
  async (uri: Uri) => {
    let uriToFetch = uri;

    // If the uri is to a layer, we want to get the parent property owner.
    // This is to preserve the order of the layers.
    if (isGlobeLayer(uri)) {
      uriToFetch = removeLastWordFromUri(uri);
    }

    const response = await api.getProperty(uriToFetch);
    console.log(response);

    // Property Owner
    if (response.type === 'propertyOwner') {
      const { properties, propertyOwners } = flattenPropertyTree(response.value);
      const propertiesMap: Record<Uri, AnyProperty> = {};

      properties.forEach((p) => {
        propertiesMap[p.uri] = p;
      });

      // Calculate if visibility for the scene graph node, if the added property owner is one.
      // This will be an empty object if not.
      const visibility = calculateSgnVisibilityMap(propertyOwners, propertiesMap);

      return {
        properties: propertiesMap,
        propertyOwners,
        visibility
      };
    } else {
      // Property
      const propertiesMap: Record<Uri, AnyProperty> = {};
      propertiesMap[response.value.uri] = response.value;

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

        // When a standalone property is added (no accompanying property owner),
        // we need to update the parent property owner's properties array so that
        // the new property is rendered in the UI.
        if (!action.payload.propertyOwners) {
          const state = listenerApi.getState();
          const parentUpdates = new Map<string, Set<string>>();

          for (const uri of Object.keys(action.payload.properties)) {
            const lastDotPos = uri.lastIndexOf('.');
            if (lastDotPos === -1) continue;
            const parentUri = uri.substring(0, lastDotPos);
            console.log('Parent URI:', parentUri);
            const parent = propertyOwnerSelectors.selectById(state, parentUri);
            console.log('Parent Owner:', parent);
            if (parent) {
              if (!parentUpdates.has(parentUri)) {
                parentUpdates.set(parentUri, new Set(parent.properties));
              }
              parentUpdates.get(parentUri)!.add(uri);
            }
          }

          for (const [parentUri, properties] of parentUpdates.entries()) {
            listenerApi.dispatch(
              updatePropertyOwner({
                id: parentUri,
                changes: { properties: Array.from(properties) }
              })
            );
          }
        }
      }
      if (action.payload?.visibility) {
        listenerApi.dispatch(setSceneGraphNodesVisibility(action.payload.visibility));
      }
      listenerApi.dispatch(refreshGroups());
    }
  });

  startListening({
    actionCreator: removeUriFromPropertyTree,
    effect: (action, listenerApi) => {
      const uriToRemove = action.payload.uri;
      const state = listenerApi.getState();

      const isPropertyOwner = !!propertyOwnerSelectors.selectById(state, uriToRemove);

      if (isPropertyOwner) {
        // Collect all property URIs from the entire removed subtree (the property owner
        // itself plus all its nested subowners at any depth) and remove them from the
        // properties slice. removePropertyOwners handles removing the owner entities and
        // updating the parent's subowners array.
        const allOwnerEntities = propertyOwnerSelectors.selectEntities(state);
        const propertyUrisToRemove: Uri[] = [];

        for (const [ownerUri, owner] of Object.entries(allOwnerEntities)) {
          if (ownerUri === uriToRemove || ownerUri.startsWith(`${uriToRemove}.`)) {
            propertyUrisToRemove.push(...(owner?.properties ?? []));
          }
        }

        console.log(propertyUrisToRemove);

        if (propertyUrisToRemove.length > 0) {
          listenerApi.dispatch(removeMany(propertyUrisToRemove));
        }
      } else {
        // If the URI is a standalone property (not a property owner), remove it from the
        // parent property owner's properties array before removing it from the slice.
        // This prevents stale URI references causing "properties[uri] is undefined" errors.
        const lastDotPos = uriToRemove.lastIndexOf('.');
        if (lastDotPos !== -1) {
          const parentUri = uriToRemove.substring(0, lastDotPos);
          const parent = propertyOwnerSelectors.selectById(state, parentUri);
          if (parent) {
            listenerApi.dispatch(
              updatePropertyOwner({
                id: parentUri,
                changes: {
                  properties: parent.properties.filter((p) => p !== uriToRemove)
                }
              })
            );
          }
        }
        listenerApi.dispatch(removeMany([uriToRemove]));
      }

      listenerApi.dispatch(removePropertyOwners({ uris: [uriToRemove] }));
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
