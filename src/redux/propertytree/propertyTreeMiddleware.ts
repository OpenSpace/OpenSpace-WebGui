import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/api/api';
import { onOpenConnection } from '@/redux/connection/connectionSlice';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import {
  Properties,
  Property,
  PropertyMetaData,
  PropertyOwner,
  PropertyOwners
} from '@/types/types';
import { rootOwnerKey } from '@/util/keys';

import { clearProperties, removeProperties } from './properties/propertiesSlice';
import {
  clearPropertyOwners,
  removePropertyOwners
} from './propertyowner/propertyOwnerSlice';
import { refreshGroups } from '../groups/groupsSliceMiddleware';

export const reloadPropertyTree = createAction<void>('reloadPropertyTree');
export const removeUriFromPropertyTree = createAction<{ uri: string }>(
  'removeUriFromPropertyTree'
);

export const addUriToPropertyTree = createAsyncThunk(
  'propertyTree/addUriToPropertyTree',
  async (uri: string, thunkAPI) => {
    const response = (await api.getProperty(uri)) as
      | OpenSpaceProperty
      | OpenSpacePropertyOwner;

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
      const result = [convertOsPropertyToProperty(response)];
      const propertiesMap: Properties = {};
      result.forEach((p) => {
        propertiesMap[p.uri] = p;
      });
      return {
        properties: propertiesMap,
        propertyOwners: null
      };
    }
  }
);

// The property tree middleware is designed to populate the react store's
// copy of the property tree when the frontend is connected to OpenSpace.

// The property owner data we get from OpenSpace is different from what we want to store
// in the redux state, hence this local owner type to get proper ts highlighting when
// converting the data.
type OpenSpacePropertyOwner = {
  description: string;
  guiName: string;
  identifier: string;
  properties: OpenSpaceProperty[];
  subowners: OpenSpacePropertyOwner[];
  tag: string[];
  uri: string;
};

type OpenSpaceProperty = {
  Description: {
    AdditionalData: object;
    Identifier: string;
    MetaData: PropertyMetaData;
    Name: string;
    Type: string; // TODO: define these as property types? i.e., boolproperty | stringproperty etc
    description: string;
  };
  Value: string | number | number[] | boolean;
};

/**
 * Utility function to convert an OpenSpace property object to our internal property
 * object
 */
function convertOsPropertyToProperty(prop: OpenSpaceProperty): Property {
  return {
    uri: prop.Description.Identifier,
    value: prop.Value,
    // TODO anden88 2024-10-18: when the description data is sent with first letter
    // lowercase we can simplify this to "description: property.description"
    description: {
      additionalData: prop.Description.AdditionalData,
      identifier: prop.Description.Identifier,
      metaData: prop.Description.MetaData,
      name: prop.Description.Name,
      type: prop.Description.Type,
      description: prop.Description.description
    }
  };
}

function flattenPropertyTree(propertyOwner: OpenSpacePropertyOwner) {
  let propertyOwners: PropertyOwner[] = [];
  let properties: Property[] = [];

  if (propertyOwner.uri) {
    propertyOwners.push({
      uri: propertyOwner.uri,
      identifier: propertyOwner.identifier,
      name: propertyOwner.guiName ?? propertyOwner.identifier,
      properties: propertyOwner.properties.map((p) => p.Description.Identifier),
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
    properties.push(convertOsPropertyToProperty(property));
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
