import { createAction, Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { throttle } from 'lodash';
import { Topic } from 'openspace-api-js';
import {
  Property,
  PropertyMetaData,
  PropertyOwner,
  PropertyValue
} from 'src/types/types';

import { api } from '@/api/api';
import type { AppStartListening } from '@/redux/listenerMiddleware';
import { rootOwnerKey } from '@/util/keys';

import { onCloseConnection, onOpenConnection } from '../connection/connectionSlice';
import { RootState } from '../store';

import {
  addProperties,
  addPropertyOwners,
  clearPropertyTree,
  setPropertyValue,
  updatePropertyValue
} from './propertyTreeSlice';

export const reloadPropertyTree = createAction<void>('reloadPropertyTree');
export const addUriToPropertyTree = createAction<{ uri: string }>('addUriToPropertyTree');
export const subscribeToProperty = createAction<{ uri: string }>('subscribeToProperty');
export const unsubscribeToProperty = createAction<{ uri: string }>(
  'unsubscribeToProperty'
);

// The property tree middleware is designed to populate the react store's
// copy of the property tree when the frontend is connected to OpenSpace.
// The middleware also supports subscribing and setting properties
// regardless of whether they are present in the redux store or not.
// However, for values to propagate to the subscribing client,
// the property needs to exist in the tree.
// React components retrieve property values from the property tree by using
// react-redux `connect`.
//
// When subscribing to and setting a property, there are four cases:
// 1) We're connected to the backend. Property exists in the property tree:
//      This is the happy path.
//      Subscribing: The subscription is registered and
//      the subscriber will get updates through redux.
//      Setting: The data is sent to the backend.
//
// 2) We're not connected to backend. Property exists in the property tree:
//      This means that OpenSpace was once connected but lost connection.
//      Subscribing: Subscriptions are then stored as `pending`, so they can be
//      resumed once the connection is established again.
//      Setting: Properties are considered read-only in disconnected state.
//      The property will not be set.
//
// 3) We're connected to backend. Property does not exist in the property tree:
//      Subscribing: We are trying to subscribe a property that is not yet loaded
//      into the frontend, or the property does not exist at all.
//      There is no way for the frontend to know which of the two cases are true,
//      so the subscription is stored as `orphan`, and will kick in as soon as the
//      property can be located in the redux state.
//      Setting: We will send the update to the backend, which will accept the
//      setting if the property exists.
//
// 4) We're not connected to backend and the property does not exist in the property tree:
//      Subscribing: We store the subscription as `pending` and will try to promote it to
//      an active subscription when we are connected.
//      If it still does not exist, it will be marked `orphan` as in case 3.
//      Setting: We are not connected, so the property tree is considered read-only.
//      The property will not be set.

// At this point, we do not support addition and removal
// of properties in the backend at runtime.

enum SubscriptionState {
  Pending = 0,
  Orphan = 1,
  Active = 2
}

type SubscriptionInfo = {
  state: SubscriptionState;
  nSubscribers: number;
  subscription?: Topic;
};

// Map from uri to SubscriptionInfo
const subscriptionInfos: { [key: string]: SubscriptionInfo } = {};

function handleUpdatedValues(
  dispatch: Dispatch<UnknownAction>,
  uri: string,
  value: PropertyValue
) {
  // Update the value in the redux property tree, based on the
  // value from the backend.
  dispatch(updatePropertyValue({ uri, value }));

  // "Lazy unsubscribe":
  // Cancel the subscription whenever there is an update from the
  // server, and there are no more active subscibers on the client.
  // (As opposed to cancelling the subscription immediately when the
  //  number of subscribers hits zero)
  const subscriptionInfo = subscriptionInfos[uri];
  if (
    subscriptionInfo &&
    subscriptionInfo.state === SubscriptionState.Active &&
    subscriptionInfo.nSubscribers < 1
  ) {
    if (subscriptionInfo.subscription) {
      subscriptionInfo.subscription.cancel();
    }
    delete subscriptionInfos[uri];
  }
}

function createSubscription(dispatch: Dispatch<UnknownAction>, uri: string) {
  const subscription = api.subscribeToProperty(uri);
  const handleUpdates = (value: PropertyValue) =>
    handleUpdatedValues(dispatch, uri, value);
  const throttleHandleUpdates = throttle(handleUpdates, 200);

  (async () => {
    for await (const data of subscription.iterator()) {
      throttleHandleUpdates(data.Value as PropertyValue);
    }
  })();
  return subscription;
}

function tryPromoteSubscription(
  dispatch: Dispatch<UnknownAction>,
  state: RootState,
  uri: string
) {
  const subscriptionInfo = subscriptionInfos[uri];

  if (!state.connection.isConnected) {
    return;
  }

  if (subscriptionInfo.state === SubscriptionState.Pending) {
    subscriptionInfo.state = SubscriptionState.Orphan;
  }

  // True if property exists, false otherwise
  const propertyInTree = !!state.propertyTree.props.properties[uri];

  if (subscriptionInfo.state === SubscriptionState.Orphan && propertyInTree) {
    subscriptionInfo.subscription = createSubscription(dispatch, uri);
    subscriptionInfo.state = SubscriptionState.Active;
  }
}

function promoteSubscriptions(dispatch: Dispatch<UnknownAction>, state: RootState) {
  // The added properteis may include properties whose
  // uri is marked as a `pending`/`orphan` subscription, so
  // we check if any subscriptions can be promoted to `active`.
  Object.keys(subscriptionInfos).forEach((uri: string) => {
    tryPromoteSubscription(dispatch, state, uri);
  });
}

function markAllSubscriptionsAsPending() {
  Object.keys(subscriptionInfos).forEach((uri: string) => {
    subscriptionInfos[uri].state = SubscriptionState.Pending;
  });
}

/**
 * Utility function to convert an OpenSpace property object to our internal property
 * object
 */
function convertOsPropertyToProperty(prop: OpenSpaceProperty): Property {
  return {
    uri: prop.Description.Identifier,
    value: prop.value,
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

async function internalAddUriToPropertyTree(
  dispatch: Dispatch<UnknownAction>,
  uri: string
) {
  console.log('getting prop for uri:', uri);
  const prop = (await api.getProperty(uri)) as OpenSpaceProperty | OpenSpacePropertyOwner;
  console.log(uri, 'got prop from OS', prop);
  if (!prop) {
    console.error(`Error retrieving property with uri: '${uri}'`);
    return;
  }

  if ('properties' in prop) {
    const { propertyOwners, properties } = flattenPropertyTree(
      prop as OpenSpacePropertyOwner
    );
    dispatch(addPropertyOwners({ propertyOwners: propertyOwners }));
    dispatch(addProperties({ properties: properties }));
    // listenerApi.dispatch(refreshGroups())); // TODO add
  } else {
    const property = convertOsPropertyToProperty(prop);
    dispatch(addProperties({ properties: [property] }));
    // listenerApi.dispatch(refreshGroups())); // TODO add
  }
}

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
  value: string | number | number[] | boolean;
};

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
    actionCreator: addUriToPropertyTree,
    effect: (action, listenerApi) => {
      internalAddUriToPropertyTree(listenerApi.dispatch, action.payload.uri);
    }
  });

  startListening({
    actionCreator: reloadPropertyTree,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(clearPropertyTree());
      internalAddUriToPropertyTree(listenerApi.dispatch, rootOwnerKey);
    }
  });

  startListening({
    actionCreator: onCloseConnection,
    effect: () => {
      markAllSubscriptionsAsPending();
    }
  });

  startListening({
    actionCreator: addProperties,
    effect: (_, listenerApi) => {
      promoteSubscriptions(listenerApi.dispatch, listenerApi.getState());
    }
  });

  startListening({
    actionCreator: setPropertyValue,
    effect: (action, _) => {
      api.setProperty(action.payload.uri, action.payload.value);
    }
  });

  startListening({
    actionCreator: subscribeToProperty,
    effect: (action, listenerApi) => {
      const { uri } = action.payload;
      const subscriptionInfo = subscriptionInfos[uri];
      if (subscriptionInfo) {
        ++subscriptionInfo.nSubscribers;
      } else {
        subscriptionInfos[uri] = {
          state: SubscriptionState.Pending,
          nSubscribers: 1
        };
      }

      tryPromoteSubscription(listenerApi.dispatch, listenerApi.getState(), uri);
    }
  });

  startListening({
    actionCreator: unsubscribeToProperty,
    effect: (action, _) => {
      const { uri } = action.payload;
      const subscriptionInfo = subscriptionInfos[uri];
      if (subscriptionInfo) {
        --subscriptionInfo.nSubscribers;
      }
    }
  });
};
