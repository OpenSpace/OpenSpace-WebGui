import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import { refreshGroups } from '@/redux/groups/groupsSliceMiddleware';
import type { AppStartListening } from '@/redux/listenerMiddleware';
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

import {
  addProperties,
  clearProperties,
  removeProperties
} from './properties/propertiesSlice';
import {
  addPropertyOwners,
  clearPropertyOwners,
  removePropertyOwners
} from './propertyowner/propertyOwnerSlice';

// The property tree middleware is designed to populate the react store's
// copy of the property tree when the frontend is connected to OpenSpace

export const reloadPropertyTree = createAction<void>('propertyTree/reload');
export const removeUriFromPropertyTree = createAction<{ uri: Uri }>(
  'propertyTree/removeUri'
);

export const addUriToPropertyTree = createAsyncThunk(
  'propertyTree/addUri',
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

export const addPropertyTreeListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onOpenConnection,
    effect: async (_, listenerApi) => {
      // TODO anden88 2024-10-18: Right now the reloadPropertyTree is only dispatched here
      // consder to put the reload logic in here immedieately?
      listenerApi.dispatch(reloadPropertyTree());
    }
  });

  startListening({
    actionCreator: addUriToPropertyTree.fulfilled,
    effect: (action, listenerApi) => {
      if (action.payload?.propertyOwners) {
        listenerApi.dispatch(addPropertyOwners(action.payload.propertyOwners));
      }
      if (action.payload?.properties) {
        listenerApi.dispatch(addProperties(action.payload.properties));
      }
    }
  });

  startListening({
    actionCreator: removeUriFromPropertyTree,
    effect: (action, listenerApi) => {
      const { uri } = action.payload;

      listenerApi.dispatch(removePropertyOwners({ uris: [uri] }));
      listenerApi.dispatch(removeProperties({ uris: [uri] }));
      listenerApi.dispatch(refreshGroups());
    }
  });
  startListening({
    actionCreator: reloadPropertyTree,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(clearProperties());
      listenerApi.dispatch(clearPropertyOwners());
      listenerApi.dispatch(addUriToPropertyTree(rootOwnerKey));
    }
  });
};
